import type { Metadata } from "next";
import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getSuggestionsForUser } from "@/lib/suggestions";
import { VERTICAL_THEME, DEFAULT_VERTICAL } from "@/lib/constants";
import SuggestionForm from "./SuggestionForm";

export const metadata: Metadata = {
  title: "Sugerencias · TuProfesorParticular",
};

const CATEGORY_LABELS = {
  error: "🐞 Error",
  mejora: "💡 Mejora",
  otro: "📝 Otro",
};

const STATUS_LABELS = {
  open: "Pendiente de revisar",
  reviewed: "Revisada",
  closed: "Cerrada",
};

const STATUS_STYLES = {
  open: "bg-amber-50 text-amber-700",
  reviewed: "bg-sky-50 text-sky-700",
  closed: "bg-stone-100 text-stone-500",
};

export default async function SugerenciasPage() {
  const session = await requireSession();
  const isTeacher = session.user.role === "teacher";

  const teacherProfile = isTeacher
    ? await prisma.teacherProfile.findUnique({
        where: { userId: session.user.id },
        select: { vertical: true },
      })
    : null;
  const theme = VERTICAL_THEME[teacherProfile?.vertical ?? DEFAULT_VERTICAL];

  const mySuggestions = await getSuggestionsForUser(session.user.id);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-900">Sugerencias</h1>
      <p className="mt-1 text-sm text-stone-500">
        ¿Has encontrado algo que no funciona bien, o se te ocurre cómo
        mejorar la plataforma? Cuéntanoslo aquí — nos llega directamente a
        nosotros para revisarlo.
      </p>

      <div className="mt-6">
        <SuggestionForm ctaClass={theme.ctaGradient} />
      </div>

      {mySuggestions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-stone-900">
            Lo que has enviado antes
          </h2>
          <ul className="mt-3 space-y-2">
            {mySuggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-stone-500">
                    {CATEGORY_LABELS[suggestion.category]}
                    {" · "}
                    {suggestion.createdAt.toLocaleDateString("es-ES")}
                  </p>
                  <span
                    className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[suggestion.status]}`}
                  >
                    {STATUS_LABELS[suggestion.status]}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-stone-800">
                  {suggestion.message}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
