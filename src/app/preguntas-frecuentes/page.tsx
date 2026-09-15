import type { Metadata } from "next";
import Link from "next/link";
import { FAQ_CATEGORIES, filterFaqByAudience, type FaqAudience } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Preguntas frecuentes · TuProfesorParticular",
  description:
    "Cómo funciona cada apartado de TuProfesorParticular: registro, búsqueda y contacto, anuncios, planes, cobros y comisión, materiales, envío de CV a centros y privacidad.",
};

const AUDIENCE_TABS: { value: FaqAudience | "all"; label: string }[] = [
  { value: "all", label: "Todo" },
  { value: "alumno", label: "Soy alumno" },
  { value: "profesor", label: "Soy profesional" },
];

function isAudience(value: string | undefined): value is FaqAudience | "all" {
  return value === "all" || value === "alumno" || value === "profesor";
}

export default async function PreguntasFrecuentesPage({
  searchParams,
}: {
  searchParams: Promise<{ para?: string }>;
}) {
  const { para } = await searchParams;
  const audience: FaqAudience | "all" = isAudience(para) ? para : "all";
  const categories = filterFaqByAudience(FAQ_CATEGORIES, audience);

  // Datos estructurados para buscadores (FAQPage). Se incluyen todas las
  // preguntas, sin filtrar por pestaña.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_CATEGORIES.flatMap((cat) =>
      cat.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          Preguntas frecuentes
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-stone-500">
          Cómo funciona cada apartado de la plataforma. Si no encuentras tu
          respuesta, escríbenos a{" "}
          <a
            href="mailto:contacto@tuprofesorparticular.es"
            className="text-teal-600 hover:underline"
          >
            contacto@tuprofesorparticular.es
          </a>
          .
        </p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {AUDIENCE_TABS.map((tab) => {
          const active = audience === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value === "all" ? "/preguntas-frecuentes" : `/preguntas-frecuentes?para=${tab.value}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                active
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-stone-300 bg-white text-stone-600 hover:border-stone-400"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {categories.length > 1 && (
        <nav className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-stone-500">
          {categories.map((cat) => (
            <a key={cat.id} href={`#${cat.id}`} className="hover:text-teal-600">
              {cat.icon} {cat.title}
            </a>
          ))}
        </nav>
      )}

      <div className="mt-10 space-y-10">
        {categories.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-24">
            <h2 className="flex items-center gap-2 text-xl font-bold text-stone-900">
              <span aria-hidden>{cat.icon}</span>
              {cat.title}
            </h2>
            <div className="mt-4 space-y-3">
              {cat.items.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-stone-200 bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-medium text-stone-900">
                    {item.q}
                    <span className="flex-shrink-0 text-stone-400 transition group-open:rotate-180">
                      ▾
                    </span>
                  </summary>
                  <div className="border-t border-stone-100 p-4 text-sm text-stone-600">
                    <p>{item.a}</p>
                    {item.more && (
                      <Link
                        href={item.more.href}
                        className="mt-2 inline-block text-sm font-medium text-teal-600 hover:underline"
                      >
                        {item.more.label} →
                      </Link>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-stone-200 bg-stone-50 p-6 text-center">
        <p className="text-sm text-stone-600">
          ¿Sigues con dudas? Escríbenos a{" "}
          <a
            href="mailto:contacto@tuprofesorparticular.es"
            className="font-medium text-teal-600 hover:underline"
          >
            contacto@tuprofesorparticular.es
          </a>{" "}
          y te ayudamos.
        </p>
      </div>
    </main>
  );
}
