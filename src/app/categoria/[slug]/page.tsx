import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Modality, Level } from "@prisma/client";
import { getSubjectsByCategory, getTeacherSearchResults } from "@/lib/teachers";
import { CATEGORIES, CATEGORY_ICONS, VERTICAL_THEME } from "@/lib/constants";
import SearchFilters from "@/components/SearchFilters";
import TeacherCard from "@/components/TeacherCard";
import PhotoStrip from "@/components/PhotoStrip";

type SearchParams = {
  materia?: string;
  ciudad?: string;
  modalidad?: string;
  nivel?: string;
  precioMax?: string;
};

function findCategory(slug: string) {
  const decoded = decodeURIComponent(slug);
  return CATEGORIES.find((c) => c.slug.toLowerCase() === decoded.toLowerCase());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategory(slug);
  return {
    title: category
      ? `${category.label} · TuProfesorParticular`
      : "Categoría · TuProfesorParticular",
  };
}

// Página propia de cada globo (categoría): a diferencia de la home, aquí no
// hay hero ni rejilla de categorías — solo la cabecera de esta categoría y
// el buscador completo, filtrado para que solo aparezcan los profesionales
// que pertenecen a ella (ver findCategory + getTeacherSearchResults).
export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const search = await searchParams;

  const category = findCategory(slug);
  if (!category) notFound();

  const theme = VERTICAL_THEME[category.vertical];
  const icon = CATEGORY_ICONS[category.slug] ?? "📚";
  const showLevel = category.vertical === "educacion";

  const [subjects, teachers] = await Promise.all([
    getSubjectsByCategory(category.slug),
    getTeacherSearchResults({
      category: category.slug,
      subject: search.materia || undefined,
      city: search.ciudad || undefined,
      modality: (search.modalidad as Modality) || undefined,
      level: (search.nivel as Level) || undefined,
      maxPrice: search.precioMax ? Number(search.precioMax) : undefined,
    }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/" className={`text-sm hover:underline ${theme.accentText}`}>
        ← Todas las categorías
      </Link>

      <div
        className={`mt-4 overflow-hidden rounded-3xl border p-6 sm:p-8 ${category.colors.border} ${category.colors.bg}`}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
            {icon}
          </span>
          <div>
            <h1 className={`text-2xl font-bold sm:text-3xl ${category.colors.text}`}>
              {category.label}
            </h1>
            <p className="mt-0.5 text-sm text-stone-600">{category.description}</p>
          </div>
        </div>

        {category.heroQuery && <PhotoStrip query={category.heroQuery} count={12} />}
      </div>

      <div className="mt-6">
        <SearchFilters subjects={subjects} defaultValues={search} showLevel={showLevel} />
      </div>

      <section className="mt-8">
        <p className="mb-4 text-sm text-stone-500">
          {teachers.length}{" "}
          {teachers.length === 1 ? "profesor encontrado" : "profesores encontrados"} en{" "}
          <span className="font-medium">{category.label}</span>
        </p>

        {teachers.length > 0 ? (
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
    </main>
  );
}
