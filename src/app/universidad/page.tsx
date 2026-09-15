import type { Metadata } from "next";
import Link from "next/link";
import type { Modality } from "@prisma/client";
import { getAllSubjects, getTeacherSearchResults } from "@/lib/teachers";
import { CATEGORY_ICONS, UNIVERSITY_SECTION, VERTICAL_THEME } from "@/lib/constants";
import SearchFilters from "@/components/SearchFilters";
import TeacherCard from "@/components/TeacherCard";
import PhotoStrip from "@/components/PhotoStrip";

export const metadata: Metadata = {
  title: "Universidad · TuProfesorParticular",
};

type SearchParams = {
  materia?: string;
  ciudad?: string;
  modalidad?: string;
  precioMax?: string;
};

// "Universidad" no es una categoría de materia (como Ciencias u Oposiciones):
// es un filtro de nivel que cruza todas las materias, así que tiene su
// propia página en vez de vivir bajo /categoria/[slug].
export default async function UniversidadPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const search = await searchParams;
  const theme = VERTICAL_THEME.educacion;

  const [allSubjects, teachers] = await Promise.all([
    getAllSubjects(),
    getTeacherSearchResults({
      level: "universidad",
      subject: search.materia || undefined,
      city: search.ciudad || undefined,
      modality: (search.modalidad as Modality) || undefined,
      maxPrice: search.precioMax ? Number(search.precioMax) : undefined,
    }),
  ]);
  const subjects = allSubjects.filter((s) => s.vertical === "educacion");

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/" className={`text-sm hover:underline ${theme.accentText}`}>
        ← Todas las categorías
      </Link>

      <div
        className={`mt-4 overflow-hidden rounded-3xl border p-6 sm:p-8 ${UNIVERSITY_SECTION.colors.border} ${UNIVERSITY_SECTION.colors.bg}`}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
            {CATEGORY_ICONS.Universidad}
          </span>
          <div>
            <h1 className={`text-2xl font-bold sm:text-3xl ${UNIVERSITY_SECTION.colors.text}`}>
              {UNIVERSITY_SECTION.label}
            </h1>
            <p className="mt-0.5 text-sm text-stone-600">{UNIVERSITY_SECTION.description}</p>
          </div>
        </div>

        {UNIVERSITY_SECTION.heroQuery && (
          <PhotoStrip query={UNIVERSITY_SECTION.heroQuery} count={12} />
        )}
      </div>

      <div className="mt-6">
        <SearchFilters subjects={subjects} defaultValues={search} showLevel={false} />
      </div>

      <section className="mt-8">
        <p className="mb-4 text-sm text-stone-500">
          {teachers.length}{" "}
          {teachers.length === 1 ? "profesor encontrado" : "profesores encontrados"} en{" "}
          <span className="font-medium">Universidad</span>
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
