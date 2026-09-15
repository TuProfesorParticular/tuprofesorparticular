import type { Vertical } from "@prisma/client";
import { getFeaturedTeachers } from "@/lib/teachers";
import TeacherCard from "@/components/TeacherCard";

const TITLES: Record<Vertical, string> = {
  educacion: "Profesores destacados",
  deporte: "Entrenadores destacados",
  salud_mental: "Profesionales destacados",
};

export default async function FeaturedTeachers({ vertical }: { vertical: Vertical }) {
  const teachers = await getFeaturedTeachers(6, vertical);

  if (teachers.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-stone-900">{TITLES[vertical]}</h2>
      <p className="mt-1 text-sm text-stone-500">
        Los mejor valorados de la plataforma. La selección se renueva cada
        pocas horas.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {teachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
    </section>
  );
}
