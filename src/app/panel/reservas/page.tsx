import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { requestBookingRefund } from "./actions";

export const metadata: Metadata = {
  title: "Mis reservas · TuProfesorParticular",
};

const STATUS_LABELS = {
  pending: "Pendiente",
  paid: "Pagada",
  canceled: "Cancelada",
  refunded: "Reembolsada",
};

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-700",
  canceled: "bg-stone-100 text-stone-500",
  refunded: "bg-stone-100 text-stone-500",
};

export default async function MisReservasPage() {
  const session = await requireRole("student");

  const bookings = await prisma.booking.findMany({
    where: { studentId: session.user.id },
    include: {
      teacherProfile: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-900">Mis reservas</h1>
      <p className="mt-1 text-sm text-stone-500">
        Las primeras clases que has reservado y pagado a través de la plataforma.
      </p>

      <ul className="mt-6 space-y-3">
        {bookings.map((booking) => (
          <li
            key={booking.id}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-stone-900">
                  {booking.teacherProfile.user.name}
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {Number(booking.amount)}€ ·{" "}
                  {new Intl.DateTimeFormat("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }).format(booking.createdAt)}
                </p>
              </div>
              <span
                className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[booking.status]}`}
              >
                {STATUS_LABELS[booking.status]}
              </span>
            </div>

            {booking.status === "paid" && (
              <div className="mt-3 border-t border-stone-100 pt-3">
                {booking.refundRequestedAt ? (
                  <p className="text-xs font-medium text-amber-700">
                    Reembolso solicitado el{" "}
                    {new Intl.DateTimeFormat("es-ES", {
                      day: "2-digit",
                      month: "long",
                    }).format(booking.refundRequestedAt)}
                    , en revisión.
                  </p>
                ) : (
                  <details>
                    <summary className="cursor-pointer text-xs font-medium text-red-600 hover:underline">
                      Solicitar reembolso
                    </summary>
                    <form action={requestBookingRefund} className="mt-2 flex flex-col gap-2">
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <textarea
                        name="reason"
                        required
                        rows={2}
                        maxLength={1000}
                        placeholder="Cuéntanos qué ha pasado (ej. el profesor no ha respondido, no hemos podido acordar la clase...)"
                        className="rounded-lg border border-stone-300 px-2.5 py-1.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      <button
                        type="submit"
                        className="self-start rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Enviar solicitud
                      </button>
                    </form>
                  </details>
                )}
              </div>
            )}
          </li>
        ))}
        {bookings.length === 0 && (
          <p className="rounded-lg border border-dashed border-stone-300 p-8 text-center text-sm text-stone-400">
            Todavía no has reservado ninguna clase.
          </p>
        )}
      </ul>
    </div>
  );
}
