import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { REFERRAL_REWARD_DAYS } from "@/lib/plans";
import { VERTICAL_THEME } from "@/lib/constants";
import CopyLinkButton from "./CopyLinkButton";

export const metadata: Metadata = {
  title: "Invita y gana · TuProfesorParticular",
};

const APP_URL = process.env.APP_URL || "http://localhost:3000";

const STATUS_LABELS = {
  pending: "Pendiente de aprobación",
  approved: "Aprobado",
  rejected: "Rechazado",
};

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-stone-100 text-stone-500",
};

export default async function ReferidosPage() {
  const session = await requireRole("teacher");

  const teacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { userId: session.user.id },
  });
  const theme = VERTICAL_THEME[teacherProfile.vertical];

  const referrals = await prisma.user.findMany({
    where: { referredById: session.user.id, role: "teacher" },
    include: { teacherProfile: { select: { status: true, referralRewardGranted: true } } },
    orderBy: { createdAt: "desc" },
  });

  const referralLink = `${APP_URL}/registro?ref=${session.user.id}`;
  const rewardedCount = referrals.filter((r) => r.teacherProfile?.referralRewardGranted).length;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-900">Invita y gana</h1>
      <p className="mt-1 text-sm text-stone-500">
        Invita a otros profesores a TuProfesorParticular. Por cada uno que se
        registre con tu enlace y su anuncio sea aprobado, te regalamos{" "}
        {REFERRAL_REWARD_DAYS} días de Pro gratis.
      </p>

      <div className={`mt-6 rounded-2xl p-6 text-white shadow-md ${theme.ctaGradient}`}>
        <p className="text-xs font-medium uppercase tracking-wide text-white/80">
          Tu enlace de invitación
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            readOnly
            value={referralLink}
            onFocus={(e) => e.target.select()}
            className="min-w-0 flex-1 rounded-lg bg-white/20 px-3 py-2 text-sm text-white placeholder-white/70 focus:outline-none"
          />
          <CopyLinkButton link={referralLink} />
        </div>
        {rewardedCount > 0 && (
          <p className="mt-3 text-sm text-white/90">
            Ya has ganado {rewardedCount * REFERRAL_REWARD_DAYS} días de Pro gratis
            gracias a tus invitaciones 🎉
          </p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900">
          Profesores invitados ({referrals.length})
        </h2>
        {referrals.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-stone-300 p-6 text-center text-sm text-stone-400">
            Todavía no has invitado a ningún profesor.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {referrals.map((referral) => {
              const status = referral.teacherProfile?.status ?? "pending";
              return (
                <li
                  key={referral.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white px-4 py-3"
                >
                  <p className="text-sm font-medium text-stone-900">{referral.name}</p>
                  <span
                    className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
                  >
                    {STATUS_LABELS[status]}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
