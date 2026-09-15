"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { REGION_LABELS } from "@/lib/regions";
import { isVertical } from "@/lib/institutions";
import type { SpanishRegion } from "@prisma/client";

function isSpanishRegion(value: string): value is SpanishRegion {
  return value in REGION_LABELS;
}

export async function addInstitutionContact(formData: FormData) {
  await requireRole("admin");

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const vertical = String(formData.get("vertical") || "");
  const region = String(formData.get("region") || "");
  const province = String(formData.get("province") || "").trim() || null;
  const type = String(formData.get("type") || "").trim() || null;

  if (!name || !email || !isVertical(vertical) || !isSpanishRegion(region)) return;

  await prisma.institutionContact.create({
    data: { name, email, vertical, region, province, type },
  });

  revalidatePath("/admin/contactos");
}

// Pega varias líneas con formato "Nombre;email;provincia;tipo" (provincia y
// tipo opcionales) para dar de alta muchos centros de una comunidad de golpe,
// sin necesidad de subir un archivo.
export async function bulkImportInstitutionContacts(formData: FormData) {
  await requireRole("admin");

  const vertical = String(formData.get("vertical") || "");
  const region = String(formData.get("region") || "");
  const raw = String(formData.get("bulk") || "");
  if (!isVertical(vertical) || !isSpanishRegion(region) || !raw.trim()) return;

  const rows = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, email, province, type] = line.split(";").map((v) => v?.trim() || "");
      return { name, email, province: province || null, type: type || null };
    })
    .filter((row) => row.name && row.email && row.email.includes("@"));

  if (rows.length === 0) return;

  await prisma.institutionContact.createMany({
    data: rows.map((row) => ({ ...row, vertical, region })),
  });

  revalidatePath("/admin/contactos");
}

export async function toggleInstitutionContactActive(formData: FormData) {
  await requireRole("admin");

  const id = String(formData.get("id") || "");
  const contact = await prisma.institutionContact.findUniqueOrThrow({ where: { id } });

  await prisma.institutionContact.update({
    where: { id },
    data: { active: !contact.active },
  });

  revalidatePath("/admin/contactos");
}

// Un centro pide no recibir más envíos (por teléfono, email, etc.). Se
// queda en la base de datos para no perder el registro, pero se excluye de
// cualquier envío futuro — igual que si respondiera "BAJA" al correo.
export async function toggleInstitutionContactUnsubscribed(formData: FormData) {
  await requireRole("admin");

  const id = String(formData.get("id") || "");
  const contact = await prisma.institutionContact.findUniqueOrThrow({ where: { id } });

  await prisma.institutionContact.update({
    where: { id },
    data: { unsubscribed: !contact.unsubscribed },
  });

  revalidatePath("/admin/contactos");
}

export async function deleteInstitutionContact(formData: FormData) {
  await requireRole("admin");

  const id = String(formData.get("id") || "");
  await prisma.institutionContact.delete({ where: { id } });

  revalidatePath("/admin/contactos");
}
