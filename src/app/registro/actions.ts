"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mailer";
import { FOUNDER_LIMIT, addFounderTrialMonths } from "@/lib/plans";

const registerSchema = z.object({
  name: z.string().min(2, "Introduce tu nombre completo"),
  email: z.string().email("Introduce un email válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["student", "teacher"], {
    message: "Selecciona si eres alumno o profesor",
  }),
});

export type RegisterState = {
  error?: string;
};

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { name, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe una cuenta registrada con ese email" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  let isFounder = false;
  if (role === "teacher") {
    const founderCount = await prisma.teacherProfile.count({
      where: { isFounder: true },
    });
    isFounder = founderCount < FOUNDER_LIMIT;
  }

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      ...(role === "teacher"
        ? {
            teacherProfile: {
              create: {
                pricePerHour: 0,
                modality: "online",
                status: "pending",
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
