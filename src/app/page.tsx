import Link from "next/link";
import type { Vertical } from "@prisma/client";
import {
  CATEGORIES,
  CATEGORY_ICONS,
  UNIVERSITY_SECTION,
  VERTICALS,
  VERTICAL_THEME,
  DEFAULT_VERTICAL,
  type CategorySection,
} from "@/lib/constants";
import PricingSection from "@/components/PricingSection";
import Testimonials from "@/components/Testimonials";
import FeaturedTeachers from "@/components/FeaturedTeachers";
import HeroPhotos from "@/components/HeroPhotos";
import MaterialesSpotlight from "@/components/MaterialesSpotlight";
import NoticiasSpotlight from "@/components/NoticiasSpotlight";

type SearchParams = {
  ambito?: string;
};

function CategoryTile({
  href,
  icon,
  label,
  description,
  colors,
  wide = false,
}: {
  href: string;
  icon: string;
  label: string;
  description: string;
  colors: CategorySection["colors"];
  wide?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-1 hover:border-transparent hover:shadow-xl ${wide ? "sm:col-span-2 lg:col-span-3" : ""}`}
    >
      <span
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl shadow-sm transition group-hover:scale-110 ${colors.bg}`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <h2 className={`text-base font-bold ${colors.text}`}>{label}</h2>
        <p className="mt-1 text-sm text-stone-500">{description}</p>
      </div>
    </Link>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const activeVertical: Vertical = VERTICALS.some((v) => v.slug === params.ambito)
    ? (params.ambito as Vertical)
    : DEFAULT_VERTICAL;

  const categoriesForVertical = CATEGORIES.filter(
    (c) => c.vertical === activeVertical,
  );

  const HERO_COPY: Record<Vertical, { title: string; subtitle: string }> = {
    educacion: {
      title: "Encuentra tu profesor particular ideal.",
      subtitle:
        "Elige tu categoría y contacta directamente con el profesor. Sin intermediarios innecesarios, sin letra pequeña.",
    },
    deporte: {
      title: "Encuentra tu entrenador ideal.",
      subtitle: "Elige tu disciplina y contacta directamente con quien va a entrenarte.",
    },
    salud_mental: {
      title: "Encuentra tu profesional ideal.",
      subtitle: "Elige tu especialidad y contacta directamente con el profesional adecuado.",
    },
  };
  const hero = HERO_COPY[activeVertical];
  const theme = VERTICAL_THEME[activeVertical];

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden
          className={`pointer-events-none absolute -top-32 left-1/2 h-96 w-[44rem] -translate-x-1/2 rounded-full blur-3xl ${theme.blobStrong}`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full blur-3xl ${theme.blobAccent}`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute -left-28 top-1/4 h-64 w-64 rounded-full blur-3xl ${theme.blob}`}
        />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 text-center sm:pt-20">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold ${theme.badge}`}
          >
            ✨ Sin comisiones ocultas · Contacto directo
          </span>

          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-stone-900 sm:text-6xl">
            {hero.title.replace(" ideal.", "")}{" "}
            <span className={`bg-clip-text text-transparent ${theme.textGradient}`}>
              ideal.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-500">
            {hero.subtitle}
          </p>

          <div className="mx-auto mt-7 flex max-w-xl flex-wrap items-center justify-center gap-2">
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

          <a
            href="#categorias"
            className={`mx-auto mt-7 inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg ${theme.ctaGradient}`}
          >
            👇 Elige tu categoría
          </a>

          <HeroPhotos vertical={activeVertical} />
        </div>

        <svg
          aria-hidden
          viewBox="0 0 1440 60"
          className="block w-full text-stone-50"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,32 C240,60 480,4 720,16 C960,28 1200,58 1440,30 L1440,60 L0,60 Z"
          />
        </svg>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div id="categorias" className="scroll-mt-20 text-center">
          <h2 className="text-2xl font-bold text-stone-900">Elige tu especialidad</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-stone-500">
            Entra en tu categoría para buscar y filtrar solo entre esos
            profesionales.
          </p>
        </div>
        <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesForVertical.map((category) => (
            <CategoryTile
              key={category.slug}
              href={`/categoria/${encodeURIComponent(category.slug)}`}
              icon={CATEGORY_ICONS[category.slug]}
              label={category.label}
              description={category.description}
              colors={category.colors}
            />
          ))}

          {activeVertical === "educacion" && (
            <CategoryTile
              href="/universidad"
              icon={CATEGORY_ICONS.Universidad}
              label={UNIVERSITY_SECTION.label}
              description={UNIVERSITY_SECTION.description}
              colors={UNIVERSITY_SECTION.colors}
            />
          )}
        </section>

        <MaterialesSpotlight vertical={activeVertical} />

        <NoticiasSpotlight vertical={activeVertical} />

        <FeaturedTeachers vertical={activeVertical} />

        <Testimonials />

        <PricingSection />
      </main>
    </>
  );
}
