import type { TeacherPlan } from "@prisma/client";

export const PLATFORM_FEE_PERCENT = 20;

// Reparto de la primera clase entre profesional y plataforma, en céntimos
// (Stripe trabaja en la unidad mínima de la moneda). Redondeamos la
// comisión antes de restar, para que comisión + neto sigan sumando
// exactamente el importe cobrado al alumno.
export function computePlatformFeeCents(amountCents: number): number {
  return Math.round((amountCents * PLATFORM_FEE_PERCENT) / 100);
}

export type PlanDetails = {
  id: TeacherPlan;
  name: string;
  price: number; // €/mes, 0 = gratis
  maxSubjects: number | null; // null = ilimitado
  featured: boolean;
  stats: boolean;
  description: string;
  features: string[];
};

export const PLANS: PlanDetails[] = [
  {
    id: "free",
    name: "Básico",
    price: 0,
    maxSubjects: 1,
    featured: false,
    stats: false,
    description: "Para empezar a darte a conocer.",
    features: [
      "Anuncio público en las búsquedas",
      "1 materia",
      "Mensajería ilimitada con alumnos",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    maxSubjects: 2,
    featured: true,
    stats: false,
    description: "Para profesores que quieren más visibilidad.",
    features: [
      "Todo lo del plan Básico",
      "Hasta 2 materias",
      "Insignia \"Destacado\" en tu anuncio y tarjetas de búsqueda",
      "Materiales ilimitados",
      "Contacta con alumnos que buscan profesor",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 19.99,
    maxSubjects: null,
    featured: true,
    stats: true,
    description: "Máxima visibilidad para profesores a tiempo completo.",
    // Cada línea marca explícitamente el salto respecto a Pro (no solo
    // "todo lo de Pro y más", sino cuánto más) para que la diferencia de
    // precio se note también en el propio listado de ventajas.
    features: [
      "Todo lo del plan Pro, y además:",
      "Materias ilimitadas (Pro: hasta 2)",
      "Prioridad máxima en las búsquedas, por delante de los Pro",
      "Insignia \"Premium\" propia — se distingue de \"Destacado\"",
      "Estadísticas de tu anuncio: visitas y contactos (exclusivo Premium)",
    ],
  },
];

export function getPlan(id: TeacherPlan): PlanDetails {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

// Solo los planes de pago pueden contactar con alumnos que publican un
// anuncio pidiendo profesor (ver StudentRequest) — es una ventaja más de
// la visibilidad de pago, igual que aparecer destacado en las búsquedas.
export function canContactStudents(plan: TeacherPlan): boolean {
  return plan !== "free";
}

// Descuento por compartir materiales: por aportar al menos un material
// aprobado ese mes (da igual cuántos) se rebajan 3€ los planes de pago (Pro
// y Premium), sin bajar de 0€. No es un descuento que se multiplique por
// cada material — es un premio fijo por participar ese mes.
export const MATERIAL_DISCOUNT_PER_UPLOAD = 3;

export function getDiscountedPrice(basePrice: number, materialsThisMonth: number): number {
  const discount = materialsThisMonth >= 1 ? MATERIAL_DISCOUNT_PER_UPLOAD : 0;
  return Math.max(0, Math.round((basePrice - discount) * 100) / 100);
}

// Orden de prioridad en resultados de búsqueda: mayor primero
export const PLAN_PRIORITY: Record<TeacherPlan, number> = {
  premium: 2,
  pro: 1,
  free: 0,
};

// Programa "profesor fundador": a los 100 primeros profesionales que se
// registran EN CADA CATEGORÍA (Educación, Deporte, Salud Mental — cupo
// independiente, no uno global de 100) se les regala el plan Pro los 3
// primeros meses. Si siguen activos (o suben a Premium) después, se quedan
// con un precio de fundador fijo para siempre, en vez de volver al precio
// normal.
export const FOUNDER_LIMIT = 100;
export const FOUNDER_TRIAL_MONTHS = 3;
export const FOUNDER_PRICES: Record<"pro" | "premium", number> = {
  pro: 4.99,
  premium: 8.99,
};

export function addFounderTrialMonths(from: Date): Date {
  const until = new Date(from);
  until.setMonth(until.getMonth() + FOUNDER_TRIAL_MONTHS);
  return until;
}

// Precio base (antes del descuento por materiales) para un plan concreto,
// teniendo en cuenta si el profesor es fundador.
export function getBasePrice(
  planId: TeacherPlan,
  teacherProfile: { isFounder: boolean },
): number {
  if (teacherProfile.isFounder && (planId === "pro" || planId === "premium")) {
    return FOUNDER_PRICES[planId];
  }
  return getPlan(planId).price;
}

// El precio de fundador (4,99€/8,99€ fijos para siempre) NO se combina con
// el descuento por materiales — es un precio ya rebajado y fijo de por sí.
// El descuento por materiales solo se aplica al precio normal del plan
// (9,99€/19,99€), para quien no es fundador.
export function isFounderPriced(
  planId: TeacherPlan,
  teacherProfile: { isFounder: boolean },
): boolean {
  return Boolean(teacherProfile.isFounder && (planId === "pro" || planId === "premium"));
}

// Precio final que se cobra: aplica el descuento por materiales salvo que
// el precio ya sea el fijo de fundador (ver isFounderPriced).
export function getFinalPrice(
  planId: TeacherPlan,
  teacherProfile: { isFounder: boolean },
  materialsThisMonth: number,
): number {
  const basePrice = getBasePrice(planId, teacherProfile);
  if (isFounderPriced(planId, teacherProfile)) return basePrice;
  return getDiscountedPrice(basePrice, materialsThisMonth);
}

// Ventana de Pro gratis temporal, todavía sin convertirse en suscripción de
// pago real. La usan tanto el programa de fundadores como la recompensa del
// programa de referidos (ver referralRewardGranted) — ambos reutilizan el
// mismo campo founderProUntil como fecha de caducidad del acceso gratis.
export function isInFounderFreeTrial(teacherProfile: {
  founderProUntil: Date | null;
  stripeSubscriptionId: string | null;
}): boolean {
  return Boolean(
    teacherProfile.founderProUntil &&
      teacherProfile.founderProUntil.getTime() > Date.now() &&
      !teacherProfile.stripeSubscriptionId,
  );
}

// Días de Pro gratis que se regalan a quien invita a otro profesor y ese
// profesor termina siendo aprobado (ver setTeacherProfileStatus).
export const REFERRAL_REWARD_DAYS = 30;
