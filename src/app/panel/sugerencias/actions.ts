"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { isLikelyBot } from "@/lib/antispam";
import { sendNewSuggestionEmail } from "@/lib/mailer";

const schema = z.object({
  category: z.enum(["error", "mejora", "otro"]),
  message: z
    .string()
    .min(10, "Cuéntanos con algo más de detalle (mínimo 10 caracteres)")
    .max(3000),
});

export type SuggestionState = {
  success?: boolean;
  error?: string;
};

export async function submitSuggestion(
  _prevState: SuggestionState,
  formData: FormData,
): Promise<SuggestionState> {
  const session = await requireSession();

  if (isLikelyBot(formData)) {
    return { error: "No se ha podido enviar. Inténtalo de nuevo." };
  }

  const parsed = schema.safeParse({
    category: formData.get("category"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.suggestion.create({
    data: {
      userId: session.user.id,
      category: parsed.data.category,
      message: parsed.data.message,
    },
  });

  // El aviso por email es un extra para que llegue al momento — si falla
  // (Resend caído, etc.) la sugerencia ya ha quedado guardada igualmente.
  try {
    await sendNewSuggestionEmail({
      authorName: session.user.name || "Usuario",
      authorEmail: session.user.email ?? "",
      role: session.user.role,
      category: parsed.data.category,
      message: parsed.data.message,
    });
  } catch {
    // no-op: la sugerencia sigue visible en /admin aunque falle el email
  }

  revalidatePath("/panel/sugerencias");

  return { success: true };
}
