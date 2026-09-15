import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CV_NATIONWIDE_PRICE, CV_REGION_PRICE, REGION_LABELS, REGION_ORDER } from "@/lib/regions";
import { INSTITUTION_COPY } from "@/lib/institutions";
import { VERTICAL_THEME } from "@/lib/constants";
import type { Vertical } from "@prisma/client";
import EnviosHistorial from "./EnviosHistorial";
import EnviosPendientes from "./EnviosPendientes";

export const metadata: Metadata = {
  title: "Tu CV · TuProfesorParticular",
  description:
    "Envía tu CV a colegios, gimnasios/clubes o clínicas y gabinetes por provincia, por comunidad o a toda España, en un solo pago.",
};

export default async function TuCvPage({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string }>;
}) {
  const { enviado } = await searchParams;
  const session = await auth();
  const isTeacher = session?.user.role === "teacher";

  const teacherProfile = isTeacher
    ? await prisma.teacherProfile.findUnique({
        where: { userId: session!.user.id },
        select: { vertical: true },
      })
    : null;
  const vertical: Vertical = teacherProfile?.vertical ?? "educacion";
  const copy = INSTITUTION_COPY[vertical];
  const theme = VERTICAL_THEME[vertical];

  const [counts, campaigns] = await Promise.all([
    prisma.institutionContact.groupBy({
      by: ["region"],
      where: { vertical, active: true, unsubscribed: false },
      _count: { _all: true },
    }),
    isTeacher
      ? prisma.cvCampaign.findMany({
          where: { userId: session!.user.id },
          orderBy: { createdAt: "desc" },
          take: 50,
        })
      : Promise.resolve([]),
  ]);

  const countByRegion = new Map(counts.map((c) => [c.region, c._count._all]));
  const totalCount = counts.reduce((sum, c) => sum + c._count._all, 0);

  // Pagado pero sin CV subido ni envío confirmado todavía: el profesional
  // tiene que entrar a completarlo antes de que se envíe.
  const pendingCampaigns = campaigns.filter((c) => c.status === "paid");
  // El resto va al historial. "pending" normalmente es un checkout de
  // Stripe abandonado, pero lo dejamos visible (no lo ocultamos del todo)
  // por si algún pago sí se completó y el webhook de Stripe no llegó a
  // confirmarlo — así no desaparece un cobro real sin que se note.
  const otherCampaigns = campaigns.filter((c) => c.status !== "paid");

  return (
    <>
      <div className="text-center">
        <p className={`mx-auto mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${theme.badge}`}>
          {copy.heroKicker}
        </p>
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">{copy.heroTitle}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-stone-500">
          {copy.heroDescription} Elige tu comunidad (o toda España), paga una
          vez, y después decides desde tu panel a qué {copy.pluralLower}{" "}
          concretos lo enviamos.
        </p>
      </div>

      {enviado && (
        <div className="mx-auto mt-6 flex max-w-2xl items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <span className="text-2xl">✅</span>
          <p className="text-sm font-medium text-emerald-800">
            ¡Envío en marcha! Revisa el resultado en el historial de aquí
            abajo en unos segundos.
          </p>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REGION_ORDER.map((region) => {
          const count = countByRegion.get(region) ?? 0;
          const available = count > 0;
          return (
            <div
              key={region}
              className={`rounded-2xl border p-5 ${
                available
                  ? "border-stone-200 bg-white"
                  : "border-stone-100 bg-stone-50 opacity-60"
              }`}
            >
              <p className={`text-xs font-semibold uppercase tracking-wide ${theme.accentText}`}>
                Elige comunidad
              </p>
              <h2 className="mt-1 text-lg font-semibold text-stone-900">
                {REGION_LABELS[region]}
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                {available
                  ? `Envía tu CV a ${count}+ centros en ${REGION_LABELS[region]}.`
                  : "Próximamente."}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-stone-500">
                  {CV_REGION_PRICE.toFixed(2)}€
                </span>
                {available ? (
                  <Link
                    href={`/tu-cv/comprar?region=${region}`}
                    className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${theme.button}`}
                  >
                    Elegir
                  </Link>
                ) : (
                  <span className="rounded-full bg-stone-200 px-4 py-2 text-sm font-medium text-stone-500">
                    No disponible
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`mt-8 rounded-2xl border p-6 sm:flex sm:items-center sm:justify-between ${theme.badge}`}>
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wide ${theme.accentText}`}>
            Cobertura completa
          </p>
          <h2 className="mt-1 text-xl font-bold text-stone-900">
            Enviar CV a toda España
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            {totalCount > 0
              ? `Envía tu CV a ${totalCount}+ centros en toda España.`
              : "Próximamente."}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-4 sm:mt-0">
          <span className="text-2xl font-bold text-stone-900">
            {CV_NATIONWIDE_PRICE.toFixed(2)}€
          </span>
          {totalCount > 0 ? (
            <Link
              href="/tu-cv/comprar?region=nationwide"
              className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white ${theme.button}`}
            >
              Elegir
            </Link>
          ) : (
            <span className="rounded-full bg-stone-200 px-5 py-2.5 text-sm font-medium text-stone-500">
              No disponible
            </span>
          )}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-stone-900">{totalCount}+</p>
          <p className="text-sm text-stone-500">Centros disponibles</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-stone-900">1 clic</p>
          <p className="text-sm text-stone-500">Sube tu CV una vez</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-stone-900">Directo</p>
          <p className="text-sm text-stone-500">
            {copy.pluralLower[0].toUpperCase()}
            {copy.pluralLower.slice(1)} te contactan a ti
          </p>
        </div>
      </div>

      {!isTeacher && (
        <p className="mt-8 text-center text-xs text-stone-400">
          Necesitas tener una cuenta de profesional en TuProfesorParticular
          para contratar el envío. Si no tienes cuenta,{" "}
          <Link href="/registro" className={`${theme.accentText} hover:underline`}>
            regístrate aquí
          </Link>
          .
        </p>
      )}

      {isTeacher && pendingCampaigns.length > 0 && (
        <div id="pendientes" className="mt-14 scroll-mt-24">
          <h2 className="text-xl font-bold text-stone-900">
            Envíos pendientes de configurar
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Ya has pagado — ahora elige a qué provincias lo enviamos.
          </p>
          <EnviosPendientes campaigns={pendingCampaigns} />
        </div>
      )}

      {isTeacher && (
        <div id="historial" className="mt-14 scroll-mt-24">
          <h2 className="text-xl font-bold text-stone-900">Historial</h2>
          <p className="mt-1 text-sm text-stone-500">
            Todos tus envíos de CV, pendientes de pago y completados.
          </p>
          <EnviosHistorial campaigns={otherCampaigns} />
        </div>
      )}
    </>
  );
}
