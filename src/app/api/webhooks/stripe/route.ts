import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type { TeacherPlan } from "@prisma/client";
import { FOUNDER_PRICES } from "@/lib/plans";
import { sendBookingConfirmedEmails } from "@/lib/mailer";

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

      if (session.mode === "payment" && session.metadata?.type === "cv_campaign") {
        await handleCvCampaignPaid(session);
      } else if (session.mode === "payment") {
        await handleBookingPaid(session);
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

// Al confirmarse el pago de la primera clase: se marca la reserva como
// pagada y se avisa por email tanto al alumno (recibo) como al profesional
// (aviso de nueva reserva) — antes de esto, un pago real no generaba
// ningún correo de confirmación.
async function handleBookingPaid(session: Stripe.Checkout.Session) {
  const booking = await prisma.booking.findFirst({
    where: { stripeCheckoutSessionId: session.id },
    include: {
      student: { select: { name: true, email: true } },
      teacherProfile: { include: { user: { select: { name: true, email: true } } } },
    },
  });
  if (!booking || booking.status === "paid") return;

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: "paid",
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id,
    },
  });

  try {
    await sendBookingConfirmedEmails({
      studentName: booking.student.name,
      studentEmail: booking.student.email,
      teacherName: booking.teacherProfile.user.name,
      teacherEmail: booking.teacherProfile.user.email,
      amount: Number(booking.amount),
      platformFeeAmount: Number(booking.platformFeeAmount),
      teacherProfileId: booking.teacherProfileId,
    });
  } catch {
    // No bloquea el webhook: la reserva ya ha quedado pagada aunque falle
    // el email de confirmación.
  }
}

// Al confirmarse el pago de un envío de CV, solo lo marca como pagado — el
// profesional todavía tiene que subir su CV y confirmar a qué centros se
// envía desde su panel (ver /tu-cv/envios/[id]).
async function handleCvCampaignPaid(session: Stripe.Checkout.Session) {
  const cvCampaignId = session.metadata?.cvCampaignId;
  if (!cvCampaignId) return;

  const campaign = await prisma.cvCampaign.findUnique({
    where: { id: cvCampaignId },
  });
  if (!campaign || campaign.status !== "pending") return;

  await prisma.cvCampaign.update({
    where: { id: campaign.id },
    data: { status: "paid" },
  });
}
