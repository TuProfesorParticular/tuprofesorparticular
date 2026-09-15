import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VERTICALS } from "@/lib/constants";
import { FOUNDER_LIMIT, FOUNDER_TRIAL_MONTHS, FOUNDER_PRICES, REFERRAL_REWARD_DAYS } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Da clases o consulta y consigue alumnos · TuProfesorParticular",
  description:
    "Publica tu anuncio gratis como profesor particular, entrenador o profesional de la salud mental. Cobra tu primera clase de forma segura y consigue alumnos nuevos cada semana.",
};

const STEPS = [
  {
    title: "Crea tu cuenta y publica tu anuncio",
    description:
      "Cuéntanos qué enseñas, tu experiencia y tu precio por hora. Es gratis y tarda menos de 5 minutos.",
  },
  {
    title: "Un administrador revisa tu perfil",
    description:
      "Comprobamos que el anuncio esté completo antes de publicarlo en las búsquedas, para mantener la calidad de la plataforma.",
  },
  {
    title: "Recibe alumnos y cobra tu primera clase segura",
    description:
      "Los alumnos te contactan y pagan la primera clase a través de Stripe. Las siguientes las acordáis directamente, sin comisión.",
  },
];

export default async function ParaProfesoresPage() {
  const [teacherCount, studentCount, founderCounts] = await Promise.all([
    prisma.user.count({ where: { role: "teacher" } }),
    prisma.user.count({ where: { role: "student" } }),
    prisma.teacherProfile.groupBy({
      by: ["vertical"],
      where: { isFounder: true },
      _count: true,
    }),
  ]);

  const founderCountByVertical = new Map(
    founderCounts.map((f) => [f.vertical, f._count]),
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <p className="mx-auto mb-3 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
          PARA PROFESIONALES
        </p>
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          Da clases, entrena o atiende consulta.
          <br />
          Nosotros te traemos los alumnos.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-stone-500">
          Profesores particulares, entrenadores personales y profesionales de
          la salud mental publican su anuncio gratis y consiguen alumnos
          nuevos cada semana.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/registro?role=teacher"
            className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:from-teal-700 hover:to-emerald-600 hover:shadow-lg"
          >
            Publicar mi anuncio gratis
          </Link>
          <Link
            href="/iniciar-sesion"
            className="text-sm font-medium text-stone-500 hover:text-stone-700"
          >
            Ya tengo cuenta →
          </Link>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-stone-900">{teacherCount}</p>
          <p className="text-xs text-stone-500">Profesionales registrados</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-stone-900">{studentCount}</p>
          <p className="text-xs text-stone-500">Alumnos buscando</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-stone-900">0€</p>
          <p className="text-xs text-stone-500">Coste para publicarte</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-stone-900">20%</p>
          <p className="text-xs text-stone-500">Comisión solo la 1ª clase</p>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="text-center text-2xl font-bold text-stone-900">
          Cómo funciona
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="rounded-2xl border border-stone-200 bg-white p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="mt-3 font-semibold text-stone-900">{step.title}</p>
              <p className="mt-1 text-sm text-stone-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 p-6 text-white sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
          Programa de fundadores
        </p>
        <h2 className="mt-1 text-xl font-bold sm:text-2xl">
          Los primeros {FOUNDER_LIMIT} de cada categoría, Pro gratis {FOUNDER_TRIAL_MONTHS} meses
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-white/90">
          Educación, Deporte y Salud Mental tienen su propio cupo de{" "}
          {FOUNDER_LIMIT} plazas. Pasado ese tiempo, tu precio queda fijado
          para siempre en {FOUNDER_PRICES.pro}€/mes (Pro) o{" "}
          {FOUNDER_PRICES.premium}€/mes (Premium), en vez del precio
          estándar.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {VERTICALS.map((v) => {
            const taken = founderCountByVertical.get(v.slug) ?? 0;
            const left = Math.max(0, FOUNDER_LIMIT - taken);
            return (
              <span
                key={v.slug}
                className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium"
              >
                {v.icon} {v.label}: {left} plazas libres
              </span>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          Programa de referidos
        </p>
        <h2 className="mt-1 text-xl font-bold text-stone-900 sm:text-2xl">
          Invita a otro profesional y gana {REFERRAL_REWARD_DAYS} días de Pro gratis
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-stone-500">
          En cuanto te registres, tendrás tu propio enlace de invitación en
          &ldquo;Invita y gana&rdquo;. Cada vez que alguien se registre con tu
          enlace y su anuncio sea aprobado, te regalamos {REFERRAL_REWARD_DAYS}{" "}
          días de Pro gratis — sin límite de invitaciones.
        </p>
      </section>

      <section className="mt-14 text-center">
        <h2 className="text-2xl font-bold text-stone-900">
          Educación, deporte y salud mental
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-stone-500">
          Da igual tu especialidad: aquí tienen sitio profesores particulares,
          preparadores de oposiciones, entrenadores personales, profesores de
          yoga, psicólogos, logopedas y muchos más.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {VERTICALS.map((v) => (
            <span
              key={v.slug}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700"
            >
              {v.icon} {v.label}
            </span>
          ))}
        </div>
      </section>

      <div className="mt-14 rounded-2xl bg-stone-900 p-8 text-center text-white">
        <h2 className="text-xl font-bold sm:text-2xl">
          Tu próximo alumno puede estar buscándote ahora mismo
        </h2>
        <Link
          href="/registro?role=teacher"
          className="mt-4 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-stone-900 shadow-md transition hover:shadow-lg"
        >
          Publicar mi anuncio gratis
        </Link>
      </div>
    </main>
  );
}
