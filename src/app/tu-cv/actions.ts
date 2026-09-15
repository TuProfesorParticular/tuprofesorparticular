"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { requireStripe } from "@/lib/stripe";
import { CV_REGION_PRICE, CV_NATIONWIDE_PRICE, REGION_LABELS } from "@/lib/regions";
import { INSTITUTION_COPY } from "@/lib/institutions";
import type { SpanishRegion, Vertical } from "@prisma/client";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

function isSpanishRegion(value: string): value is SpanishRegion {
  return value in REGION_LABELS;
}

// Solo compra el acceso a la comunidad (o a toda España). El CV se sube y
// el envío se confirma DESPUÉS del pago, desde /tu-cv/envios/[id].
export async function startCvCampaignCheckout(formData: FormData) {
  const session = await requireRole("teacher");

  const regionRaw = String(formData.get("region") || "");
  const nationwide = regionRaw === "nationwide";
  const region: SpanishRegion | null = nationwide ? null : (regionRaw as SpanishRegion);

  if (!nationwide && !isSpanishRegion(regionRaw)) {
    redirect("/tu-cv");
  }

  const amount = nationwide ? CV_NATIONWIDE_PRICE : CV_REGION_PRICE;

  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId: session.user.id },
    select: { vertical: true },
  });
  const vertical: Vertical = teacherProfile?.vertical ?? "educacion";

  const campaign = await prisma.cvCampaign.create({
    data: {
      userId: session.user.id,
      vertical,
      region,
      nationwide,
      amount,
    },
  });

  const stripe = requireStripe();

  const scopeName = nationwide ? "toda España" : REGION_LABELS[region as SpanishRegion];
  const institutionLabel = INSTITUTION_COPY[vertical].pluralLower;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: `Envío de CV a ${institutionLabel} — ${scopeName}`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${APP_URL}/tu-cv/comprar?exito=1`,
    cancel_url: `${APP_URL}/tu-cv/comprar?region=${regionRaw}&cancelado=1`,
    metadata: {
      type: "cv_campaign",
      cvCampaignId: campaign.id,
    },
  });

  if (!checkoutSession.url) {
    throw new Error("Stripe no devolvió una URL de checkout");
  }

  await prisma.cvCampaign.update({
    where: { id: campaign.id },
    data: { stripeCheckoutSessionId: checkoutSession.id },
  });

  redirect(checkoutSession.url);
}
