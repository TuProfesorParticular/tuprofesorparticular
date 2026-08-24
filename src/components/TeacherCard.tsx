import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { MODALITY_LABELS } from "@/lib/constants";

export type TeacherCardData = Prisma.TeacherProfileGetPayload<{
  include: {
    user: { select: { name: true; avatarUrl: true } };
    subjects: { include: { subject: true } };
    reviews: { select: { rating: true } };
  };
}>;

// Paleta de respaldo cuando el profesor no tiene foto: sigue pareciendo una
// tarjeta con imagen (degradado + inicial grande) en vez de un hueco vacío.
const FALLBACK_GRADIENTS = [
  "from-teal-200 to-teal-50 text-teal-400",
  "from-orange-200 to-orange-50 text-orange-400",
  "from-violet-200 to-violet-50 text-violet-400",
  "from-sky-200 to-sky-50 text-sky-400",
  "from-rose-200 to-rose-50 text-rose-400",
];

function fallbackGradient(name: string) {
  const sum = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return FALLBACK_GRADIENTS[sum % FALLBACK_GRADIENTS.length];
}

export default function TeacherCard({ teacher }: { teacher: TeacherCardData }) {
  const subjectNames = [...new Set(teacher.subjects.map((s) => s.subject.name))];
  const averageRating =
    teacher.reviews.length > 0
      ? teacher.reviews.reduce((sum, r) => sum + r.rating, 0) / teacher.reviews.length
      : null;

  return (
    <Link
      href={`/profesores/${teacher.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
        {teacher.user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={teacher.user.avatarUrl}
            alt={teacher.user.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br text-7xl font-bold ${fallbackGradient(teacher.user.name)}`}
          >
            {teacher.user.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-3 pb-2.5 pt-10">
          <p className="truncate text-base font-bold text-white">
            {teacher.user.name}
          </p>
          <p className="truncate text-xs text-white/85">
            {teacher.city ? `${teacher.city} · ` : ""}
            {MODALITY_LABELS[teacher.modality]}
          </p>
        </div>

        {teacher.plan !== "free" && (
          <span className="absolute right-2 top-2 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-950 shadow">
            Destacado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {averageRating !== null && (
          <p className="flex items-center gap-1 text-sm">
            <span className="text-amber-400">★</span>
            <span className="font-semibold text-stone-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-stone-400">
              ({teacher.reviews.length})
            </span>
          </p>
        )}

        <p className="line-clamp-2 text-sm text-stone-600">
          {subjectNames[0] && (
            <span className="font-semibold text-stone-900">
              {subjectNames[0]}
              {teacher.bio ? " · " : ""}
            </span>
          )}
          {teacher.bio}
        </p>

        <div className="mt-auto flex items-center justify-between pt-1.5">
          <span className="text-lg font-bold text-stone-900">
            {Number(teacher.pricePerHour)}€
            <span className="text-sm font-normal text-stone-400">/h</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
