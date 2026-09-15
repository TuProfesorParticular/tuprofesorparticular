"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { requireStripe } from "@/lib/stripe";
import { sendRefundResolvedEmail, sendReferralRewardEmail } from "@/lib/mailer";
import { REFERRAL_REWARD_DAYS } from "@/lib/plans";

export async function setTeacherProfileStatus(formData: FormData) {
  await requireRole("admin");

  const teacherProfileId = String(formData.get("teacherProfileId"));
  const status = String(formData.get("status"));

  if (status !== "approved" && status !== "rejected") return;

  await prisma.teacherProfile.update({
    where: { id: teacherProfileId },
    data: { status },
  });

  if (status === "approved") {
    await grantReferralRewardIfDue(teacherProfileId);
  }

  revalidatePath("/admin");
}

// Si el profesor recién aprobado fue invitado por otro profesor y todavía
// no se le ha dado la recompensa, se la damos ahora: REFERRAL_REWARD_DAYS
// días de Pro gratis para quien invitó (ver isInFounderFreeTrial, que
// reutiliza el mismo founderProUntil). El flag referralRewardGranted vive en
// el perfil del RECOMENDADO para no volver a premiar si el admin despublica
// y vuelve a publicar su anuncio más adelante.
async function grantReferralRewardIfDue(teacherProfileId: string) {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { id: teacherProfileId },
    include: { user: { select: { name: true, referredById: true } } },
  });
  if (!teacherProfile || teacherProfile.referralRewardGranted || !teacherProfile.user.referredById) {
    return;
  }

  const referrerProfile = await prisma.teacherProfile.findUnique({
    where: { userId: teacherProfile.user.referredById },
    include: { user: { select: { email: true } } },
  });
  if (!referrerProfile) return;

  const base =
    referrerProfile.founderProUntil && referrerProfile.founderProUntil.getTime() > Date.now()
      ? referrerProfile.founderProUntil
      : new Date();
  const rewardUntil = new Date(base.getTime() + REFERRAL_REWARD_DAYS * 24 * 60 * 60 * 1000);

  await prisma.$transaction([
    prisma.teacherProfile.update({
      where: { id: teacherProfileId },
      data: { referralRewardGranted: true },
    }),
    prisma.teacherProfile.update({
      where: { id: referrerProfile.id },
      data: {
        founderProUntil: rewardUntil,
        // No degradamos a alguien que ya esté en Premium.
        plan: referrerProfile.plan === "premium" ? "premium" : "pro",
      },
    }),
  ]);

  try {
    await sendReferralRewardEmail({
      referrerEmail: referrerProfile.user.email,
      referredName: teacherProfile.user.name,
      rewardDays: REFERRAL_REWARD_DAYS,
    });
  } catch {
    // Best-effort: la recompensa ya ha quedado aplicada aunque falle el email.
  }
}

export async function toggleUserStatus(formData: FormData) {
  const session = await requireRole("admin");

  const userId = String(formData.get("userId"));
  if (userId === session.user.id) return;

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  await prisma.user.update({
    where: { id: userId },
    data: { status: user.status === "active" ? "suspended" : "active" },
  });

  revalidatePath("/admin");
}

export async function setEthicsReportStatus(formData: FormData) {
  await requireRole("admin");

  const reportId = String(formData.get("reportId"));
  const status = String(formData.get("status"));

  if (status !== "reviewed" && status !== "closed" && status !== "open") return;

  await prisma.ethicsReport.update({
    where: { id: reportId },
    data: { status },
  });

  revalidatePath("/admin");
}

export async function setSuggestionStatus(formData: FormData) {
  await requireRole("admin");

  const suggestionId = String(formData.get("suggestionId"));
  const status = String(formData.get("status"));

  if (status !== "reviewed" && status !== "closed" && status !== "open") return;

  await prisma.suggestion.update({
    where: { id: suggestionId },
    data: { status },
  });

  revalidatePath("/admin");
}

// Aprueba una solicitud de reembolso: devuelve el cargo en Stripe (tanto la
// parte transferida al profesional como la comisión de la plataforma) y
// marca la reserva como reembolsada. Si el profesional ya se ha gastado los
// fondos transferidos, Stripe deja el saldo de su cuenta Connect en
// negativo hasta su próxima transferencia — es el comportamiento estándar
// de Stripe Connect, no algo que gestionemos nosotros.
export async function approveRefundRequest(formData: FormData) {
  await requireRole("admin");
  const bookingId = String(formData.get("bookingId") || "");

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, status: "paid", refundRequestedAt: { not: null } },
    include: {
      student: { select: { email: true } },
      teacherProfile: { include: { user: { select: { name: true } } } },
    },
  });
  if (!booking || !booking.stripePaymentIntentId) return;

  const stripe = requireStripe();
  await stripe.refunds.create({
    payment_intent: booking.stripePaymentIntentId,
    reverse_transfer: true,
    refund_application_fee: true,
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "refunded" },
  });

  try {
    await sendRefundResolvedEmail({
      studentEmail: booking.student.email,
      teacherName: booking.teacherProfile.user.name,
      amount: Number(booking.amount),
      approved: true,
    });
  } catch {
    // Best-effort: el reembolso ya se ha hecho en Stripe aunque falle el email.
  }

  revalidatePath("/admin");
  revalidatePath("/panel/reservas");
}

// Descarta una solicitud de reembolso sin devolver el dinero: la reserva
// sigue "paid" y el alumno puede volver a intentarlo si cambia algo.
export async function dismissRefundRequest(formData: FormData) {
  await requireRole("admin");
  const bookingId = String(formData.get("bookingId") || "");

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, status: "paid", refundRequestedAt: { not: null } },
    include: {
      student: { select: { email: true } },
      teacherProfile: { include: { user: { select: { name: true } } } },
    },
  });
  if (!booking) return;

  await prisma.booking.update({
    where: { id: booking.id },
    data: { refundRequestedAt: null, refundReason: null },
  });

  try {
    await sendRefundResolvedEmail({
      studentEmail: booking.student.email,
      teacherName: booking.teacherProfile.user.name,
      amount: Number(booking.amount),
      approved: false,
    });
  } catch {
    // Best-effort.
  }

  revalidatePath("/admin");
  revalidatePath("/panel/reservas");
}

export async function adminDeleteStudentRequest(formData: FormData) {
  await requireRole("admin");

  const requestId = String(formData.get("requestId") || "");
  await prisma.studentRequest.delete({ where: { id: requestId } });

  revalidatePath("/admin");
}

// Elimina una cuenta por completo (alumno o profesor), incluyendo todo lo que
// dependa de ella y que Prisma no borre en cascada automáticamente
// (conversaciones/mensajes, reseñas y reservas hechas como alumno, reportes
// éticos enviados, y reservas recibidas como profesor).
export async function adminDeleteUser(formData: FormData) {
  const session = await requireRole("admin");

  const userId = String(formData.get("userId") || "");
  if (!userId || userId === session.user.id) return;

  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  await prisma.$transaction([
    prisma.conversation.deleteMany({
      where: { OR: [{ studentId: userId }, { teacherId: userId }] },
    }),
    prisma.review.deleteMany({ where: { studentId: userId } }),
    prisma.booking.deleteMany({ where: { studentId: userId } }),
    prisma.ethicsReport.deleteMany({ where: { reporterId: userId } }),
    ...(teacherProfile
      ? [prisma.booking.deleteMany({ where: { teacherProfileId: teacherProfile.id } })]
      : []),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  revalidatePath("/admin");
}
