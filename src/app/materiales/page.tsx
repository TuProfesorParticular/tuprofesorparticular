import Link from "next/link";
import type { Metadata } from "next";
import type { MaterialCourse, Vertical } from "@prisma/client";
import {
  CATEGORIES,
  MATERIAL_COURSE_LABELS,
  getCoursesForCategory,
  VERTICALS,
  DEFAULT_VERTICAL,
} from "@/lib/constants";
import {
  getMaterialCountsByCourse,
  getMaterialCountsBySubject,
  getMaterialsByCategoryAndCourse,
  getMaterialsBySubject,
} from "@/lib/materials";
import { getSubjectsByCategory } from "@/lib/teachers";

function MaterialCard({
  material,
}: {
  material: {
    id: string;
    title: string;
    description: string | null;
    fileUrl: string;
    teacherProfile: { user: { name: string } };
  };
}) {
  return (
    <li className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-stone-900">{material.title}</p>
      {material.description && (
        <p className="mt-1 text-sm text-stone-600">{material.description}</p>
      )}
      <p className="mt-2 text-xs text-stone-400">
        Por {material.teacherProfile.user.name}
      </p>
      <a
        href={material.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block rounded-lg bg-rose-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-rose-700"
      >
        Descargar
      </a>
    </li>
  );
}

export const metadata: Metadata = {
  title: "Materiales · TuProfesorParticular",
};

type SearchParams = { categoria?: string; curso?: string; materia?: string; ambito?: string };

// Enlace de "volver" desde dentro de una categoría a la lista de
// categorías de su mismo ámbito (Educación, Deporte o Salud Mental).
function backToAllCategoriesHref(vertical: Vertical): string {
  return vertical === DEFAULT_VERTICAL ? "/materiales" : `/materiales?ambito=${vertical}`;
}

// Categorías "estilo oposición": no se organizan por curso (1º ESO...),
// sino en una carpeta directa por materia/especialidad. Además de
// "Oposiciones" en sí, las oposiciones con muchas especialidades
// (Secundaria) o que de momento solo llevan exámenes/casos prácticos
// (Primaria, Infantil) tienen su propia categoría "hija" — ver
// COMPOUND_OPOSICIONES más abajo.
const OPOSICION_STYLE_CATEGORIES = new Set([
  "oposiciones",
  "oposición secundaria",
  "oposición primaria",
  "oposición infantil",
]);

// Enlaces desde la lista de "Oposiciones" hacia sus categorías hijas.
const COMPOUND_OPOSICIONES = [
  { label: "Oposición Secundaria", categoria: "Oposición Secundaria" },
  { label: "Oposición Primaria", categoria: "Oposición Primaria" },
  { label: "Oposición Infantil", categoria: "Oposición Infantil" },
];

export default async function MaterialesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { categoria, curso, materia, ambito } = await searchParams;

  if (!categoria) {
    const activeVertical: Vertical = VERTICALS.some((v) => v.slug === ambito)
      ? (ambito as Vertical)
      : DEFAULT_VERTICAL;

    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold text-stone-900">Materiales</h1>
        <p className="mt-2 text-stone-500">
          Apuntes, ejercicios y recursos que comparten los profesionales, organizados por área.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {VERTICALS.map((v) => (
            <Link
              key={v.slug}
              href={v.slug === DEFAULT_VERTICAL ? "/materiales" : `/materiales?ambito=${v.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                activeVertical === v.slug
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-300 bg-white text-stone-600 hover:border-stone-400"
              }`}
            >
              {v.icon} {v.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CATEGORIES.filter((category) => category.vertical === activeVertical).map((category) => (
            <Link
              key={category.slug}
              href={`/materiales?categoria=${encodeURIComponent(category.slug)}`}
              className="rounded-xl border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
            >
              <h2 className={`text-base font-semibold ${category.colors.text}`}>
                {category.label}
              </h2>
              <p className="mt-1 text-sm text-stone-500">{category.description}</p>
            </Link>
          ))}
        </div>
      </main>
    );
  }

  const category = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === categoria.toLowerCase(),
  );

  // Oposiciones (y sus categorías hijas: Secundaria, Primaria, Infantil) no
  // tienen "cursos" (1º ESO, 2º Bachillerato...) -- se organizan
  // directamente en una carpeta por materia/especialidad.
  if (OPOSICION_STYLE_CATEGORIES.has(categoria.toLowerCase())) {
    const isOposicionesRoot = categoria.toLowerCase() === "oposiciones";
    // Las categorías hijas no están en CATEGORIES (no son un globo de
    // búsqueda de profesores en la home), así que heredan el color de
    // "Oposiciones" para mantener la misma identidad visual.
    const colorSource = category ?? CATEGORIES.find((c) => c.slug === "Oposiciones");

    const oposicionSubjectsRaw = await getSubjectsByCategory(categoria);
    // "Oposición Secundaria" y "Oposición Primaria" ya no son una materia
    // suelta de "Oposiciones" (ahora son categorías propias, ver
    // COMPOUND_OPOSICIONES) -- si quedara alguna fila antigua con ese
    // nombre exacto en la base de datos, no se muestra como duplicado.
    const oposicionSubjects = isOposicionesRoot
      ? oposicionSubjectsRaw.filter(
          (s) => !["oposición secundaria", "oposición primaria"].includes(s.name.toLowerCase()),
        )
      : oposicionSubjectsRaw;
    const selectedSubject = oposicionSubjects.find((s) => s.id === materia);

    if (!materia || !selectedSubject) {
      const counts = await getMaterialCountsBySubject(categoria);
      const backHref = isOposicionesRoot ? "/materiales" : "/materiales?categoria=Oposiciones";
      const backLabel = isOposicionesRoot ? "Todas las categorías" : "Oposiciones";

      return (
        <main className="mx-auto max-w-4xl px-4 py-10">
          <Link href={backHref} className="text-sm text-teal-600 hover:underline">
            ← {backLabel}
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">
            {category?.label ?? categoria}
          </h1>
          <p className="mt-2 text-stone-500">
            Elige {isOposicionesRoot ? "la oposición" : "una opción"} para ver los materiales.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {isOposicionesRoot &&
              COMPOUND_OPOSICIONES.map((opo) => (
                <Link
                  key={opo.categoria}
                  href={`/materiales?categoria=${encodeURIComponent(opo.categoria)}`}
                  className="rounded-xl border border-stone-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
                >
                  <p className={`font-semibold ${colorSource?.colors.text ?? "text-stone-700"}`}>
                    {opo.label}
                  </p>
                </Link>
              ))}
            {oposicionSubjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/materiales?categoria=${encodeURIComponent(categoria)}&materia=${subject.id}`}
                className="rounded-xl border border-stone-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
              >
                <p className={`font-semibold ${colorSource?.colors.text ?? "text-stone-700"}`}>
                  {subject.name}
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  {counts.get(subject.id) ?? 0} materiales
                </p>
              </Link>
            ))}
          </div>
        </main>
      );
    }

    const materials = await getMaterialsBySubject(selectedSubject.id);

    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link
          href={`/materiales?categoria=${encodeURIComponent(categoria)}`}
          className="text-sm text-teal-600 hover:underline"
        >
          ← {category?.label ?? categoria}
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">
          {selectedSubject.name}
        </h1>

        {materials.length === 0 ? (
          <p className="mt-8 rounded-lg border border-dashed border-stone-300 p-8 text-center text-stone-400">
            Todavía no hay materiales para esta oposición.
          </p>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {materials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </ul>
        )}
      </main>
    );
  }

  const coursesForCategory = getCoursesForCategory(category?.slug ?? categoria);

  const isValidCourse = (coursesForCategory as string[]).includes(curso ?? "");

  if (!curso || !isValidCourse) {
    const counts = await getMaterialCountsByCourse(categoria);

    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link
          href={backToAllCategoriesHref(category?.vertical ?? DEFAULT_VERTICAL)}
          className="text-sm text-teal-600 hover:underline"
        >
          ← Todas las categorías
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">
          {category?.label ?? categoria}
        </h1>
        <p className="mt-2 text-stone-500">Elige el curso para ver los materiales.</p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {coursesForCategory.map((courseValue) => (
            <Link
              key={courseValue}
              href={`/materiales?categoria=${encodeURIComponent(categoria)}&curso=${courseValue}`}
              className={`rounded-xl border p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md ${category?.colors.bg ?? "bg-stone-50"} ${category?.colors.border ?? "border-stone-200"}`}
            >
              <p className={`font-semibold ${category?.colors.text ?? "text-stone-700"}`}>
                {MATERIAL_COURSE_LABELS[courseValue]}
              </p>
              <p className="mt-1 text-xs text-stone-400">
                {counts.get(courseValue) ?? 0} materiales
              </p>
            </Link>
          ))}
        </div>
      </main>
    );
  }

  const course = curso as MaterialCourse;
  const materials = await getMaterialsByCategoryAndCourse(categoria, course);

  const materialsBySubject = new Map<string, typeof materials>();
  for (const material of materials) {
    const list = materialsBySubject.get(material.subject.name) ?? [];
    list.push(material);
    materialsBySubject.set(material.subject.name, list);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href={`/materiales?categoria=${encodeURIComponent(categoria)}`}
        className="text-sm text-teal-600 hover:underline"
      >
        ← {category?.label ?? categoria}
      </Link>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">
        {MATERIAL_COURSE_LABELS[course]}
      </h1>

      {materialsBySubject.size === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-stone-300 p-8 text-center text-stone-400">
          Todavía no hay materiales en este curso.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {[...materialsBySubject.entries()].map(([subjectName, items]) => (
            <section key={subjectName}>
              <h2 className="text-lg font-semibold text-stone-900">{subjectName}</h2>
              <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((material) => (
                  <MaterialCard key={material.id} material={material} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
