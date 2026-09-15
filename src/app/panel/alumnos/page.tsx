import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getAllSubjects } from "@/lib/teachers";
import { getOpenStudentRequests } from "@/lib/studentRequests";
import { LEVEL_LABELS, MODALITY_LABELS, VERTICAL_THEME } from "@/lib/constants";
import { canContactStudents } from "@/lib/plans";
import { contactStudent } from "./actions";

export const metadata: Metadata = {
  title: "Alumnos buscan profesor · TuProfesorParticular",
};

export default async function AlumnosBuscanPage({
  searchParams,
}: {
  searchParams: Promise<{ materia?: string }>;
}) {
  const session = await requireRole("teacher");
  const { materia } = await searchParams;

  const [teacherProfile, subjects, requests] = await Promise.all([
    prisma.teacherProfile.findUniqueOrThrow({ where: { userId: session.user.id } }),
    getAllSubjects(),
    getOpenStudentRequests(materia || undefined),
  ]);

  const canContact = canContactStudents(teacherProfile.plan);
  const theme = VERTICAL_THEME[teacherProfile.vertical];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-stone-900">
        Alumnos buscan profesor
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Anuncios publicados por alumnos que buscan clases. Contáctales tú
        directamente, sin esperar a que te encuentren.
      </p>

      {!canContact && (
        <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          🔒 Con el plan Básico puedes ver los anuncios, pero solo los planes{" "}
          <span className="font-semibold">Pro</span> y{" "}
          <span className="font-semibold">Premium</span> pueden contactar con
          los alumnos.{" "}
          <Link href="/panel/suscripcion" className="font-medium underline">
            Mejora tu plan
          </Link>
          .
        </div>
      )}

      <form className="mt-6 flex items-center gap-3" action="/panel/alumnos">
        <label htmlFor="materia" className="text-sm font-medium text-stone-700">
          Materia
        </label>
        <select
          id="materia"
          name="materia"
          defaultValue={materia ?? ""}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="">Todas las materias</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.category} · {subject.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Filtrar
        </button>
      </form>

      <ul className="mt-6 space-y-3">
        {requests.map((request) => (
          <li
            key={request.id}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-stone-900">{request.title}</p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {request.subject.name} · {LEVEL_LABELS[request.level]} ·{" "}
                  {MODALITY_LABELS[request.modality]}
                  {request.city ? ` · ${request.city}` : ""}
                </p>
              </div>
              {request.budgetPerHour !== null && (
                <span className="flex-shrink-0 text-sm font-semibold text-stone-900">
                  {Number(request.budgetPerHour)}€/h
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-stone-600">{request.description}</p>
            <p className="mt-3 text-xs text-stone-400">
              Publicado por {request.student.name}
            </p>

            {canContact ? (
              <form action={contactStudent} className="mt-3">
                <input type="hidden" name="requestId" value={request.id} />
                <button
                  type="submit"
                  className={`rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg ${theme.ctaGradient}`}
                >
                  Contactar
                </button>
              </form>
            ) : (
              <Link
                href="/panel/suscripcion"
                className="mt-3 inline-block rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-500 hover:bg-stone-50"
              >
                🔒 Contactar (requiere plan Pro o Premium)
              </Link>
            )}
          </li>
        ))}
        {requests.length === 0 && (
          <p className="rounded-lg border border-dashed border-stone-300 p-8 text-center text-sm text-stone-400">
            No hay anuncios abiertos {materia ? "para esta materia" : "todavía"}.
          </p>
        )}
      </ul>
    </div>
  );
}
