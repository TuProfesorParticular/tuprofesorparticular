"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";

export async function setMaterialStatus(formData: FormData) {
  await requireRole("admin");

  const materialId = String(formData.get("materialId") || "");
  const status = String(formData.get("status") || "");

  if (status !== "approved" && status !== "rejected") return;

  await prisma.material.update({
    where: { id: materialId },
    data: { status },
  });

  revalidatePath("/admin/materiales");
  revalidatePath("/materiales");
}
