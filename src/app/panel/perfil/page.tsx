import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getAllSubjects } from "@/lib/teachers";
import { syncFounderExpiry } from "@/lib/founders";
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
      include: { subjects: true, availability: true },
    }),
    getAllSubjects(),
  ]);
  await syncFounderExpiry(rawTeacherProfile);
  const teacherProfile = rawTeacherProfile;

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
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Mi anuncio</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[teacherProfile.status]}`}
        >
          {STATUS_LABELS[teacherProfile.status]}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-4 text-sm">
        <Link href="/panel/mensajes" className="text-teal-600 hover:underline">
          Mensajes
        </Link>
        <Link href="/panel/materiales" className="text-teal-600 hover:underline">
          Mis materiales
        </Link>
        <Link href="/panel/suscripcion" className="text-teal-600 hover:underline">
          Mi suscripción
        </Link>
        <Link href="/panel/pagos" className="text-teal-600 hover:underline">
          Cobros
        </Link>
        <Link href="/panel/alumnos" className="text-teal-600 hover:underline">
          Alumnos buscan profesor
        </Link>
      </div>
      <p className="mt-1 text-sm text-stone-500">
        Este es tu perfil público. {teacherProfile.status === "pending" && "Un administrador debe aprobarlo antes de que aparezca en las búsquedas."}
        {teacherProfile.status === "approved" && (
          <>
            {" "}
            <Link href={`/profesores/${teacherProfile.id}`} className="text-teal-600 hover:underline">
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
        allSubjects={allSubjects}
        selectedSubjectIds={selectedSubjectIds}
        selectedLevels={selectedLevels}
        selectedSlots={selectedSlots}
      />
    </main>
  );
}
