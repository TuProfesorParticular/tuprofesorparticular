import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { PLATFORM_FEE_PERCENT } from "@/lib/plans";
import { VERTICAL_THEME } from "@/lib/constants";
import { startConnectOnboarding } from "./actions";

export const metadata: Metadata = {
  title: "Cobros · TuProfesorParticular",
};

export default async function PagosPage({
  searchParams,
}: {
  searchParams: Promise<{ onboarded?: string }>;
}) {
  const session = await requireRole("teacher");
  const { onboarded } = await searchParams;

  let teacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { userId: session.user.id },
  });
  const theme = VERTICAL_THEME[teacherProfile.vertical];

  // Monedero: lo cobrado de verdad (reservas ya pagadas), ya descontada la
  // comisión de la plataforma. Los "pending" todavía no se han cobrado, y
  // los "canceled"/"refunded" no cuentan como ganados.
  const earningsAgg = await prisma.booking.aggregate({
    where: { teacherProfileId: teacherProfile.id, status: "paid" },
    _sum: { amount: true, platformFeeAmount: true },
    _count: true,
  });
  const totalEarned =
    Number(earningsAgg._sum.amount ?? 0) - Number(earningsAgg._sum.platformFeeAmount ?? 0);
  const paidBookingsCount = earningsAgg._count;

  // Recibos internos: un justificante por cada primera clase cobrada, para
  // que el profesional lleve la cuenta de sus ingresos en la plataforma. No
  // es una factura fiscal (no pedimos NIF ni dirección fiscal a nadie).
  const paidBookings = await prisma.booking.findMany({
    where: { teacherProfileId: teacherProfile.id, status: "paid" },
    include: { student: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Al volver de Stripe, refrescamos el estado por si el webhook aún no ha llegado.
  if (onboarded && stripe && teacherProfile.stripeConnectAccountId) {
    const account = await stripe.accounts.retrieve(teacherProfile.stripeConnectAccountId);
    const isOnboarded = Boolean(account.details_submitted && account.charges_enabled);
    if (isOnboarded !== teacherProfile.stripeConnectOnboarded) {
      teacherProfile = await prisma.teacherProfile.update({
        where: { id: teacherProfile.id },
        data: { stripeConnectOnboarded: isOnboarded },
      });
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-900">Cobros</h1>
      <p className="mt-1 text-sm text-stone-500">
        Conecta tu cuenta bancaria para poder cobrar la primera clase de tus
        alumnos a través de la plataforma. La plataforma retiene un{" "}
        {PLATFORM_FEE_PERCENT}% de comisión sobre esa primera reserva; el
        resto se transfiere directamente a tu cuenta.
      </p>

      <div className={`mt-6 flex items-center gap-4 rounded-2xl p-6 text-white shadow-md ${theme.ctaGradient}`}>
        <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl">
          👛
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-white/80">
            Total ganado en la plataforma
          </p>
          <p className="text-3xl font-bold">{totalEarned.toFixed(2)}€</p>
          <p className="mt-0.5 text-xs text-white/80">
            {paidBookingsCount === 0
              ? "Todavía no has cobrado ninguna primera clase"
              : `${paidBookingsCount} ${paidBookingsCount === 1 ? "primera clase cobrada" : "primeras clases cobradas"} · comisión ya descontada`}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        {teacherProfile.stripeConnectOnboarded ? (
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Cuenta conectada y verificada. Ya puedes recibir reservas de pago.
          </p>
        ) : (
          <>
            <p className="text-sm text-stone-600">
              Todavía no has conectado ninguna cuenta de pago. La gestiona
              Stripe directamente (verificación de identidad y cuenta
              bancaria) — nosotros nunca vemos tus datos bancarios.
            </p>
            <form action={startConnectOnboarding} className="mt-4">
              <button
                type="submit"
                className={`rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg ${theme.ctaGradient}`}
              >
                Conectar cuenta de Stripe
              </button>
            </form>
          </>
        )}
      </div>

      {paidBookingsCount > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-stone-900">Recibos</h2>
          <p className="mt-1 text-sm text-stone-500">
            Un justificante por cada primera clase cobrada, útil para llevar
            tu propia cuenta de ingresos. No es una factura fiscal.
          </p>
          <ul className="mt-3 space-y-2">
            {paidBookings.map((booking) => (
              <li
                key={booking.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-900">
                    {booking.student.name}
                  </p>
                  <p className="text-xs text-stone-500">
                    {new Intl.DateTimeFormat("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(booking.createdAt)}{" "}
                    ·{" "}
                    {(Number(booking.amount) - Number(booking.platformFeeAmount)).toFixed(2)}
                    € netos
                  </p>
                </div>
                <Link
                  href={`/panel/pagos/recibos/${booking.id}`}
                  className={`flex-shrink-0 text-sm font-medium ${theme.accentText} hover:underline`}
                >
                  Ver recibo
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
