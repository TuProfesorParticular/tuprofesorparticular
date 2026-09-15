import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LEVEL_LABELS, MODALITY_LABELS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Alumnos buscan profesor particular · TuProfesorParticular",
  description:
    "Explora los anuncios que publican los alumnos buscando profesor particular, entrenador o profesional de la salud mental en toda España. Regístrate como profesional para contactar.",
};

export default async function OportunidadesPage() {
  const requests = await prisma.studentRequest.findMany({
    where: { status: "open" },
    include: { subject: { select: { name: true, category: true } } },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="mx-auto mb-3 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
        OPORTUNIDADES ABIERTAS
      </p>
      <h1 className="text-3xl font-bold text-stone-900">
        Alumnos buscando profesor particular ahora mismo
      </h1>
      <p className="mt-3 max-w-2xl text-stone-500">
        Estos son anuncios reales publicados por alumnos y familias en toda
        España. Regístrate como profesor, entrenador o profesional para ver
        el contacto y responder directamente.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-stone-900">{requests.length}</p>
          <p className="text-sm text-stone-500">Anuncios abiertos</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-stone-900">0€</p>
          <p className="text-sm text-stone-500">Coste para registrarte</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-stone-900">Directo</p>
          <p className="text-sm text-stone-500">Contacto sin intermediarios</p>
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        {requests.map((request) => (
          <li
            key={request.id}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-stone-900">{request.title}</p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {request.subject.category} · {request.subject.name} ·{" "}
                  {LEVEL_LABELS[request.level]} · {MODALITY_LABELS[request.modality]}
                  {request.city ? ` · ${request.city}` : ""}
                </p>
              </div>
              {request.budgetPerHour !== null && (
                <span className="flex-shrink-0 text-sm font-semibold text-stone-900">
                  {Number(request.budgetPerHour)}€/h
                </span>
              )}
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-stone-600">
              {request.description}
            </p>
            <p className="mt-3 text-xs text-stone-400">
              Publicado el {request.createdAt.toLocaleDateString("es-ES")}
            </p>
            <Link
              href="/registro"
              className="mt-3 inline-block rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-teal-700 hover:to-emerald-600 hover:shadow-lg"
            >
              Regístrate para contactar
            </Link>
          </li>
        ))}
        {requests.length === 0 && (
          <p className="rounded-lg border border-dashed border-stone-300 p-8 text-center text-sm text-stone-400">
            No hay anuncios abiertos ahora mismo. Vuelve pronto.
          </p>
        )}
      </ul>

      <p className="mt-10 text-center text-xs text-stone-400">
        ¿Ya tienes cuenta de profesor?{" "}
        <Link href="/iniciar-sesion" className="text-teal-600 hover:underline">
          Inicia sesión
        </Link>{" "}
        para contactar directamente con estos alumnos.
      </p>
    </main>
  );
}
