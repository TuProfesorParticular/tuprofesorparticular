"use server";

import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { requireStripe } from "@/lib/stripe";
import { computePlatformFeeCents } from "@/lib/plans";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

export async function bookFirstClass(formData: FormData) {
  const session = await requireSession();
  const teacherProfileId = String(formData.get("teacherProfileId") || "");

  const teacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { id: teacherProfileId },
    include: { user: true },
  });

  if (teacherProfile.userId === session.user.id) {
    redirect(`/profesores/${teacherProfileId}`);
  }
  if (!teacherProfile.stripeConnectAccountId || !teacherProfile.stripeConnectOnboarded) {
    redirect(`/profesores/${teacherProfileId}`);
  }

  const existing = await prisma.booking.findUnique({
    where: {
      studentId_teacherProfileId: {
        studentId: session.user.id,
        teacherProfileId,
      },
    },
  });
  if (existing?.status === "paid") {
    redirect(`/profesores/${teacherProfileId}?reserva=ya-existe`);
  }

  const stripe = requireStripe();

  const amount = Number(teacherProfile.pricePerHour);
  const amountCents = Math.round(amount * 100);
  const platformFeeCents = computePlatformFeeCents(amountCents);

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: amountCents,
          product_data: {
            name: `Primera clase con ${teacherProfile.user.name}`,
          },
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: platformFeeCents,
      transfer_data: {
        destination: teacherProfile.stripeConnectAccountId,
      },
    },
    success_url: `${APP_URL}/profesores/${teacherProfileId}?reserva=exito`,
    cancel_url: `${APP_URL}/profesores/${teacherProfileId}?reserva=cancelada`,
    metadata: {
      studentId: session.user.id,
      teacherProfileId,
    },
  });

  if (!checkoutSession.url) {
    throw new Error("Stripe no devolvió una URL de checkout");
  }

  await prisma.booking.upsert({
    where: {
      studentId_teacherProfileId: {
        studentId: session.user.id,
        teacherProfileId,
      },
    },
    create: {
      studentId: session.user.id,
      teacherProfileId,
      amount,
      platformFeeAmount: platformFeeCents / 100,
      status: "pending",
      stripeCheckoutSessionId: checkoutSession.id,
    },
    update: {
      status: "pending",
      amount,
      platformFeeAmount: platformFeeCents / 100,
      stripeCheckoutSessionId: checkoutSession.id,
    },
  });

  redirect(checkoutSession.url);
}
