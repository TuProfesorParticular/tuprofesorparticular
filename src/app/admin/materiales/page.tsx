import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { MATERIAL_COURSE_LABELS } from "@/lib/constants";
import { setMaterialStatus } from "./actions";

export const metadata: Metadata = {
  title: "Materiales · TuProfesorParticular",
};

export default async function AdminMaterialesPage() {
  await requireRole("admin");

  const materials = await prisma.material.findMany({
    include: {
      subject: { select: { name: true } },
      teacherProfile: { include: { user: { select: { name: true, email: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const pending = materials.filter((m) => m.status === "pending");
  const reviewed = materials.filter((m) => m.status !== "pending");

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Materiales</h1>
          <p className="mt-1 text-sm text-stone-500">
            Revisa los materiales antes de que se publiquen y cuenten para el
            descuento de los profesores.
          </p>
        </div>
        <Link href="/admin" className="text-sm text-teal-600 hover:underline">
          ← Volver a administración
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900">
          Pendientes de revisión ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">No hay nada pendiente.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {pending.map((material) => (
              <li
                key={material.id}
                className="rounded-xl border border-amber-200 bg-amber-50 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-stone-900">
                      {material.title}
                    </p>
                    <p className="text-xs text-stone-500">
                      {material.teacherProfile.user.name} (
                      {material.teacherProfile.user.email}) · {material.subject.name} ·{" "}
                      {MATERIAL_COURSE_LABELS[material.course]}
                    </p>
                    {material.description && (
                      <p className="mt-1 text-sm text-stone-600">{material.description}</p>
                    )}
                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-xs font-medium text-teal-600 hover:underline"
                    >
                      Ver archivo ({material.fileName})
                    </a>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    <form action={setMaterialStatus}>
                      <input type="hidden" name="materialId" value={material.id} />
                      <input type="hidden" name="status" value="approved" />
                      <button
                        type="submit"
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                      >
                        Aprobar
                      </button>
                    </form>
                    <form action={setMaterialStatus}>
                      <input type="hidden" name="materialId" value={material.id} />
                      <input type="hidden" name="status" value="rejected" />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Rechazar
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-stone-900">
          Ya revisados ({reviewed.length})
        </h2>

        {reviewed.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">Todavía ninguno.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {reviewed.map((material) => (
              <li
                key={material.id}
                className="flex flex-col gap-2 rounded-lg border border-stone-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-stone-900">{material.title}</p>
                  <p className="text-xs text-stone-500">
                    {material.teacherProfile.user.name} · {material.subject.name}
                  </p>
                </div>
                <span
                  className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    material.status === "approved"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {material.status === "approved" ? "Aprobado" : "Rechazado"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
