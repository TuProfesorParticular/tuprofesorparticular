import type { TeacherPlan } from "@prisma/client";

export const PLATFORM_FEE_PERCENT = 20;

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
    name: "Gratis",
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
    maxSubjects: 5,
    featured: true,
    stats: false,
    description: "Para profesores que quieren más visibilidad.",
    features: [
      "Todo lo del plan Gratis",
      "Hasta 5 materias",
      "Aparece destacado en los resultados de búsqueda",
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
    features: [
      "Todo lo del plan Pro",
      "Materias ilimitadas",
      "Prioridad máxima en los resultados de búsqueda",
      "Estadísticas de tu anuncio (visitas y contactos)",
      "Contacta con alumnos que buscan profesor",
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

// Descuento por compartir materiales: cada material subido ese mes rebaja
// 3€ los planes de pago (Pro y Premium), sin bajar de 0€.
export const MATERIAL_DISCOUNT_PER_UPLOAD = 3;

export function getDiscountedPrice(basePrice: number, materialsThisMonth: number): number {
  const discount = materialsThisMonth * MATERIAL_DISCOUNT_PER_UPLOAD;
  return Math.max(0, Math.round((basePrice - discount) * 100) / 100);
}

// Orden de prioridad en resultados de búsqueda: mayor primero
export const PLAN_PRIORITY: Record<TeacherPlan, number> = {
  premium: 2,
  pro: 1,
  free: 0,
};

// Programa "profesor fundador": a los 100 primeros profesores que se
// registran se les regala el plan Pro los 3 primeros meses. Si siguen
// activos (o suben a Premium) después, se quedan con un precio de
// fundador fijo para siempre, en vez de volver al precio normal.
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

// Un fundador sigue en su ventana de Pro gratis si aún no ha pasado
// founderProUntil y todavía no tiene una suscripción de pago activa.
export function isInFounderFreeTrial(teacherProfile: {
  isFounder: boolean;
  founderProUntil: Date | null;
  stripeSubscriptionId: string | null;
}): boolean {
  return Boolean(
    teacherProfile.isFounder &&
      teacherProfile.founderProUntil &&
      teacherProfile.founderProUntil.getTime() > Date.now() &&
      !teacherProfile.stripeSubscriptionId,
  );
}
