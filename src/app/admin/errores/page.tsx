import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { clearErrorLog, clearAllErrorLogs } from "./actions";

export const metadata: Metadata = {
  title: "Errores · TuProfesorParticular",
};

export default async function AdminErroresPage() {
  await requireRole("admin");

  const errors = await prisma.errorLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Errores</h1>
          <p className="mt-1 text-sm text-stone-500">
            Errores no controlados capturados automáticamente en producción.
          </p>
        </div>
        <Link href="/admin" className="text-sm text-teal-600 hover:underline">
          ← Volver a administración
        </Link>
      </div>

      {errors.length > 0 && (
        <form action={clearAllErrorLogs} className="mt-4">
          <button
            type="submit"
            className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
          >
            Borrar todos
          </button>
        </form>
      )}

      {errors.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-400">
          Sin errores registrados. Buena señal 🎉
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {errors.map((error) => (
            <li
              key={error.id}
              className="rounded-xl border border-red-200 bg-red-50 p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-red-800">
                    {error.message}
                  </p>
                  <p className="mt-1 text-xs text-red-600">
                    {error.path ? `${error.path} · ` : ""}
                    {error.createdAt.toLocaleString("es-ES")}
                  </p>
                  {error.stack && (
                    <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-white p-2 text-[10px] text-stone-600">
                      {error.stack}
                    </pre>
                  )}
                </div>
                <form action={clearErrorLog} className="flex-shrink-0">
                  <input type="hidden" name="id" value={error.id} />
                  <button
                    type="submit"
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Descartar
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
