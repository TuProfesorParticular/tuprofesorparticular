import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getAllSubjects } from "@/lib/teachers";
import { syncFounderExpiry } from "@/lib/founders";
import { isInFounderFreeTrial, FOUNDER_PRICES, MATERIAL_DISCOUNT_PER_UPLOAD } from "@/lib/plans";
import { VERTICAL_THEME } from "@/lib/constants";
import EditProfileForm from "./EditProfileForm";

export const metadata: Metadata = {
  title: "Mi anuncio · TuProfesorParticular",
};

const STATUS_LABELS = {
  pending: "Pendiente de aprobación",
  approved: "Publicado",
  rejected: "Rechazado",
};

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

export default async function EditarPerfilPage() {
  const session = await requireRole("teacher");

  const [rawTeacherProfile, allSubjects] = await Promise.all([
    prisma.teacherProfile.findUniqueOrThrow({
      where: { userId: session.user.id },
      include: {
        subjects: true,
        availability: true,
        user: { select: { avatarUrl: true } },
      },
    }),
    getAllSubjects(),
  ]);
  const synced = await syncFounderExpiry(rawTeacherProfile);
  const teacherProfile = { ...rawTeacherProfile, ...synced };
  const theme = VERTICAL_THEME[teacherProfile.vertical];

  const inFreeTrial = isInFounderFreeTrial(teacherProfile);
  // Componente de servidor (sin "use client"): se ejecuta una sola vez por
  // petición, no en re-renders del cliente, así que la regla de pureza de
  // react-hooks no aplica aquí de verdad — necesitamos la hora actual para
  // calcular los días restantes del trial.
  // eslint-disable-next-line react-hooks/purity -- server component, se evalúa una vez por request
  const now = Date.now();
  const daysLeft = teacherProfile.founderProUntil
    ? Math.max(
        0,
        Math.ceil((teacherProfile.founderProUntil.getTime() - now) / (1000 * 60 * 60 * 24)),
      )
    : null;

  const selectedSubjectIds = [
    ...new Set(teacherProfile.subjects.map((s) => s.subjectId)),
  ];
  const selectedLevels = [
    ...new Set(
      teacherProfile.subjects
        .map((s) => s.level)
        .filter((level): level is NonNullable<typeof level> => level !== null),
    ),
  ];
  const selectedSlots = teacherProfile.availability.map(
    (slot) => `${slot.weekday}-${slot.hour}`,
  );

  return (
    <div className="mx-auto max-w-2xl">
      {teacherProfile.plan === "free" && (
        <Link
          href="/panel/suscripcion"
          className={`mb-6 flex items-center justify-between gap-4 rounded-xl px-5 py-4 text-white shadow-sm transition ${theme.ctaGradient}`}
        >
          <p className="text-sm font-medium">
            🚀 Hazte Pro y consigue más alumnos: destacado en búsquedas,
            materiales ilimitados y contacto directo con alumnos que buscan
            profesor.
          </p>
          <span className={`flex-shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold ${theme.accentText}`}>
            Ver planes
          </span>
        </Link>
      )}

      {teacherProfile.plan === "pro" && inFreeTrial && daysLeft !== null && (
        <Link
          href="/panel/suscripcion"
          className="mb-6 flex items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-4 text-white shadow-sm transition hover:from-amber-600 hover:to-amber-500"
        >
          <p className="text-sm font-medium">
            🎉 Te quedan {daysLeft} {daysLeft === 1 ? "día" : "días"} de Pro
            gratis.{" "}
            {teacherProfile.isFounder
              ? `Sube a Premium ahora por ${FOUNDER_PRICES.premium}€/mes fijos para siempre.`
              : "Suscríbete antes de que acabe para no perder las ventajas de Pro."}
          </p>
          <span className="flex-shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-amber-700">
            Ver planes
          </span>
        </Link>
      )}

      {teacherProfile.plan !== "free" && !teacherProfile.isFounder && (
        <p className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          💡 Si pagas el precio normal de Pro o Premium, aportar al menos un
          material aprobado cada mes te rebaja {MATERIAL_DISCOUNT_PER_UPLOAD}€
          fijos ese mes — da igual si subes uno o varios. Se recalcula cada
          mes.{" "}
          <Link href="/panel/materiales" className="font-medium underline">
            Sube un material
          </Link>{" "}
          o mira el detalle en{" "}
          <Link href="/panel/suscripcion" className="font-medium underline">
            Mi suscripción
          </Link>
          .
        </p>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Mi anuncio</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[teacherProfile.status]}`}
        >
          {STATUS_LABELS[teacherProfile.status]}
        </span>
      </div>

      <p className="mt-2 text-sm text-stone-500">
        Este es tu perfil público. {teacherProfile.status === "pending" && "Un administrador debe aprobarlo antes de que aparezca en las búsquedas."}
        {teacherProfile.status === "approved" && (
          <>
            {" "}
            <Link href={`/profesores/${teacherProfile.id}`} className={`${theme.accentText} hover:underline`}>
              Ver mi anuncio público
            </Link>
          </>
        )}
      </p>

      <EditProfileForm
        teacherProfile={{
          ...teacherProfile,
          pricePerHour: Number(teacherProfile.pricePerHour),
        }}
        avatarUrl={teacherProfile.user.avatarUrl}
        allSubjects={allSubjects}
        selectedSubjectIds={selectedSubjectIds}
        selectedLevels={selectedLevels}
        selectedSlots={selectedSlots}
      />
    </div>
  );
}
