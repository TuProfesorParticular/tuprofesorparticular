"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { sendNewRefundRequestEmail } from "@/lib/mailer";

// El alumno pide el reembolso de una primera clase ya pagada (ver la
// política de cancelación en /terminos, sección 7). Se limita a reservas
// "paid" sin una solicitud ya en curso, para no machacar una solicitud
// pendiente ni pedir reembolso de algo que no se ha pagado.
export async function requestBookingRefund(formData: FormData) {
  const session = await requireRole("student");
  const bookingId = String(formData.get("bookingId") || "");
  const reason = String(formData.get("reason") || "").trim().slice(0, 1000);
  if (!reason) return;

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, studentId: session.user.id, status: "paid", refundRequestedAt: null },
    include: { teacherProfile: { include: { user: { select: { name: true } } } } },
  });
  if (!booking) return;

  await prisma.booking.update({
    where: { id: booking.id },
    data: { refundRequestedAt: new Date(), refundReason: reason },
  });

  try {
    await sendNewRefundRequestEmail({
      studentName: session.user.name ?? "",
      studentEmail: session.user.email ?? "",
      teacherName: booking.teacherProfile.user.name,
      amount: Number(booking.amount),
      reason,
    });
  } catch {
    // El aviso por email es best-effort: la solicitud ya ha quedado
    // registrada aunque falle el correo.
  }

  revalidatePath("/panel/reservas");
}
