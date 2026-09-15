import Link from "next/link";
import { PLANS, FOUNDER_LIMIT, FOUNDER_PRICES } from "@/lib/plans";

export default function PricingSection() {
  return (
    <section className="mt-20 rounded-3xl border border-stone-200 bg-gradient-to-b from-white to-stone-50 p-6 shadow-sm sm:p-10">
      <div className="text-center">
        <span className="inline-flex items-center rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-semibold text-stone-600">
          Para profesores
        </span>
        <h2 className="mt-4 text-2xl font-bold text-stone-900 sm:text-3xl">
          Elige tu nivel de visibilidad
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-stone-500">
          Publicar tu anuncio y contactar con alumnos es gratis. Los planes de
          pago te dan más materias y prioridad en las búsquedas. No cobramos
          comisión por tus clases recurrentes: solo una pequeña gestión sobre
          la primera reserva de cada alumno nuevo, que te enseñamos con
          números antes de contratar nada.
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold text-amber-700">
          🎉 Los {FOUNDER_LIMIT} primeros profesionales de cada categoría
          (Educación, Deporte y Salud Mental) obtienen Pro{" "}
          <span className="underline">gratis durante 3 meses</span>. Al
          terminar, pasan automáticamente a su precio de fundador:{" "}
          {FOUNDER_PRICES.pro}€/mes en Pro o {FOUNDER_PRICES.premium}€/mes en
          Premium. Sin permanencia: cancela cuando quieras, sin costes
          adicionales.
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-sm font-medium text-rose-600">
          💡 Y hay más: con un plan de pago puedes rebajar tu cuota cada mes
          solo compartiendo tus apuntes. Al registrarte te explicamos cómo
          desde tu panel.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const isPro = plan.id === "pro";
          const isPremium = plan.id === "premium";

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 transition hover:-translate-y-1 ${
                isPremium
                  ? "border-violet-300 bg-gradient-to-b from-violet-50/70 to-white shadow-lg shadow-violet-100"
                  : isPro
                    ? "border-teal-400 bg-white shadow-lg shadow-teal-100"
                    : "border-stone-200 bg-white hover:shadow-md"
              }`}
            >
              {isPro && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                  Recomendado
                </span>
              )}
              {isPremium && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                  ★ Máximo alcance
                </span>
              )}
              <h3 className="text-lg font-bold text-stone-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-stone-500">{plan.description}</p>
              <p className="mt-4 text-3xl font-bold text-stone-900">
                {plan.price === 0 ? "Gratis" : `${plan.price}€`}
                {plan.price > 0 && (
                  <span className="text-sm font-normal text-stone-400">/mes</span>
                )}
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-stone-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className={isPremium ? "text-violet-600" : "text-teal-600"}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/registro"
          className="inline-block rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-200 transition hover:from-teal-700 hover:to-emerald-600 hover:shadow-xl"
        >
          Regístrate como profesor
        </Link>
      </div>
    </section>
  );
}
