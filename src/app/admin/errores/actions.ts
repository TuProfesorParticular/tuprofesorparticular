"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";

export async function clearErrorLog(formData: FormData) {
  await requireRole("admin");
  const id = String(formData.get("id") || "");
  await prisma.errorLog.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/errores");
}

export async function clearAllErrorLogs() {
  await requireRole("admin");
  await prisma.errorLog.deleteMany({});
  revalidatePath("/admin/errores");
}
