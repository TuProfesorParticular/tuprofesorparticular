import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTeacherProfileById } from "@/lib/teachers";
import { LEVEL_LABELS, MODALITY_LABELS } from "@/lib/constants";
import { PLATFORM_FEE_PERCENT } from "@/lib/plans";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startConversation } from "@/app/panel/mensajes/actions";
import { bookFirstClass } from "./booking-actions";
import { getReviewsForTeacher } from "@/lib/reviews";
import ReviewForm from "./ReviewForm";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reserva?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const teacher = await getTeacherProfileById(id);

  return {
    title: teacher
      ? `${teacher.user.name} · TuProfesorParticular`
      : "Profesor no encontrado",
  };
}

const RESERVA_MESSAGES: Record<string, { text: string; tone: string }> = {
  exito: {
    text: "¡Reserva pagada! El profesor recibirá tu contacto para acordar el horario.",
    tone: "bg-emerald-50 text-emerald-700",
  },
  cancelada: {
    text: "Has cancelado el pago. Puedes intentarlo de nuevo cuando quieras.",
    tone: "bg-amber-50 text-amber-700",
  },
  "ya-existe": {
    text: "Ya tienes una primera clase reservada y pagada con este profesor.",
    tone: "bg-teal-50 text-teal-700",
  },
};

export default async function TeacherProfilePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { reserva } = await searchParams;
  const [teacher, session] = await Promise.all([
    getTeacherProfileById(id),
    auth(),
  ]);

  if (!teacher || teacher.status !== "approved") {
    notFound();
  }

  const isOwnProfile = session?.user?.id === teacher.userId;

  const [existingBooking, { reviews, average, count }] = await Promise.all([
    session?.user && !isOwnProfile
      ? prisma.booking.findUnique({
          where: {
            studentId_teacherProfileId: {
              studentId: session.user.id,
              teacherProfileId: teacher.id,
            },
          },
        })
      : Promise.resolve(null),
    getReviewsForTeacher(teacher.id),
  ]);

  const myReview =
    session?.user && !isOwnProfile
      ? reviews.find((r) => r.studentId === session.user.id)
      : undefined;
  const canReview = existingBooking?.status === "paid";

  const levelsBySubject = new Map<string, string[]>();
  for (const teacherSubject of teacher.subjects) {
    const levels = levelsBySubject.get(teacherSubject.subject.name) ?? [];
    if (teacherSubject.level) {
      levels.push(LEVEL_LABELS[teacherSubject.level]);
    }
    levelsBySubject.set(teacherSubject.subject.name, levels);
  }

  const reservaMessage = reserva ? RESERVA_MESSAGES[reserva] : undefined;
  const canAcceptBookings = teacher.stripeConnectOnboarded;
  const alreadyBooked = existingBooking?.status === "paid";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm text-teal-600 hover:underline">
        ← Volver a la búsqueda
      </Link>

      {reservaMessage && (
        <p className={`mt-4 rounded-lg px-4 py-3 text-sm ${reservaMessage.tone}`}>
          {reservaMessage.text}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start">
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-stone-100 text-2xl font-semibold text-stone-500">
          {teacher.user.name.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-stone-900">
            {teacher.user.name}
          </h1>
          <p className="text-stone-500">
            {teacher.city ? `${teacher.city} · ` : ""}
            {MODALITY_LABELS[teacher.modality]}
          </p>
          {average !== null && (
            <p className="mt-1 flex items-center gap-1 text-sm text-stone-600">
              <span className="text-amber-400">★</span>
              <span className="font-medium">{average.toFixed(1)}</span>
              <span className="text-stone-400">
                ({count} {count === 1 ? "valoración" : "valoraciones"})
              </span>
            </p>
          )}

          <p className="mt-4 text-stone-700">
            {teacher.bio || "Este profesor todavía no ha añadido una presentación."}
          </p>

          {levelsBySubject.size > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {[...levelsBySubject.entries()].map(([subject, levels]) => (
                <span
                  key={subject}
                  className="rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700"
                >
                  {subject}
                  {levels.length > 0 && ` · ${levels.join(", ")}`}
                </span>
              ))}
            </div>
          )}

          {teacher.experienceText && (
            <div className="mt-5">
              <h2 className="text-sm font-semibold text-stone-900">
                Titulación y experiencia
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                {teacher.experienceText}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-shrink-0 flex-col items-center gap-3 rounded-lg border border-stone-100 p-4 sm:items-end">
          <p className="text-2xl font-bold text-stone-900">
            {Number(teacher.pricePerHour)}€
            <span className="text-sm font-normal text-stone-400">/hora</span>
          </p>
          {session?.user ? (
            isOwnProfile ? (
              <p className="text-center text-xs text-stone-400 sm:text-right">
                Este es tu propio anuncio.
              </p>
            ) : (
              <>
                <form action={startConversation} className="w-full sm:w-auto">
                  <input type="hidden" name="teacherProfileId" value={teacher.id} />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-teal-600 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-teal-700 sm:w-auto"
                  >
                    Contactar
                  </button>
                </form>

                {canAcceptBookings && (
                  <>
                    {alreadyBooked ? (
                      <span className="rounded-lg bg-emerald-50 px-4 py-2 text-center text-xs font-medium text-emerald-700 sm:w-auto">
                        Primera clase ya reservada
                      </span>
                    ) : (
                      <form action={bookFirstClass} className="w-full sm:w-auto">
                        <input type="hidden" name="teacherProfileId" value={teacher.id} />
                        <button
                          type="submit"
                          className="w-full rounded-lg border border-teal-600 px-5 py-2.5 text-center text-sm font-semibold text-teal-700 hover:bg-teal-50 sm:w-auto"
                        >
                          Reservar primera clase
                        </button>
                        <p className="mt-1 text-center text-[11px] text-stone-400 sm:text-right">
                          Pago seguro con Stripe. La plataforma retiene un{" "}
                          {PLATFORM_FEE_PERCENT}% de gestión.
                        </p>
                      </form>
                    )}
                  </>
                )}
              </>
            )
          ) : (
            <>
              <Link
                href={`/iniciar-sesion`}
                className="w-full rounded-lg bg-teal-600 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-teal-700 sm:w-auto"
              >
                Contactar
              </Link>
              <p className="text-center text-xs text-stone-400 sm:text-right">
                Necesitas una cuenta para contactar con el profesor.
              </p>
            </>
          )}
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900">
          Valoraciones {count > 0 && `(${count})`}
        </h2>

        {canReview && !isOwnProfile && (
          <div className="mt-4">
            <ReviewForm
              teacherProfileId={teacher.id}
              existingRating={myReview?.rating}
              existingComment={myReview?.comment}
            />
          </div>
        )}

        <ul className="mt-4 space-y-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-xl border border-stone-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-stone-900">{review.student.name}</p>
                <span className="text-amber-400">
                  {"★".repeat(review.rating)}
                  <span className="text-stone-200">
                    {"★".repeat(5 - review.rating)}
                  </span>
                </span>
              </div>
              {review.comment && (
                <p className="mt-1 text-sm text-stone-600">{review.comment}</p>
              )}
            </li>
          ))}
          {reviews.length === 0 && (
            <p className="rounded-lg border border-dashed border-stone-300 p-6 text-center text-sm text-stone-400">
              Este profesor todavía no tiene valoraciones.
            </p>
          )}
        </ul>
      </section>

      {session?.user && !isOwnProfile && (
        <p className="mt-6 text-center text-xs text-stone-400">
          ¿Algún problema con este profesor?{" "}
          <Link
            href={`/canal-etico?profesor=${teacher.id}`}
            className="text-stone-500 underline hover:text-stone-700"
          >
            Repórtalo de forma confidencial
          </Link>
        </p>
      )}
    </main>
  );
}
