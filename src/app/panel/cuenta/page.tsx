import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { VERTICAL_THEME, DEFAULT_VERTICAL } from "@/lib/constants";
import EditAccountForm from "./EditAccountForm";
import ChangePasswordForm from "./ChangePasswordForm";
import DeleteAccountForm from "./DeleteAccountForm";
import { toggleWeeklyDigest } from "./actions";

export const metadata: Metadata = {
  title: "Mi cuenta · TuProfesorParticular",
};

export default async function CuentaPage() {
  const session = await requireSession();

  const [user, teacherProfile, paidBookingsCount] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { name: true, email: true },
    }),
    session.user.role === "teacher"
      ? prisma.teacherProfile.findUnique({
          where: { userId: session.user.id },
          select: {
            stripeConnectOnboarded: true,
            plan: true,
            vertical: true,
            weeklyDigestOptOut: true,
          },
        })
      : null,
    session.user.role === "student"
      ? prisma.booking.count({ where: { studentId: session.user.id, status: "paid" } })
      : null,
  ]);
  const theme = VERTICAL_THEME[teacherProfile?.vertical ?? DEFAULT_VERTICAL];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-900">Mi cuenta</h1>
      <p className="mt-1 text-sm text-stone-500">{user.email}</p>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-900">Mis datos</h2>
        <div className="mt-3">
          <EditAccountForm name={user.name} email={user.email} />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-900">Contraseña</h2>
        <div className="mt-3">
          <ChangePasswordForm />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-900">
          Pagos y monedero
        </h2>

        {session.user.role === "teacher" ? (
          <>
            <p className="mt-1 text-sm text-stone-500">
              Tu cuenta de Stripe es donde recibes el dinero de tus alumnos.
            </p>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-stone-50 px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium text-stone-700">
                <span
                  className={`h-2 w-2 rounded-full ${
                    teacherProfile?.stripeConnectOnboarded ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {teacherProfile?.stripeConnectOnboarded
                  ? "Cuenta de Stripe conectada"
                  : "Cuenta de Stripe sin conectar"}
              </span>
              <Link href="/panel/pagos" className={`text-sm font-medium hover:underline ${theme.accentText}`}>
                {teacherProfile?.stripeConnectOnboarded ? "Gestionar" : "Conectar"}
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-stone-500">
              Aquí puedes ver el estado de tus pagos a profesores.
            </p>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-stone-50 px-4 py-3">
              <span className="text-sm font-medium text-stone-700">
                {paidBookingsCount ?? 0}{" "}
                {paidBookingsCount === 1 ? "clase pagada" : "clases pagadas"}
              </span>
              <Link href="/panel/reservas" className="text-sm font-medium text-teal-600 hover:underline">
                Ver mis reservas
              </Link>
            </div>
          </>
        )}
      </section>

      {session.user.role === "teacher" && (
        <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-900">
            Notificaciones por email
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Un resumen semanal con las visitas, mensajes y valoraciones de tu
            anuncio.
          </p>
          <form action={toggleWeeklyDigest} className="mt-3 flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                name="weeklyDigestOptOut"
                defaultChecked={!teacherProfile?.weeklyDigestOptOut}
                className="h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-500"
              />
              Recibir el resumen semanal de mi anuncio
            </label>
            <button
              type="submit"
              className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
            >
              Guardar
            </button>
          </form>
        </section>
      )}

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-900">
          Exportar mis datos
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Descarga todo lo que la plataforma guarda sobre ti (perfil,
          mensajes, reseñas, reservas) en un único archivo.
        </p>
        <a
          href="/api/account/export"
          className="mt-3 inline-block rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Descargar mis datos
        </a>
      </section>

      <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-900">
          Eliminar mi cuenta
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Borra tu cuenta y todos tus datos de forma permanente.
        </p>
        <div className="mt-3">
          <DeleteAccountForm />
        </div>
      </section>
    </div>
  );
}
