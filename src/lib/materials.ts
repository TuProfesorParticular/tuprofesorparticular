import type { MaterialCourse } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function getMaterialsByCategory(category: string) {
  return prisma.material.findMany({
    where: { subject: { category: { equals: category, mode: "insensitive" } } },
    include: {
      subject: true,
      teacherProfile: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function getMaterialsByCategoryAndCourse(category: string, course: MaterialCourse) {
  return prisma.material.findMany({
    where: {
      course,
      subject: { category: { equals: category, mode: "insensitive" } },
    },
    include: {
      subject: true,
      teacherProfile: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMaterialCountsByCourse(category: string) {
  const materials = await prisma.material.findMany({
    where: { subject: { category: { equals: category, mode: "insensitive" } } },
    select: { course: true },
  });

  const counts = new Map<MaterialCourse, number>();
  for (const material of materials) {
    counts.set(material.course, (counts.get(material.course) ?? 0) + 1);
  }
  return counts;
}

export async function getMaterialCountsBySubject(category: string) {
  const materials = await prisma.material.findMany({
    where: { subject: { category: { equals: category, mode: "insensitive" } } },
    select: { subjectId: true },
  });

  const counts = new Map<string, number>();
  for (const material of materials) {
    counts.set(material.subjectId, (counts.get(material.subjectId) ?? 0) + 1);
  }
  return counts;
}

export function getMaterialsBySubject(subjectId: string) {
  return prisma.material.findMany({
    where: { subjectId },
    include: {
      subject: true,
      teacherProfile: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function getMaterialsForTeacher(teacherProfileId: string) {
  return prisma.material.findMany({
    where: { teacherProfileId },
    include: { subject: true },
    orderBy: { createdAt: "desc" },
  });
}

// Materiales subidos por el profesor en lo que va del mes natural actual —
// base del descuento que se ve/cobra al suscribirse o cambiar de plan hoy.
export function getMonthlyMaterialCount(teacherProfileId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return prisma.material.count({
    where: {
      teacherProfileId,
      createdAt: { gte: startOfMonth },
    },
  });
}

// Materiales subidos durante el mes natural ANTERIOR (ya cerrado) — base del
// descuento que se aplica a la cuota de cada renovación mensual.
export function getPreviousMonthMaterialCount(teacherProfileId: string) {
  const now = new Date();
  const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return prisma.material.count({
    where: {
      teacherProfileId,
      createdAt: { gte: startOfPreviousMonth, lt: startOfThisMonth },
    },
  });
}
