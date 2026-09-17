"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import type { Vertical } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/tokens";
import { sendVerificationEmail, sendNewTeacherRegisteredEmail } from "@/lib/mailer";
import { FOUNDER_LIMIT, addFounderTrialMonths } from "@/lib/plans";
import { VERTICALS, DEFAULT_VERTICAL } from "@/lib/constants";
import { isLikelyBot } from "@/lib/antispam";

const VERTICAL_SLUGS = VERTICALS.map((v) => v.slug) as [string, ...string[]];

const registerSchema = z.object({
  name: z.string().min(2, "Introduce tu nombre completo"),
  email: z.string().email("Introduce un email válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["student", "teacher"], {
    message: "Selecciona si eres alumno o profesor",
  }),
  vertical: z.enum(VERTICAL_SLUGS).optional(),
  ref: z.string().optional(),
  acceptTerms: z.literal("on", {
    message: "Debes aceptar los Términos y la Política de Privacidad",
  }),
});

export type RegisterState = {
  error?: string;
};

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  if (isLikelyBot(formData)) {
    return { error: "No se ha podido procesar el registro. Inténtalo de nuevo." };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    vertical: formData.get("vertical") || undefined,
    ref: formData.get("ref") || undefined,
    acceptTerms: formData.get("acceptTerms"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { name, email, password, role, ref } = parsed.data;
  const vertical = (parsed.data.vertical ?? DEFAULT_VERTICAL) as Vertical;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe una cuenta registrada con ese email" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Programa de referidos: solo cuenta entre profesores (ver
  // REFERRAL_REWARD_DAYS) — un link con ?ref=<id> a un alumno no hace nada.
  let referredById: string | undefined;
  if (role === "teacher" && ref) {
    const referrer = await prisma.user.findUnique({
      where: { id: ref },
      select: { id: true, role: true },
    });
    if (referrer && referrer.role === "teacher") {
      referredById = referrer.id;
    }
  }

  // El cupo de "100 fundadores" es independiente por ámbito (Educación,
  // Deporte, Salud Mental) — no un único cupo global de 100.
  let isFounder = false;
  if (role === "teacher") {
    const founderCount = await prisma.teacherProfile.count({
      where: { isFounder: true, vertical },
    });
    isFounder = founderCount < FOUNDER_LIMIT;
  }

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      ...(referredById ? { referredById } : {}),
      ...(role === "teacher"
        ? {
            teacherProfile: {
              create: {
                pricePerHour: 0,
                modality: "online",
                status: "pending",
                vertical,
                ...(isFounder
                  ? {
                      isFounder: true,
                      plan: "pro",
                      founderProUntil: addFounderTrialMonths(new Date()),
                    }
                  : {}),
              },
            },
          }
        : {}),
    },
  });

  if (role === "teacher") {
    try {
      await sendNewTeacherRegisteredEmail({
        name,
        email,
        verticalLabel: VERTICALS.find((v) => v.slug === vertical)?.label ?? vertical,
      });
    } catch {
      // Best-effort: el registro ya se ha completado aunque falle este aviso.
    }
  }

  const token = generateToken();
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  await sendVerificationEmail(email, token);

  redirect("/registro/confirmacion");
}
