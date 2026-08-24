import type { Level, Modality } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PLAN_PRIORITY } from "@/lib/plans";

export type TeacherSearchFilters = {
  subject?: string;
  category?: string;
  city?: string;
  modality?: Modality;
  level?: Level;
  maxPrice?: number;
};

export function getTeacherSearchResults(filters: TeacherSearchFilters) {
  return prisma.teacherProfile.findMany({
    where: {
      status: "approved",
      ...(filters.modality ? { modality: filters.modality } : {}),
      ...(filters.city
        ? { city: { contains: filters.city, mode: "insensitive" } }
        : {}),
      ...(filters.maxPrice ? { pricePerHour: { lte: filters.maxPrice } } : {}),
      ...(filters.subject || filters.category || filters.level
        ? {
            subjects: {
              some: {
                ...(filters.subject
                  ? { subject: { name: { equals: filters.subject, mode: "insensitive" } } }
                  : {}),
                ...(filters.category
                  ? { subject: { category: { equals: filters.category, mode: "insensitive" } } }
                  : {}),
                ...(filters.level ? { level: filters.level } : {}),
              },
            },
          }
        : {}),
    },
    include: {
      user: { select: { name: true, avatarUrl: true } },
      subjects: { include: { subject: true } },
      reviews: { select: { rating: true } },
    },
    // El enum TeacherPlan se declara free < pro < premium, así que ordenar
    // "desc" por plan pone primero a los profesores con suscripción de pago.
    orderBy: [{ plan: "desc" }, { createdAt: "desc" }],
  });
}

export function getTeacherProfileById(id: string) {
  return prisma.teacherProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, avatarUrl: true, email: true } },
      subjects: { include: { subject: true } },
      availability: true,
    },
  });
}

export function getAllSubjects() {
  return prisma.subject.findMany({ orderBy: { name: "asc" } });
}

export function getSubjectsByCategory(category: string) {
  return prisma.subject.findMany({
    where: { category: { equals: category, mode: "insensitive" } },
    orderBy: { name: "asc" },
  });
}

// PRNG determinista (mulberry32) para poder "barajar" con una semilla reproducible
function mulberry32(seed: number) {
  let state = seed | 0;
  return function random() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const random = mulberry32(seed);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const FEATURED_ROTATION_MS = 1000 * 60 * 60 * 6; // la selección se renueva cada 6 horas

// Profesores destacados para la portada: los mejor valorados, con una selección
// que rota cada pocas horas en vez de mostrar siempre exactamente los mismos.
export async function getFeaturedTeachers(limit = 3) {
  const teachers = await prisma.teacherProfile.findMany({
    where: { status: "approved" },
    include: {
      user: { select: { name: true, avatarUrl: true } },
      subjects: { include: { subject: true } },
      reviews: { select: { rating: true } },
    },
  });

  const ranked = teachers
    .map((teacher) => {
      const reviewCount = teacher.reviews.length;
      const avgRating =
        reviewCount > 0
          ? teacher.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
          : 0;
      return { teacher, avgRating, reviewCount };
    })
    .sort(
      (a, b) =>
        b.avgRating - a.avgRating ||
        b.reviewCount - a.reviewCount ||
        PLAN_PRIORITY[b.teacher.plan] - PLAN_PRIORITY[a.teacher.plan],
    );

  const pool = ranked.slice(0, Math.max(limit * 4, 12));
  const rotationSeed = Math.floor(Date.now() / FEATURED_ROTATION_MS);

  return seededShuffle(pool, rotationSeed)
    .slice(0, limit)
    .map((entry) => entry.teacher);
}
