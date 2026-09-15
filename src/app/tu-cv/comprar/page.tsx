import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { CV_REGION_PRICE, CV_NATIONWIDE_PRICE, REGION_LABELS } from "@/lib/regions";
import { INSTITUTION_COPY } from "@/lib/institutions";
import { VERTICAL_THEME } from "@/lib/constants";
import type { SpanishRegion, Vertical } from "@prisma/client";
import { startCvCampaignCheckout } from "../actions";

export const metadata: Metadata = {
  title: "Tu CV · TuProfesorParticular",
};

function isSpanishRegion(value: string): value is SpanishRegion {
  return value in REGION_LABELS;
}

export default async function ComprarEnvioCvPage({
  searchParams,
}: {
  searchParams: Promise<{
    region?: string;
    exito?: string;
    cancelado?: string;
  }>;
}) {
  const session = await requireRole("teacher");
  const { region: regionRaw, exito, cancelado } = await searchParams;

  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId: session.user.id },
    select: { vertical: true },
  });
  const vertical: Vertical = teacherProfile?.vertical ?? "educacion";
  const copy = INSTITUTION_COPY[vertical];
  const theme = VERTICAL_THEME[vertical];

  if (exito) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-3xl">
          ✅
        </span>
        <h1 className="mt-4 text-2xl font-bold text-stone-900">¡Pago recibido!</h1>
        <p className="mt-3 text-stone-600">
          Ve a <span className="font-medium text-stone-800">Envíos pendientes</span> para
          subir tu CV y confirmar a qué {copy.pluralLower} lo enviamos.
        </p>
        <Link
          href="/tu-cv#pendientes"
          className={`mt-6 inline-block rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md ${theme.ctaGradient}`}
        >
          Ir a Tu CV
        </Link>
      </div>
    );
  }

  const nationwide = regionRaw === "nationwide";
  const region = !nationwide && regionRaw && isSpanishRegion(regionRaw) ? regionRaw : null;

  if (!nationwide && !region) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-stone-900">Comunidad no válida</h1>
        <Link href="/tu-cv" className={`mt-4 inline-block hover:underline ${theme.accentText}`}>
          ← Volver a elegir comunidad
        </Link>
      </div>
    );
  }

  const count = nationwide
    ? await prisma.institutionContact.count({
        where: { vertical, active: true, unsubscribed: false },
      })
    : await prisma.institutionContact.count({
        where: { vertical, region: region!, active: true, unsubscribed: false },
      });

  const amount = nationwide ? CV_NATIONWIDE_PRICE : CV_REGION_PRICE;
  const label = nationwide ? "toda España" : REGION_LABELS[region!];

  return (
    <div className="mx-auto max-w-lg">
      <Link href="/tu-cv" className={`text-sm hover:underline ${theme.accentText}`}>
        ← Cambiar comunidad
      </Link>

      <div className="mt-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl ${theme.badge}`}
          >
            {copy.icon}
          </span>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide ${theme.accentText}`}>
              Comprar acceso
            </p>
            <h1 className="text-xl font-bold text-stone-900">{label}</h1>
          </div>
        </div>

        <p className="mt-3 text-sm text-stone-500">
          Con este pago tienes derecho a los {count}+ {copy.pluralDescriptive}{" "}
          de {label}. Después de pagar, subes tu CV y eliges a qué{" "}
          {copy.pluralLower} concretos lo enviamos.
        </p>

        {cancelado && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
            Pago cancelado. Puedes intentarlo de nuevo cuando quieras.
          </p>
        )}

        <form action={startCvCampaignCheckout} className="mt-6">
          <input type="hidden" name="region" value={nationwide ? "nationwide" : region!} />

          <div className="flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3">
            <span className="text-sm font-medium text-stone-700">Total a pagar</span>
            <span className="text-xl font-bold text-stone-900">{amount.toFixed(2)}€</span>
          </div>

          <button
            type="submit"
            className={`mt-4 w-full rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg ${theme.ctaGradient}`}
          >
            Pagar
          </button>

          <p className="mt-3 text-center text-xs text-stone-400">
            Pago único, sin suscripción.
          </p>
        </form>
      </div>
    </div>
  );
}
