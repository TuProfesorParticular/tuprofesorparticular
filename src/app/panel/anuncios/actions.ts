"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { LEVEL_ORDER } from "@/lib/constants";
import { containsBannedLanguage, MODERATION_ERROR_MESSAGE } from "@/lib/moderation";

const schema = z.object({
  title: z.string().min(2, "Introduce un título").max(200),
  description: z.string().min(2, "Cuéntanos qué necesitas").max(1000),
  subjectId: z.string().min(1, "Selecciona una materia"),
  level: z.enum(LEVEL_ORDER as [string, ...string[]], {
    message: "Selecciona un nivel",
  }),
  modality: z.enum(["in_person", "online", "both"], {
    message: "Selecciona una modalidad",
  }),
  city: z.string().max(100).optional(),
  budgetPerHour: z.coerce.number().positive().max(1000).optional(),
});

export type CreateStudentRequestState = {
  success?: boolean;
  error?: string;
};

export async function createStudentRequest(
  _prevState: CreateStudentRequestState,
  formData: FormData,
): Promise<CreateStudentRequestState> {
  const session = await requireRole("student");

  const rawBudget = formData.get("budgetPerHour");

  const parsed = schema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    subjectId: formData.get("subjectId"),
    level: formData.get("level"),
    modality: formData.get("modality"),
    city: formData.get("city") || undefined,
    budgetPerHour: rawBudget ? rawBudget : undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  if (
    containsBannedLanguage(parsed.data.title) ||
    containsBannedLanguage(parsed.data.description)
  ) {
    return { error: MODERATION_ERROR_MESSAGE };
  }

  await prisma.studentRequest.create({
    data: {
      studentId: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      subjectId: parsed.data.subjectId,
      level: parsed.data.level as (typeof LEVEL_ORDER)[number],
      modality: parsed.data.modality,
      city: parsed.data.city,
      budgetPerHour: parsed.data.budgetPerHour,
    },
  });

  revalidatePath("/panel/anuncios");
  revalidatePath("/panel/alumnos");

  return { success: true };
}

export async function closeStudentRequest(formData: FormData) {
  const session = await requireRole("student");
  const requestId = String(formData.get("requestId") || "");

  const request = await prisma.studentRequest.findUnique({
    where: { id: requestId },
  });

  if (!request || request.studentId !== session.user.id) {
    return;
  }

  await prisma.studentRequest.update({
    where: { id: requestId },
    data: { status: request.status === "open" ? "closed" : "open" },
  });

  revalidatePath("/panel/anuncios");
  revalidatePath("/panel/alumnos");
}

export async function deleteStudentRequest(formData: FormData) {
  const session = await requireRole("student");
  const requestId = String(formData.get("requestId") || "");

  const request = await prisma.studentRequest.findUnique({
    where: { id: requestId },
  });

  if (!request || request.studentId !== session.user.id) {
    return;
  }

  await prisma.studentRequest.delete({ where: { id: requestId } });

  revalidatePath("/panel/anuncios");
  revalidatePath("/panel/alumnos");
}
