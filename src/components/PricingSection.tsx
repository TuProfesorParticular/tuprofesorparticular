import Link from "next/link";
import {
  PLANS,
  PLATFORM_FEE_PERCENT,
  MATERIAL_DISCOUNT_PER_UPLOAD,
  FOUNDER_LIMIT,
  FOUNDER_PRICES,
} from "@/lib/plans";

export default function PricingSection() {
  return (
    <section className="mt-16 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
          Para profesores: elige tu nivel de visibilidad
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-stone-500">
          Publicar tu anuncio y contactar con alumnos es gratis. Los planes de
          pago te dan más materias y prioridad en las búsquedas. Además, la
          plataforma cobra un {PLATFORM_FEE_PERCENT}% de gestión sobre la
          primera clase que reserve cada alumno nuevo contigo — el resto es
          para ti.
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold text-amber-700">
          🎉 Los {FOUNDER_LIMIT} primeros profesores obtienen Pro gratis 3
          meses y después precio de fundador para siempre: {FOUNDER_PRICES.pro}
          €/mes en Pro o {FOUNDER_PRICES.premium}€/mes en Premium.
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-sm font-medium text-rose-600">
          💡 Comparte materiales cada mes y ahorra: cada uno rebaja{" "}
          {MATERIAL_DISCOUNT_PER_UPLOAD}€ tus planes Pro y Premium ese mes.
          Si un mes no subes nada, la cuota vuelve al precio original.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-col rounded-2xl border p-6 ${
              plan.featured
                ? "border-teal-400 bg-teal-50/40"
                : "border-stone-200 bg-white"
            }`}
          >
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
                  <span className="text-teal-600">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/registro"
          className="inline-block rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Regístrate como profesor
        </Link>
      </div>
    </section>
  );
}
