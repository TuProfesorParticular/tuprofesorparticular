import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type { TeacherPlan } from "@prisma/client";
import { FOUNDER_PRICES } from "@/lib/plans";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe no configurado" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Falta la firma" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: `Firma inválida: ${(error as Error).message}` },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode === "payment") {
        await prisma.booking.updateMany({
          where: { stripeCheckoutSessionId: session.id },
          data: {
            status: "paid",
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id,
          },
        });
      }

      if (session.mode === "subscription") {
        const teacherProfileId = session.metadata?.teacherProfileId;
        const plan = session.metadata?.plan as TeacherPlan | undefined;
        if (teacherProfileId && plan) {
          const teacherProfile = await prisma.teacherProfile.findUnique({
            where: { id: teacherProfileId },
          });
          await prisma.teacherProfile.update({
            where: { id: teacherProfileId },
            data: {
              plan,
              stripeSubscriptionId:
                typeof session.subscription === "string"
                  ? session.subscription
                  : session.subscription?.id,
              subscriptionStatus: "active",
              // Un fundador que empieza a pagar deja fijado su precio de
              // fundador para siempre, sin depender de la ventana gratis.
              ...(teacherProfile?.isFounder && (plan === "pro" || plan === "premium")
                ? { founderLockedPrice: FOUNDER_PRICES[plan] }
                : {}),
            },
          });
        }
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const teacherProfile = await prisma.teacherProfile.findUnique({
        where: { stripeSubscriptionId: subscription.id },
      });
      if (teacherProfile) {
        const isActive =
          subscription.status === "active" || subscription.status === "trialing";
        await prisma.teacherProfile.update({
          where: { id: teacherProfile.id },
          data: {
            subscriptionStatus: subscription.status,
            plan: isActive ? teacherProfile.plan : "free",
          },
        });
      }
      break;
    }

    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      await prisma.teacherProfile.updateMany({
        where: { stripeConnectAccountId: account.id },
        data: {
          stripeConnectOnboarded: Boolean(
            account.details_submitted && account.charges_enabled,
          ),
        },
      });
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
