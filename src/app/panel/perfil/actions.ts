"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { uploadAvatar } from "@/lib/storage";
import { getPlan } from "@/lib/plans";

const schema = z.object({
  bio: z.string().max(1000).optional(),
  pricePerHour: z.coerce.number().min(0).max(1000),
  modality: z.enum(["in_person", "online", "both"]),
  city: z.string().max(120).optional(),
  postalCode: z.string().max(20).optional(),
  experienceText: z.string().max(2000).optional(),
});

export type EditProfileState = {
  success?: boolean;
  error?: string;
};

export async function updateTeacherProfile(
  _prevState: EditProfileState,
  formData: FormData,
): Promise<EditProfileState> {
  const session = await requireRole("teacher");

  const parsed = schema.safeParse({
    bio: formData.get("bio") || undefined,
    pricePerHour: formData.get("pricePerHour"),
    modality: formData.get("modality"),
    city: formData.get("city") || undefined,
    postalCode: formData.get("postalCode") || undefined,
    experienceText: formData.get("experienceText") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const subjectIds = formData.getAll("subjectIds").map(String).filter(Boolean);
  const levels = formData
    .getAll("levels")
    .map(String)
    .filter((level): level is "primaria" | "eso" | "bachillerato" | "universidad" | "adultos" =>
      ["primaria", "eso", "bachillerato", "universidad", "adultos"].includes(level),
    );

  const teacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { userId: session.user.id },
  });

  const maxSubjects = getPlan(teacherProfile.plan).maxSubjects;
  if (maxSubjects !== null && subjectIds.length > maxSubjects) {
    return {
      error: `Tu plan actual (${getPlan(teacherProfile.plan).name}) permite hasta ${maxSubjects} materia${maxSubjects === 1 ? "" : "s"}. Mejora tu plan en "Mi suscripción" para añadir más.`,
    };
  }

  const avatarFile = formData.get("avatar");
  let avatarUrl: string | undefined;

  if (avatarFile instanceof File && avatarFile.size > 0) {
    avatarUrl = await uploadAvatar(session.user.id, avatarFile);
  }

  await prisma.$transaction([
    prisma.teacherProfile.update({
      where: { id: teacherProfile.id },
      data: {
        bio: parsed.data.bio,
        pricePerHour: parsed.data.pricePerHour,
        modality: parsed.data.modality,
        city: parsed.data.city,
        postalCode: parsed.data.postalCode,
        experienceText: parsed.data.experienceText,
      },
    }),
    prisma.teacherSubject.deleteMany({
      where: { teacherProfileId: teacherProfile.id },
    }),
    ...(subjectIds.length > 0
      ? [
          prisma.teacherSubject.createMany({
            data:
              levels.length > 0
                ? subjectIds.flatMap((subjectId) =>
                    levels.map((level) => ({
                      teacherProfileId: teacherProfile.id,
                      subjectId,
                      level,
                    })),
                  )
                : // Materias de deporte / salud mental no tienen nivel educativo.
                  subjectIds.map((subjectId) => ({
                    teacherProfileId: teacherProfile.id,
                    subjectId,
                    level: null,
                  })),
          }),
        ]
      : []),
    ...(avatarUrl
      ? [
          prisma.user.update({
            where: { id: session.user.id },
            data: { avatarUrl },
          }),
        ]
      : []),
  ]);

  revalidatePath("/panel/perfil");
  revalidatePath(`/profesores/${teacherProfile.id}`);

  return { success: true };
}
