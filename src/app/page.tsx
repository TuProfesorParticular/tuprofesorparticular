import Link from "next/link";
import type { Modality, Level, Vertical } from "@prisma/client";
import { getAllSubjects, getTeacherSearchResults } from "@/lib/teachers";
import {
  CATEGORIES,
  MATERIALS_CATEGORY,
  UNIVERSITY_SECTION,
  VERTICALS,
  VERTICAL_THEME,
  DEFAULT_VERTICAL,
} from "@/lib/constants";
import SearchFilters from "@/components/SearchFilters";
import TeacherCard from "@/components/TeacherCard";
import PricingSection from "@/components/PricingSection";
import Testimonials from "@/components/Testimonials";
import FeaturedTeachers from "@/components/FeaturedTeachers";
import HeroPhotos from "@/components/HeroPhotos";

type SearchParams = {
  materia?: string;
  categoria?: string;
  ciudad?: string;
  modalidad?: string;
  nivel?: string;
  precioMax?: string;
  ambito?: string;
};

const CATEGORY_ICONS: Record<string, string> = {
  Ciencias: "🔬",
  Humanidades: "📚",
  "Ciencias Sociales": "🗺️",
  Oposiciones: "🏛️",
  "Cursos oficiales": "🌍",
  Universidad: "🎓",
  "Deportes de Combate": "🥊",
  "Deportes de Raqueta y Equipo": "🎾",
  "Fitness y Bienestar Físico": "💪",
  "Psicología y Terapia": "🧠",
  "Psicopedagogía y Aprendizaje": "📘",
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const activeVertical: Vertical = VERTICALS.some((v) => v.slug === params.ambito)
    ? (params.ambito as Vertical)
    : DEFAULT_VERTICAL;

  const hasActiveSearch = Boolean(
    params.materia ||
      params.categoria ||
      params.ciudad ||
      params.modalidad ||
      params.nivel ||
      params.precioMax,
  );

  const categoriesForVertical = CATEGORIES.filter(
    (c) => c.vertical === activeVertical,
  );

  const activeCategory = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === params.categoria?.toLowerCase(),
  );
  const isUniversityFilter =
    !activeCategory && activeVertical === "educacion" && params.nivel === "universidad";

  const [allSubjects, teachers] = await Promise.all([
    getAllSubjects(),
    hasActiveSearch
      ? getTeacherSearchResults({
          subject: params.materia || undefined,
          category: params.categoria || undefined,
          city: params.ciudad || undefined,
          modality: (params.modalidad as Modality) || undefined,
          level: (params.nivel as Level) || undefined,
          maxPrice: params.precioMax ? Number(params.precioMax) : undefined,
        })
      : Promise.resolve(null),
  ]);

  const subjects = allSubjects.filter((s) => s.vertical === activeVertical);

  const HERO_COPY: Record<Vertical, { title: string; subtitle: string; placeholder: string }> = {
    educacion: {
      title: "Encuentra tu profesor particular ideal.",
      subtitle:
        "Busca por materia, ubicación o modalidad y contacta directamente. Sin intermediarios innecesarios, sin letra pequeña.",
      placeholder: "¿Qué quieres aprender? (ej. Matemáticas)",
    },
    deporte: {
      title: "Encuentra tu entrenador ideal.",
      subtitle:
        "Busca por disciplina, ubicación o modalidad y contacta directamente con quien va a entrenarte.",
      placeholder: "¿Qué deporte quieres entrenar? (ej. Boxeo)",
    },
    salud_mental: {
      title: "Encuentra tu profesional ideal.",
      subtitle:
        "Busca psicólogos, psicopedagogos y profesionales del bienestar emocional y contacta directamente.",
      placeholder: "¿Qué necesitas? (ej. Psicología Clínica)",
    },
  };
  const hero = HERO_COPY[activeVertical];
  const theme = VERTICAL_THEME[activeVertical];

  return (
    <>
      <section className="relative overflow-hidden border-b border-stone-200 bg-white">
        <HeroPhotos vertical={activeVertical} />
        <div
          aria-hidden
          className={`pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full blur-3xl ${theme.blob}`}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-6xl">
            {hero.title.replace(" ideal.", "")}{" "}
            <span className={theme.accentText}>ideal.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-500">
            {hero.subtitle}
          </p>

          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-2">
            {VERTICALS.map((v) => (
              <Link
                key={v.slug}
                href={v.slug === DEFAULT_VERTICAL ? "/" : `/?ambito=${v.slug}`}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  activeVertical === v.slug
                    ? VERTICAL_THEME[v.slug].pillActive
                    : "border-stone-300 bg-white text-stone-600 hover:border-stone-400"
                }`}
              >
                {v.icon} {v.label}
              </Link>
            ))}
          </div>

          <form
            action="/"
            method="get"
            className="mx-auto mt-6 flex max-w-xl flex-col gap-2 rounded-2xl border border-stone-200 bg-white/90 p-2 shadow-lg backdrop-blur sm:flex-row"
          >
            {activeVertical !== DEFAULT_VERTICAL && (
              <input type="hidden" name="ambito" value={activeVertical} />
            )}
            <input
              type="text"
              name="materia"
              list="hero-subjects-list"
              placeholder={hero.placeholder}
              className="flex-1 rounded-lg border-0 px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <datalist id="hero-subjects-list">
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name} />
              ))}
            </datalist>
            <input
              type="text"
              name="ciudad"
              placeholder="Ciudad (opcional)"
              className="rounded-lg border-0 px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:w-40"
            />
            <button
              type="submit"
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold text-white ${theme.button}`}
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesForVertical.map((category) => (
            <Link
              key={category.slug}
              href={`/?categoria=${encodeURIComponent(category.slug)}${activeVertical !== DEFAULT_VERTICAL ? `&ambito=${activeVertical}` : ""}`}
              className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-lg ${category.colors.bg} ${category.colors.border} ${category.colors.ring}`}
            >
              <span className="text-2xl">{CATEGORY_ICONS[category.slug]}</span>
              <h2 className={`mt-2 text-lg font-bold ${category.colors.text}`}>
                {category.label}
              </h2>
              <p className="mt-1 text-xs text-stone-600">{category.description}</p>
            </Link>
          ))}

          {activeVertical === "educacion" && (
            <>
              <Link
                href="/?nivel=universidad"
                className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-lg ${UNIVERSITY_SECTION.colors.bg} ${UNIVERSITY_SECTION.colors.border} ${UNIVERSITY_SECTION.colors.ring}`}
              >
                <span className="text-2xl">{CATEGORY_ICONS.Universidad}</span>
                <h2 className={`mt-2 text-lg font-bold ${UNIVERSITY_SECTION.colors.text}`}>
                  {UNIVERSITY_SECTION.label}
                </h2>
                <p className="mt-1 text-xs text-stone-600">
                  {UNIVERSITY_SECTION.description}
                </p>
              </Link>

              <Link
                href="/materiales"
                className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-lg ${MATERIALS_CATEGORY.colors.bg} ${MATERIALS_CATEGORY.colors.border} ${MATERIALS_CATEGORY.colors.ring}`}
              >
                <span className="text-2xl">📁</span>
                <h2 className={`mt-2 text-lg font-bold ${MATERIALS_CATEGORY.colors.text}`}>
                  {MATERIALS_CATEGORY.label}
                </h2>
                <p className="mt-1 text-xs text-stone-600">
                  {MATERIALS_CATEGORY.description}
                </p>
              </Link>
            </>
          )}
        </section>

        <FeaturedTeachers />

        {hasActiveSearch && (
          <>
            <section className="mt-10">
              <Link
                href={activeVertical !== DEFAULT_VERTICAL ? `/?ambito=${activeVertical}` : "/"}
                className="text-sm text-teal-600 hover:underline"
              >
                ← Todas las categorías
              </Link>
              <div className="mt-3">
                <SearchFilters
                  subjects={subjects}
                  defaultValues={params}
                  showLevel={activeVertical === "educacion"}
                />
              </div>
            </section>

            <section className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-stone-500">
                  {teachers?.length ?? 0}{" "}
                  {teachers?.length === 1 ? "profesor encontrado" : "profesores encontrados"}
                  {activeCategory && (
                    <>
                      {" "}
                      en <span className="font-medium">{activeCategory.label}</span>
                    </>
                  )}
                  {isUniversityFilter && (
                    <>
                      {" "}
                      en <span className="font-medium">Universidad</span>
                    </>
                  )}
                </p>
              </div>

              {teachers && teachers.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {teachers.map((teacher) => (
                    <TeacherCard key={teacher.id} teacher={teacher} />
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-stone-300 p-8 text-center text-stone-400">
                  No hay profesores que coincidan con tu búsqueda todavía.
                </p>
              )}
            </section>
          </>
        )}

        <Testimonials />

        <PricingSection />
      </main>
    </>
  );
}
