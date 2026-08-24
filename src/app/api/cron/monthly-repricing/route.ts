import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getBasePrice, getDiscountedPrice } from "@/lib/plans";
import { getPreviousMonthMaterialCount } from "@/lib/materials";

// Se ejecuta una vez al mes (ver vercel.json): recalcula el precio de cada
// suscripción activa según los materiales subidos el mes que acaba de
// terminar. Si un profesor no subió nada, su próxima cuota vuelve al precio
// base del plan — el precio base es el de fundador (fijo para siempre) si
// aplica, o el normal en caso contrario; el descuento por materiales nunca
// queda fijado para siempre.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Fundadores cuya ventana de Pro gratis ya pasó y nunca llegaron a pagar
  // ni siquiera al precio de fundador: vuelven a Gratis. Es una red de
  // seguridad mensual para cuentas que no han vuelto a entrar en el panel
  // (donde ya se hace esta comprobación al vuelo).
  const expiredFounders = await prisma.teacherProfile.updateMany({
    where: {
      isFounder: true,
      plan: "pro",
      stripeSubscriptionId: null,
      founderProUntil: { lt: new Date() },
    },
    data: { plan: "free" },
  });

  if (!stripe) {
    return NextResponse.json({
      skipped: "Stripe no configurado",
      expiredFounders: expiredFounders.count,
    });
  }

  const teacherProfiles = await prisma.teacherProfile.findMany({
    where: {
      plan: { in: ["pro", "premium"] },
      stripeSubscriptionId: { not: null },
      subscriptionStatus: "active",
    },
  });

  const results: { teacherProfileId: string; newPrice: number }[] = [];

  for (const teacherProfile of teacherProfiles) {
    if (!teacherProfile.stripeSubscriptionId) continue;

    const basePrice =
      teacherProfile.founderLockedPrice != null
        ? Number(teacherProfile.founderLockedPrice)
        : getBasePrice(teacherProfile.plan, teacherProfile);
    const materialsLastMonth = await getPreviousMonthMaterialCount(teacherProfile.id);
    const newPrice = getDiscountedPrice(basePrice, materialsLastMonth);

    const subscription = await stripe.subscriptions.retrieve(
      teacherProfile.stripeSubscriptionId,
    );
    const item = subscription.items.data[0];
    if (!item) continue;

    await stripe.subscriptions.update(teacherProfile.stripeSubscriptionId, {
      items: [
        {
          id: item.id,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(newPrice * 100),
            recurring: { interval: "month" },
            product: typeof item.price.product === "string" ? item.price.product : item.price.product.id,
          },
        },
      ],
      proration_behavior: "none",
    });

    results.push({ teacherProfileId: teacherProfile.id, newPrice });
  }

  return NextResponse.json({
    updated: results.length,
    results,
    expiredFounders: expiredFounders.count,
  });
}
