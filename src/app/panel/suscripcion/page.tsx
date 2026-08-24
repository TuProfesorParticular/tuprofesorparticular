import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getMonthlyMaterialCount } from "@/lib/materials";
import {
  PLANS,
  getPlan,
  getBasePrice,
  getDiscountedPrice,
  isInFounderFreeTrial,
  FOUNDER_PRICES,
  MATERIAL_DISCOUNT_PER_UPLOAD,
} from "@/lib/plans";
import { syncFounderExpiry } from "@/lib/founders";
import { startSubscriptionCheckout, openBillingPortal } from "./actions";

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
    <main className="mx-auto max-w-5xl px-4 py-10">
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
          🎉 Eres profesor fundador (uno de los 100 primeros).{" "}
          {inFreeTrial
            ? `Tu plan Pro es gratis hasta el ${founderUntilLabel}. Después, tu precio de fundador se queda fijo para siempre: ${FOUNDER_PRICES.pro}€/mes en Pro o ${FOUNDER_PRICES.premium}€/mes en Premium.`
            : `Tienes precio de fundador para siempre: ${FOUNDER_PRICES.pro}€/mes en Pro o ${FOUNDER_PRICES.premium}€/mes en Premium, en vez del precio normal.`}
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
            className="text-sm text-teal-600 hover:underline"
          >
            Gestionar método de pago / cancelar suscripción
          </button>
        </form>
      )}

      <div className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
        <p>
          💡 Este mes llevas{" "}
          <span className="font-semibold">
            {materialsThisMonth} {materialsThisMonth === 1 ? "material" : "materiales"}
          </span>{" "}
          subidos. Cada uno rebaja {MATERIAL_DISCOUNT_PER_UPLOAD}€ el precio de
          hoy de los planes Pro y Premium — ya se refleja abajo.{" "}
          {materialsThisMonth === 0 && (
            <>
              <a href="/panel/materiales" className="underline">
                Sube tu primer material
              </a>{" "}
              para empezar a ahorrar.
            </>
          )}
        </p>
        <p className="mt-2 font-medium">
          ⚠️ El descuento no es fijo: cada renovación mensual se recalcula
          sola según lo que subas ese mes. Si un mes no subes ningún
          material, tu siguiente cuota vuelve al precio original del plan.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === teacherProfile.plan;
          const basePrice = getBasePrice(plan.id, teacherProfile);
          const isFounderPrice = basePrice < plan.price;
          const freeAsFounderTrial = plan.id === "pro" && inFreeTrial;
          const discountedPrice =
            basePrice > 0 ? getDiscountedPrice(basePrice, materialsThisMonth) : 0;
          const hasMaterialDiscount = discountedPrice < basePrice;

          return (
            <div
              key={plan.id}
              className={`flex flex-col rounded-2xl border p-6 ${
                isCurrent
                  ? "border-teal-500 ring-2 ring-teal-500"
                  : "border-stone-200"
              } bg-white shadow-sm`}
            >
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
                    {isFounderPrice ? "+ " : ""}Descuento por materiales
                  </p>
                )}
              </div>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-stone-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="text-teal-600">✓</span>
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
                    className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                  >
                    Elegir {plan.name}
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
