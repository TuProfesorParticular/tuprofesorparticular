import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { logout } from "@/app/actions";
import { prisma } from "@/lib/prisma";
import { VERTICAL_THEME, VERTICALS, DEFAULT_VERTICAL } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/tu-cv", icon: "📤", label: "Enviar CV" },
  { href: "/tu-cv#pendientes", icon: "⏳", label: "Envíos pendientes" },
  { href: "/tu-cv#historial", icon: "✅", label: "Historial" },
];

export default async function TuCvLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const isTeacher = session?.user.role === "teacher";

  if (!isTeacher) {
    return <main className="mx-auto max-w-5xl px-4 py-12">{children}</main>;
  }

  const [totalSent, totalContacted, totalPending, teacherProfile] = await Promise.all([
    prisma.cvCampaign.count({ where: { userId: session!.user.id, status: "sent" } }),
    prisma.cvCampaign.aggregate({
      where: { userId: session!.user.id, status: "sent" },
      _sum: { sentCount: true },
    }),
    prisma.cvCampaign.count({
      where: { userId: session!.user.id, status: "paid" },
    }),
    prisma.teacherProfile.findUnique({
      where: { userId: session!.user.id },
      select: { vertical: true },
    }),
  ]);
  const vertical = teacherProfile?.vertical ?? DEFAULT_VERTICAL;
  const theme = VERTICAL_THEME[vertical];
  const verticalIcon = VERTICALS.find((v) => v.slug === vertical)?.icon ?? "🎓";

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-start">
      <aside className="flex-shrink-0 sm:sticky sm:top-20 sm:w-56">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <Link
            href="/panel"
            className={`flex items-center gap-1.5 px-2 text-xs font-medium hover:underline ${theme.accentText}`}
          >
            ← Volver a mi panel
          </Link>

          <div className="mt-3 flex items-center gap-2 px-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white ${theme.ctaGradient}`}
            >
              {verticalIcon}
            </span>
            <p className="text-sm font-bold text-stone-900">Tu CV</p>
          </div>

          <nav className="mt-4 flex flex-row gap-1 overflow-x-auto sm:flex-col sm:overflow-visible">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition ${theme.navHover}`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-stone-100 pt-4">
            <p className="truncate px-2 text-xs text-stone-500">{session!.user.email}</p>
            <form action={logout} className="mt-2">
              <button
                type="submit"
                className="w-full rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-lg">
              📨
            </span>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-stone-400">
              Total enviados
            </p>
            <p className="text-xl font-bold text-stone-900">{totalSent}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-lg">
              🏫
            </span>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-stone-400">
              Centros contactados
            </p>
            <p className="text-xl font-bold text-stone-900">
              {totalContacted._sum.sentCount ?? 0}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-lg">
              ⏳
            </span>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-stone-400">
              Pendientes de configurar
            </p>
            <p className="text-xl font-bold text-stone-900">{totalPending}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-lg">
              💼
            </span>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-stone-400">
              Nueva campaña
            </p>
            <Link href="/tu-cv" className={`text-sm font-semibold hover:underline ${theme.accentText}`}>
              Enviar CV →
            </Link>
          </div>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
