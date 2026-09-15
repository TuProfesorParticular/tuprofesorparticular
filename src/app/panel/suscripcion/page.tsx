import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getMonthlyMaterialCount } from "@/lib/materials";
import {
  PLANS,
  getPlan,
  getBasePrice,
  getDiscountedPrice,
  isFounderPriced,
  isInFounderFreeTrial,
  FOUNDER_PRICES,
  MATERIAL_DISCOUNT_PER_UPLOAD,
} from "@/lib/plans";
import { syncFounderExpiry } from "@/lib/founders";
import { VERTICAL_THEME } from "@/lib/constants";
import { startSubscriptionCheckout, openBillingPortal } from "./actions";
import CommissionSimulator from "./CommissionSimulator";

export const metadata: Metadata = {
  title: "Mi suscripción · TuProfesorParticular",
};

export default async function SuscripcionPage({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string }>;
}) {
  const session = await requireRole("teacher");
  const { motivo } = await searchParams;

  const rawTeacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { userId: session.user.id },
  });
  const teacherProfile = await syncFounderExpiry(rawTeacherProfile);
  const theme = VERTICAL_THEME[teacherProfile.vertical];

  const [currentPlan, materialsThisMonth] = await Promise.all([
    getPlan(teacherProfile.plan),
    getMonthlyMaterialCount(teacherProfile.id),
  ]);

  const inFreeTrial = isInFounderFreeTrial(teacherProfile);
  const founderUntilLabel = teacherProfile.founderProUntil
    ? new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric" }).format(
        teacherProfile.founderProUntil,
      )
    : null;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-stone-900">Mi suscripción</h1>
      <p className="mt-1 text-sm text-stone-500">
        Plan actual: <span className="font-semibold">{currentPlan.name}</span>
        {teacherProfile.subscriptionStatus &&
          teacherProfile.subscriptionStatus !== "active" && (
            <span className="ml-2 text-amber-600">
              ({teacherProfile.subscriptionStatus})
            </span>
          )}
      </p>

      {teacherProfile.isFounder && (
        <p className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          🎉 Eres profesor fundador (uno de los 100 primeros de tu categoría).{" "}
          {inFreeTrial
            ? `Tienes el plan Pro GRATIS durante tus primeros 3 meses, hasta el ${founderUntilLabel}. Al terminar ese periodo, pasarás automáticamente a tu precio de fundador fijo para siempre: ${FOUNDER_PRICES.pro}€/mes en Pro u ${FOUNDER_PRICES.premium}€/mes en Premium.`
            : `Tienes tu precio de fundador fijo para siempre: ${FOUNDER_PRICES.pro}€/mes en Pro u ${FOUNDER_PRICES.premium}€/mes en Premium, en vez del precio normal.`}{" "}
          Al ser un precio ya rebajado, no se le suma el descuento por
          materiales — eso solo aplica al precio normal (ver abajo).
        </p>
      )}

      {motivo === "contactar-alumnos" && (
        <p className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          🔒 Contactar con alumnos que buscan profesor es una ventaja de los
          planes Pro y Premium.
        </p>
      )}

      {teacherProfile.stripeCustomerId && (
        <form action={openBillingPortal} className="mt-3">
          <button
            type="submit"
            className={`text-sm hover:underline ${theme.accentText}`}
          >
            Gestionar método de pago / cancelar suscripción
          </button>
        </form>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === teacherProfile.plan;
          const basePrice = getBasePrice(plan.id, teacherProfile);
          const isFounderPrice = isFounderPriced(plan.id, teacherProfile);
          const freeAsFounderTrial = plan.id === "pro" && inFreeTrial;
          // El precio de fundador es fijo para siempre: no se le aplica el
          // descuento por materiales, que solo existe para abaratar el
          // precio normal (9,99€/19,99€) de quien no es fundador.
          const discountedPrice = isFounderPrice
            ? basePrice
            : basePrice > 0
              ? getDiscountedPrice(basePrice, materialsThisMonth)
              : 0;
          const hasMaterialDiscount = !isFounderPrice && discountedPrice < basePrice;

          const isPremium = plan.id === "premium";

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                isCurrent
                  ? `${theme.borderStrong} ring-2 ${theme.ring}`
                  : isPremium
                    ? "border-violet-300"
                    : "border-stone-200"
              } bg-white shadow-sm`}
            >
              {isPremium && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                  ★ Máximo alcance
                </span>
              )}
              <h2 className="text-lg font-bold text-stone-900">{plan.name}</h2>
              <p className="mt-1 text-sm text-stone-500">{plan.description}</p>
              <div className="mt-4">
                {(isFounderPrice || hasMaterialDiscount) && (
                  <p className="text-sm text-stone-400 line-through">
                    {plan.price}€/mes
                  </p>
                )}
                <p className="text-3xl font-bold text-stone-900">
                  {freeAsFounderTrial || discountedPrice === 0
                    ? "Gratis"
                    : `${discountedPrice}€`}
                  {!freeAsFounderTrial && discountedPrice > 0 && (
                    <span className="text-sm font-normal text-stone-400">/mes</span>
                  )}
                </p>
                {freeAsFounderTrial && (
                  <p className="text-xs font-medium text-amber-600">
                    Gratis hasta el {founderUntilLabel} (fundador)
                  </p>
                )}
                {!freeAsFounderTrial && isFounderPrice && (
                  <p className="text-xs font-medium text-amber-600">
                    Precio de fundador para siempre
                  </p>
                )}
                {hasMaterialDiscount && (
                  <p className="text-xs font-medium text-rose-600">
                    Descuento por materiales
                  </p>
                )}
              </div>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-stone-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className={isPremium ? "text-violet-600" : theme.accentText}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <span className="mt-6 rounded-lg bg-stone-100 px-4 py-2 text-center text-sm font-semibold text-stone-500">
                  Plan actual
                </span>
              ) : plan.id === "free" ? null : (
                <form action={startSubscriptionCheckout} className="mt-6">
                  <input type="hidden" name="plan" value={plan.id} />
                  <button
                    type="submit"
                    className={`w-full rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg ${theme.ctaGradient}`}
                  >
                    Elegir {plan.name}
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>

      <CommissionSimulator vertical={teacherProfile.vertical} />

      <p className="mt-6 text-xs text-stone-400">
        💡 Si pagas el precio normal de Pro o Premium (9,99€/19,99€ — es
        decir, no tienes precio de fundador), aportar al menos un material{" "}
        <span className="font-medium">aprobado</span> por un admin este mes
        te rebaja {MATERIAL_DISCOUNT_PER_UPLOAD}€ fijos — da igual si subes uno o
        varios, no se suma por cada uno. Se recalcula cada mes: si no subes
        nada ese mes, la siguiente cuota vuelve al precio original. No
        aplica si ya tienes el precio fijo de fundador. Este mes llevas{" "}
        {materialsThisMonth} {materialsThisMonth === 1 ? "material aprobado" : "materiales aprobados"}.{" "}
        {materialsThisMonth === 0 && (
          <a href="/panel/materiales" className="underline">
            Sube el primero
          </a>
        )}
      </p>
    </div>
  );
}
