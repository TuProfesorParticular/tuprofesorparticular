import { getFeaturedReviews } from "@/lib/reviews";

export default async function Testimonials() {
  const reviews = await getFeaturedReviews();

  if (reviews.length === 0) return null;

  const AVATAR_COLORS = [
    "bg-teal-100 text-teal-700",
    "bg-orange-100 text-orange-700",
    "bg-violet-100 text-violet-700",
    "bg-rose-100 text-rose-700",
  ];

  return (
    <section className="mt-20">
      <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
        Lo que dicen nuestros alumnos
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <figure
            key={review.id}
            className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="text-amber-400">
              {"★".repeat(review.rating)}
              <span className="text-stone-200">{"★".repeat(5 - review.rating)}</span>
            </span>
            <blockquote className="mt-3 text-sm text-stone-700">
              “{review.comment}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
              >
                {review.student.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-xs text-stone-500">
                <span className="font-medium text-stone-700">{review.student.name}</span>
                <br />
                clase con {review.teacherProfile.user.name}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
