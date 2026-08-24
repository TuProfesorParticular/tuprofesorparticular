"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { requireStripe } from "@/lib/stripe";
import { getPlan, getBasePrice, getDiscountedPrice, isInFounderFreeTrial } from "@/lib/plans";
import { getMonthlyMaterialCount } from "@/lib/materials";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

export async function startSubscriptionCheckout(formData: FormData) {
  const session = await requireRole("teacher");
  const planId = String(formData.get("plan") || "");
  if (planId !== "pro" && planId !== "premium") return;

  const stripe = requireStripe();

  const teacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { userId: session.user.id },
    include: { user: true },
  });

  let customerId = teacherProfile.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: teacherProfile.user.email,
      name: teacherProfile.user.name,
      metadata: { teacherProfileId: teacherProfile.id },
    });
    customerId = customer.id;
    await prisma.teacherProfile.update({
      where: { id: teacherProfile.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const plan = getPlan(planId);
  const basePrice = getBasePrice(planId, teacherProfile);
  const materialsThisMonth = await getMonthlyMaterialCount(teacherProfile.id);
  const price = getDiscountedPrice(basePrice, materialsThisMonth);

  // Un fundador que todavía está en su ventana de Pro gratis y sube de
  // plan no debe pagar nada hasta que esa ventana termine.
  const trialEnd =
    isInFounderFreeTrial(teacherProfile) && teacherProfile.founderProUntil
      ? Math.floor(teacherProfile.founderProUntil.getTime() / 1000)
      : undefined;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: Math.round(price * 100),
          recurring: { interval: "month" },
          product_data: {
            name: `TuProfesorParticular — Plan ${plan.name}`,
            ...(materialsThisMonth > 0
              ? {
                  description: `Incluye tu descuento por ${materialsThisMonth} material(es) compartido(s) este mes`,
                }
              : {}),
          },
        },
        quantity: 1,
      },
    ],
    ...(trialEnd ? { subscription_data: { trial_end: trialEnd } } : {}),
    success_url: `${APP_URL}/panel/suscripcion?success=1`,
    cancel_url: `${APP_URL}/panel/suscripcion?canceled=1`,
    metadata: { teacherProfileId: teacherProfile.id, plan: planId },
  });

  if (!checkoutSession.url) {
    throw new Error("Stripe no devolvió una URL de checkout");
  }

  redirect(checkoutSession.url);
}

export async function openBillingPortal() {
  const session = await requireRole("teacher");
  const stripe = requireStripe();

  const teacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { userId: session.user.id },
  });

  if (!teacherProfile.stripeCustomerId) {
    redirect("/panel/suscripcion");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: teacherProfile.stripeCustomerId,
    return_url: `${APP_URL}/panel/suscripcion`,
  });

  redirect(portalSession.url);
}
