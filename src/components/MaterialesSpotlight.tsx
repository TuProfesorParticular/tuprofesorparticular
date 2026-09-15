import Link from "next/link";
import type { Vertical } from "@prisma/client";
import { CATEGORIES, VERTICAL_THEME, DEFAULT_VERTICAL } from "@/lib/constants";
import { getApprovedMaterialCount } from "@/lib/materials";

const SPOTLIGHT_COPY: Record<Vertical, { title: string; description: string }> = {
  educacion: {
    title: "Apuntes, exámenes y recursos para cada etapa",
    description:
      "Desde Infantil hasta la Universidad, pasando por oposiciones e idiomas: materiales que comparten y revisan profesores de verdad.",
  },
  deporte: {
    title: "Rutinas y planes de entrenamiento listos para usar",
    description:
      "De principiante a avanzado, para cada disciplina: boxeo, yoga, entrenamiento personal y mucho más.",
  },
  salud_mental: {
    title: "Guías, casos prácticos y herramientas de evaluación",
    description:
      "Recursos para pacientes y para profesionales, organizados por cada especialidad de la psicología y la terapia.",
  },
};

// Sección propia y destacada para "Materiales" en la home — ya no es un
// globo más dentro de la rejilla de categorías, sino un apartado con
// entidad visual propia (será una pata importante del negocio).
export default async function MaterialesSpotlight({ vertical }: { vertical: Vertical }) {
  const theme = VERTICAL_THEME[vertical];
  const copy = SPOTLIGHT_COPY[vertical];
  const materialCount = await getApprovedMaterialCount(vertical);
  const categoryCount = CATEGORIES.filter((c) => c.vertical === vertical).length;
  const materialesHref =
    vertical === DEFAULT_VERTICAL ? "/materiales" : `/materiales?ambito=${vertical}`;

  return (
    <section className="mt-16">
      <div className={`overflow-hidden rounded-3xl p-8 text-white shadow-lg sm:p-10 ${theme.ctaGradient}`}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="sm:max-w-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              📁 Biblioteca de materiales
            </span>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{copy.title}</h2>
            <p className="mt-2 text-white/90">{copy.description}</p>
          </div>

          <div className="flex flex-shrink-0 items-center gap-6 sm:flex-col sm:items-end sm:gap-3 sm:text-right">
            {materialCount > 0 ? (
              <div>
                <p className="text-3xl font-bold sm:text-4xl">{materialCount}+</p>
                <p className="text-sm text-white/80">
                  materiales en {categoryCount} {categoryCount === 1 ? "categoría" : "categorías"}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-3xl font-bold sm:text-4xl">{categoryCount}</p>
                <p className="text-sm text-white/80">categorías listas para tus materiales</p>
              </div>
            )}
            <Link
              href={materialesHref}
              className="flex-shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-900 shadow-md transition hover:shadow-lg"
            >
              Explorar materiales →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
