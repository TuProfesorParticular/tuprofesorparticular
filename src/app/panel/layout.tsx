import type { ReactNode } from "react";
import Link from "next/link";
import { requireSession } from "@/lib/auth-helpers";
import { logout } from "@/app/actions";
import { prisma } from "@/lib/prisma";
import { VERTICAL_THEME, VERTICALS, DEFAULT_VERTICAL } from "@/lib/constants";
import type { Vertical } from "@prisma/client";

type NavItem = { href: string; icon: string; label: string };

const TEACHER_NAV: NavItem[] = [
  { href: "/panel/perfil", icon: "📝", label: "Mi anuncio" },
  { href: "/panel/materiales", icon: "📁", label: "Materiales" },
  { href: "/panel/mensajes", icon: "💬", label: "Mensajes" },
  { href: "/panel/alumnos", icon: "🔍", label: "Alumnos buscan profesor" },
  { href: "/panel/pagos", icon: "💳", label: "Cobros" },
  { href: "/panel/suscripcion", icon: "⭐", label: "Mi suscripción" },
  { href: "/panel/referidos", icon: "🎁", label: "Invita y gana" },
  { href: "/tu-cv", icon: "📤", label: "Tu CV" },
  { href: "/panel/sugerencias", icon: "💌", label: "Sugerencias" },
  { href: "/panel/cuenta", icon: "⚙️", label: "Mi cuenta" },
];

const STUDENT_NAV: NavItem[] = [
  { href: "/panel/mensajes", icon: "💬", label: "Mensajes" },
  { href: "/panel/anuncios", icon: "📢", label: "Mis anuncios" },
  { href: "/panel/reservas", icon: "📅", label: "Mis reservas" },
  { href: "/panel/sugerencias", icon: "💌", label: "Sugerencias" },
  { href: "/panel/cuenta", icon: "⚙️", label: "Mi cuenta" },
];

// Layout compartido por todo /panel/*: un único sitio donde se decide el
// color del espacio profesional (según el ámbito con el que se registró el
// profesor — Educación/Deporte/Salud Mental) y la navegación lateral, en vez
// de repetir una barra de enlaces distinta y siempre teal en cada página.
export default async function PanelLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();
  const isTeacher = session.user.role === "teacher";

  const teacherProfile = isTeacher
    ? await prisma.teacherProfile.findUnique({
        where: { userId: session.user.id },
        select: { vertical: true },
      })
    : null;
  const vertical: Vertical = teacherProfile?.vertical ?? DEFAULT_VERTICAL;
  const theme = VERTICAL_THEME[vertical];
  const verticalIcon = VERTICALS.find((v) => v.slug === vertical)?.icon ?? "🎓";

  const navItems = isTeacher ? TEACHER_NAV : STUDENT_NAV;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-start">
      <aside className="flex-shrink-0 sm:sticky sm:top-20 sm:w-56">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 px-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white ${theme.ctaGradient}`}
            >
              {isTeacher ? verticalIcon : "👤"}
            </span>
            <p className="text-sm font-bold text-stone-900">Mi panel</p>
          </div>

          <nav className="mt-4 flex flex-row gap-1 overflow-x-auto sm:flex-col sm:overflow-visible">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition sm:whitespace-normal ${theme.navHover}`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-stone-100 pt-4">
            <p className="truncate px-2 text-xs text-stone-500">{session.user.email}</p>
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

      <div className="min-w-0 flex-1">{children}</div>
    </main>
  );
}
