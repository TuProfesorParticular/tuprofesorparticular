"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-helpers";
import { signOut } from "@/lib/auth";

export type AccountFormState = {
  success?: boolean;
  error?: string;
};

const profileSchema = z.object({
  name: z.string().min(2, "Introduce tu nombre completo"),
  email: z.string().email("Introduce un email válido"),
});

export async function updateAccountInfo(
  _prevState: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const session = await requireSession();

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { name, email } = parsed.data;

  if (email !== session.user.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "Ya existe una cuenta registrada con ese email" };
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, email },
  });

  revalidatePath("/panel/cuenta");
  return { success: true };
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Introduce tu contraseña actual"),
    newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas nuevas no coinciden",
    path: ["confirmPassword"],
  });

export async function changePassword(
  _prevState: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const session = await requireSession();

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });

  if (!user.passwordHash) {
    return { error: "Esta cuenta no tiene contraseña configurada" };
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) {
    return { error: "La contraseña actual no es correcta" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash },
  });

  return { success: true };
}

// Activa/desactiva el resumen semanal por email (ver sendWeeklyDigestEmail
// y /api/cron/weekly-digest) desde el checkbox de "Mi cuenta".
export async function toggleWeeklyDigest(formData: FormData) {
  const session = await requireSession();
  if (session.user.role !== "teacher") return;

  const optOut = formData.get("weeklyDigestOptOut") !== "on";
  await prisma.teacherProfile.update({
    where: { userId: session.user.id },
    data: { weeklyDigestOptOut: optOut },
  });

  revalidatePath("/panel/cuenta");
}

// Borrado de la propia cuenta (RGPD, derecho de supresión). Misma lógica
// segura que el borrado desde el panel de admin, pero aplicada a uno mismo:
// limpia primero lo que no tiene cascada automática antes del borrado final.
export async function deleteOwnAccount(formData: FormData) {
  const session = await requireSession();
  const confirmation = String(formData.get("confirmation") || "");

  if (confirmation !== "ELIMINAR") {
    return;
  }

  const userId = session.user.id;

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

  await signOut({ redirectTo: "/" });
}
