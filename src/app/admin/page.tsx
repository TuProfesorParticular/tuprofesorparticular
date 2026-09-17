import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getEthicsReports } from "@/lib/ethics";
import { getSuggestions } from "@/lib/suggestions";
import { LEVEL_LABELS, MODALITY_LABELS } from "@/lib/constants";
import { getPlan } from "@/lib/plans";
import {
  setTeacherProfileStatus,
  toggleUserStatus,
  setEthicsReportStatus,
  setSuggestionStatus,
  adminDeleteStudentRequest,
  approveRefundRequest,
  dismissRefundRequest,
} from "./actions";
import DeleteUserButton from "./DeleteUserButton";

export const metadata: Metadata = {
  title: "Administración · TuProfesorParticular",
};

const REPORT_STATUS_LABELS = {
  open: "Abierto",
  reviewed: "Revisado",
  closed: "Cerrado",
};

const REPORT_STATUS_STYLES = {
  open: "bg-red-50 text-red-700",
  reviewed: "bg-amber-50 text-amber-700",
  closed: "bg-stone-100 text-stone-500",
};

const PLAN_BADGE_STYLES = {
  free: "bg-stone-100 text-stone-500",
  pro: "bg-amber-50 text-amber-700",
  premium: "bg-violet-50 text-violet-700",
};

const SUGGESTION_CATEGORY_LABELS = {
  error: "🐞 Error",
  mejora: "💡 Mejora",
  otro: "📝 Otro",
};

export default async function AdminPage() {
  const session = await requireRole("admin");

  const [
    pendingProfiles,
    publishedProfiles,
    users,
    ethicsReports,
    suggestions,
    studentRequests,
    refundRequests,
    errorCount,
    pendingMaterialsCount,
    totalTeacherCount,
    totalStudentCount,
  ] = await Promise.all([
    prisma.teacherProfile.findMany({
      where: { status: "pending" },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.teacherProfile.findMany({
      where: { status: { in: ["approved", "rejected"] } },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 300,
    }),
    getEthicsReports(),
    getSuggestions(),
    prisma.studentRequest.findMany({
      include: {
        subject: { select: { name: true } },
        student: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.booking.findMany({
      where: { status: "paid", refundRequestedAt: { not: null } },
      include: {
        student: { select: { name: true, email: true } },
        teacherProfile: { include: { user: { select: { name: true } } } },
      },
      orderBy: { refundRequestedAt: "asc" },
    }),
    prisma.errorLog.count(),
    prisma.material.count({ where: { status: "pending" } }),
    prisma.user.count({ where: { role: "teacher" } }),
    prisma.user.count({ where: { role: "student" } }),
  ]);

  const teacherUsers = users.filter((u) => u.role === "teacher");
  const studentUsers = users.filter((u) => u.role === "student");

  const openSuggestionsCount = suggestions.filter((s) => s.status === "open").length;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Administración</h1>
        <nav className="flex flex-wrap items-center gap-2">
          <AdminNavPill href="/admin/materiales" label="Materiales" count={pendingMaterialsCount} />
          <AdminNavPill href="/admin/errores" label="Errores" count={errorCount} tone="red" />
          <AdminNavPill href="#reembolsos" label="Reembolsos" count={refundRequests.length} />
          <AdminNavPill href="#sugerencias" label="Sugerencias" count={openSuggestionsCount} />
          <AdminNavPill href="/admin/contactos" label="Centros" />
          <span className="mx-1 hidden h-6 w-px bg-stone-200 sm:block" />
          <Link
            href="/admin/analytics"
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Ver analítica
          </Link>
        </nav>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900">
          Perfiles de profesor pendientes de aprobación ({pendingProfiles.length})
        </h2>

        {pendingProfiles.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">
            No hay anuncios pendientes.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {pendingProfiles.map((profile) => (
              <li
                key={profile.id}
                className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-stone-900">
                    <Link href={`/profesores/${profile.id}`} target="_blank" className="hover:underline">
                      {profile.user.name}
                    </Link>{" "}
                    <span className="font-normal text-stone-400">
                      · {profile.user.email}
                    </span>{" "}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${PLAN_BADGE_STYLES[profile.plan]}`}
                    >
                      {getPlan(profile.plan).name}
                    </span>
                  </p>
                  <p className="truncate text-sm text-stone-500">
                    {profile.bio || "(sin presentación todavía)"}
                  </p>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  <Link
                    href={`/profesores/${profile.id}`}
                    target="_blank"
                    className="self-center rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-50"
                  >
                    Ver anuncio
                  </Link>
                  <form action={setTeacherProfileStatus}>
                    <input type="hidden" name="teacherProfileId" value={profile.id} />
                    <input type="hidden" name="status" value="approved" />
                    <button
                      type="submit"
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Aprobar
                    </button>
                  </form>
                  <form action={setTeacherProfileStatus}>
                    <input type="hidden" name="teacherProfileId" value={profile.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Rechazar
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-stone-900">
          Profesores publicados ({publishedProfiles.filter((p) => p.status === "approved").length} activos de {publishedProfiles.length})
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Puedes despublicar el anuncio de cualquier profesor en cualquier momento, o volver a publicarlo.
        </p>

        {publishedProfiles.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">
            Todavía no hay profesores aprobados.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {publishedProfiles.map((profile) => (
              <li
                key={profile.id}
                className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-stone-900">
                    <Link href={`/profesores/${profile.id}`} target="_blank" className="hover:underline">
                      {profile.user.name}
                    </Link>{" "}
                    <span className="font-normal text-stone-400">
                      · {profile.user.email}
                    </span>{" "}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${PLAN_BADGE_STYLES[profile.plan]}`}
                    >
                      {getPlan(profile.plan).name}
                    </span>
                  </p>
                  <p className="truncate text-sm text-stone-500">
                    {profile.bio || "(sin presentación todavía)"}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <Link
                    href={`/profesores/${profile.id}`}
                    target="_blank"
                    className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-50"
                  >
                    Ver anuncio
                  </Link>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      profile.status === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {profile.status === "approved" ? "Publicado" : "Despublicado"}
                  </span>
                  <form action={setTeacherProfileStatus}>
                    <input type="hidden" name="teacherProfileId" value={profile.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={profile.status === "approved" ? "rejected" : "approved"}
                    />
                    <button
                      type="submit"
                      className={
                        profile.status === "approved"
                          ? "rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                          : "rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                      }
                    >
                      {profile.status === "approved" ? "Despublicar" : "Publicar"}
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-stone-900">
          Canal ético — reportes ({ethicsReports.filter((r) => r.status === "open").length} abiertos)
        </h2>

        {ethicsReports.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">No hay reportes todavía.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {ethicsReports.map((report) => (
              <li
                key={report.id}
                className="rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-stone-500">
                      De {report.reporter.name} ({report.reporter.email})
                      {report.teacherProfile && (
                        <>
                          {" "}
                          sobre{" "}
                          <span className="font-medium text-stone-700">
                            {report.teacherProfile.user.name}
                          </span>
                        </>
                      )}
                      {" · "}
                      {report.createdAt.toLocaleDateString("es-ES")}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-stone-800">
                      {report.message}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${REPORT_STATUS_STYLES[report.status]}`}
                  >
                    {REPORT_STATUS_LABELS[report.status]}
                  </span>
                </div>

                {report.status !== "closed" && (
                  <div className="mt-3 flex gap-2">
                    {report.status === "open" && (
                      <form action={setEthicsReportStatus}>
                        <input type="hidden" name="reportId" value={report.id} />
                        <input type="hidden" name="status" value="reviewed" />
                        <button
                          type="submit"
                          className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
                        >
                          Marcar como revisado
                        </button>
                      </form>
                    )}
                    <form action={setEthicsReportStatus}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <input type="hidden" name="status" value="closed" />
                      <button
                        type="submit"
                        className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
                      >
                        Cerrar
                      </button>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="reembolsos" className="mt-10 scroll-mt-6">
        <h2 className="text-lg font-semibold text-stone-900">
          Solicitudes de reembolso ({refundRequests.length})
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Alumnos que han pedido el reembolso de una primera clase pagada
          (ver política en /terminos, sección 7).
        </p>

        {refundRequests.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">No hay solicitudes pendientes.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {refundRequests.map((booking) => (
              <li
                key={booking.id}
                className="rounded-xl border border-amber-200 bg-amber-50/40 p-4"
              >
                <p className="text-sm text-stone-500">
                  <span className="font-medium text-stone-800">
                    {booking.student.name}
                  </span>{" "}
                  ({booking.student.email}) · {Number(booking.amount)}€ · primera
                  clase con{" "}
                  <span className="font-medium text-stone-800">
                    {booking.teacherProfile.user.name}
                  </span>
                  {" · "}
                  {booking.refundRequestedAt?.toLocaleDateString("es-ES")}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-stone-800">
                  {booking.refundReason}
                </p>
                <div className="mt-3 flex gap-2">
                  <form action={approveRefundRequest}>
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <button
                      type="submit"
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                    >
                      Reembolsar
                    </button>
                  </form>
                  <form action={dismissRefundRequest}>
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
                    >
                      Descartar
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="sugerencias" className="mt-10 scroll-mt-6">
        <h2 className="text-lg font-semibold text-stone-900">
          Sugerencias ({suggestions.filter((s) => s.status === "open").length} abiertas)
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Errores y propuestas de mejora que alumnos y profesores envían
          desde &quot;Sugerencias&quot; en su panel.
        </p>

        {suggestions.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">No hay sugerencias todavía.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-stone-500">
                      {SUGGESTION_CATEGORY_LABELS[suggestion.category]} · De{" "}
                      {suggestion.user.name} ({suggestion.user.email},{" "}
                      {suggestion.user.role === "teacher" ? "profesor" : "alumno"})
                      {" · "}
                      {suggestion.createdAt.toLocaleDateString("es-ES")}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-stone-800">
                      {suggestion.message}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${REPORT_STATUS_STYLES[suggestion.status]}`}
                  >
                    {REPORT_STATUS_LABELS[suggestion.status]}
                  </span>
                </div>

                {suggestion.status !== "closed" && (
                  <div className="mt-3 flex gap-2">
                    {suggestion.status === "open" && (
                      <form action={setSuggestionStatus}>
                        <input type="hidden" name="suggestionId" value={suggestion.id} />
                        <input type="hidden" name="status" value="reviewed" />
                        <button
                          type="submit"
                          className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
                        >
                          Marcar como revisada
                        </button>
                      </form>
                    )}
                    <form action={setSuggestionStatus}>
                      <input type="hidden" name="suggestionId" value={suggestion.id} />
                      <input type="hidden" name="status" value="closed" />
                      <button
                        type="submit"
                        className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
                      >
                        Cerrar
                      </button>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-stone-900">
          Anuncios de alumnos ({studentRequests.filter((r) => r.status === "open").length} abiertos de {studentRequests.length})
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Peticiones que los alumnos publican en &quot;Mis anuncios&quot; para que los profesores les contacten.
        </p>

        {studentRequests.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">
            No hay anuncios de alumnos todavía.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {studentRequests.map((request) => (
              <li
                key={request.id}
                className="rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-900">
                      {request.title}
                    </p>
                    <p className="text-xs text-stone-500">
                      {request.student.name} ({request.student.email}) ·{" "}
                      {request.subject.name} · {LEVEL_LABELS[request.level]} ·{" "}
                      {MODALITY_LABELS[request.modality]}
                      {request.city ? ` · ${request.city}` : ""}
                      {request.budgetPerHour
                        ? ` · ${request.budgetPerHour}€/h`
                        : ""}
                      {" · "}
                      {request.createdAt.toLocaleDateString("es-ES")}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-stone-700">
                      {request.description}
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
                <div className="mt-3">
                  <form action={adminDeleteStudentRequest}>
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
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-stone-900">
          Profesores ({totalTeacherCount})
        </h2>
        <UserTable users={teacherUsers} currentUserId={session.user.id} />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-stone-900">
          Alumnos ({totalStudentCount})
        </h2>
        <UserTable users={studentUsers} currentUserId={session.user.id} />
      </section>
    </main>
  );
}

function UserTable({
  users,
  currentUserId,
}: {
  users: { id: string; name: string; email: string; status: "active" | "suspended" }[];
  currentUserId: string;
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-stone-100 text-stone-500">
          <tr>
            <th className="px-4 py-2 font-medium">Nombre</th>
            <th className="px-4 py-2 font-medium">Email</th>
            <th className="px-4 py-2 font-medium">Estado</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2 text-stone-500">{user.email}</td>
              <td className="px-4 py-2">
                <span
                  className={
                    user.status === "active"
                      ? "rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700"
                      : "rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700"
                  }
                >
                  {user.status === "active" ? "Activo" : "Suspendido"}
                </span>
              </td>
              <td className="px-4 py-2 text-right">
                {user.id !== currentUserId && (
                  <div className="flex justify-end gap-3">
                    <form action={toggleUserStatus}>
                      <input type="hidden" name="userId" value={user.id} />
                      <button
                        type="submit"
                        className="text-xs font-medium text-teal-600 hover:underline"
                      >
                        {user.status === "active" ? "Suspender" : "Reactivar"}
                      </button>
                    </form>
                    <DeleteUserButton userId={user.id} userName={user.name} />
                  </div>
                )}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-stone-400">
                Ninguno todavía.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Botón de navegación de la cabecera de administración. Siempre con el
// mismo estilo neutro (para que la fila no se vea "amontonada" cuando hay
// varios pendientes a la vez) — el aviso es una insignia pequeña en la
// esquina, no todo el botón relleno de color.
function AdminNavPill({
  href,
  label,
  count,
  tone = "amber",
}: {
  href: string;
  label: string;
  count?: number;
  tone?: "amber" | "red";
}) {
  const hasCount = Boolean(count && count > 0);
  const badgeTone = tone === "red" ? "bg-red-600" : "bg-amber-500";
  const Tag = href.startsWith("#") ? "a" : Link;

  return (
    <Tag
      href={href}
      className="relative rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition hover:border-stone-400 hover:bg-stone-50"
    >
      {label}
      {hasCount && (
        <span
          className={`absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold text-white ${badgeTone}`}
        >
          {count}
        </span>
      )}
    </Tag>
  );
}
