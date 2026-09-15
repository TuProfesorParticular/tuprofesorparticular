import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { PLATFORM_FEE_PERCENT } from "@/lib/plans";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Recibo · TuProfesorParticular",
};

export default async function ReciboPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole("teacher");
  const { id } = await params;

  const teacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { userId: session.user.id },
    include: { user: { select: { name: true } } },
  });

  const booking = await prisma.booking.findFirst({
    where: { id, teacherProfileId: teacherProfile.id, status: "paid" },
    include: { student: { select: { name: true } } },
  });
  if (!booking) notFound();

  const amount = Number(booking.amount);
  const fee = Number(booking.platformFeeAmount);
  const net = amount - fee;

  return (
    <div className="mx-auto max-w-lg">
      <div className="print:hidden mb-4 flex items-center justify-between">
        <Link href="/panel/pagos" className="text-sm text-teal-600 hover:underline">
          ← Volver a Cobros
        </Link>
        <PrintButton />
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm print:border-0 print:shadow-none">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <p className="text-lg font-bold text-stone-900">TuProfesorParticular</p>
          <p className="text-xs text-stone-400">
            Recibo interno · {booking.id.slice(-8).toUpperCase()}
          </p>
        </div>

        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Este documento es un justificante interno de la plataforma, no una
          factura fiscal. TuProfesorParticular actúa como intermediario y no
          es el prestador del servicio educativo o profesional.
        </p>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone-500">Fecha del pago</dt>
            <dd className="font-medium text-stone-900">
              {new Intl.DateTimeFormat("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }).format(booking.createdAt)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">Concepto</dt>
            <dd className="font-medium text-stone-900">Primera clase</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">Profesional</dt>
            <dd className="font-medium text-stone-900">{teacherProfile.user.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">Alumno</dt>
            <dd className="font-medium text-stone-900">{booking.student.name}</dd>
          </div>
        </dl>

        <div className="mt-6 space-y-2 border-t border-stone-100 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone-500">Importe cobrado al alumno</dt>
            <dd className="text-stone-900">{amount.toFixed(2)}€</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">
              Comisión de la plataforma ({PLATFORM_FEE_PERCENT}%)
            </dt>
            <dd className="text-stone-900">-{fee.toFixed(2)}€</dd>
          </div>
          <div className="flex justify-between border-t border-stone-100 pt-2 text-base font-bold">
            <dt className="text-stone-900">Neto recibido</dt>
            <dd className="text-stone-900">{net.toFixed(2)}€</dd>
          </div>
        </div>
      </div>
    </div>
  );
}
