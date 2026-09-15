import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-helpers";
import { getAllSubjects } from "@/lib/teachers";
import { getStudentRequestsForStudent } from "@/lib/studentRequests";
import { LEVEL_LABELS, MODALITY_LABELS } from "@/lib/constants";
import NewRequestForm from "./NewRequestForm";
import { closeStudentRequest, deleteStudentRequest } from "./actions";

export const metadata: Metadata = {
  title: "Mis anuncios · TuProfesorParticular",
};

export default async function MisAnunciosPage() {
  const session = await requireRole("student");

  const [subjects, requests] = await Promise.all([
    getAllSubjects(),
    getStudentRequestsForStudent(session.user.id),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-900">Mis anuncios</h1>
      <p className="mt-1 text-sm text-stone-500">
        Publica lo que necesitas y deja que los profesores te contacten a ti,
        en vez de buscar uno por uno.
      </p>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <NewRequestForm subjects={subjects} />
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-stone-900">
          Publicados ({requests.length})
        </h2>
        <ul className="mt-3 space-y-2">
          {requests.map((request) => (
            <li
              key={request.id}
              className="rounded-lg border border-stone-200 bg-white px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-stone-900">
                    {request.title}
                  </p>
                  <p className="text-xs text-stone-500">
                    {request.subject.name} · {LEVEL_LABELS[request.level]} ·{" "}
                    {MODALITY_LABELS[request.modality]}
                  </p>
                </div>
                <span
                  className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    request.status === "open"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {request.status === "open" ? "Abierto" : "Cerrado"}
                </span>
              </div>
              <div className="mt-2 flex gap-3">
                <form action={closeStudentRequest}>
                  <input type="hidden" name="requestId" value={request.id} />
                  <button
                    type="submit"
                    className="text-xs font-medium text-teal-600 hover:underline"
                  >
                    {request.status === "open" ? "Marcar como cerrado" : "Reabrir"}
                  </button>
                </form>
                <form action={deleteStudentRequest}>
                  <input type="hidden" name="requestId" value={request.id} />
                  <button
                    type="submit"
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            </li>
          ))}
          {requests.length === 0 && (
            <p className="rounded-lg border border-dashed border-stone-300 p-6 text-center text-sm text-stone-400">
              Todavía no has publicado ningún anuncio.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
