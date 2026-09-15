"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { logout } from "@/app/actions";
import TuCvNavLink from "./TuCvNavLink";

function TuCvNavLinkFallback() {
  return (
    <Link
      href="/tu-cv"
      className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-1.5 text-white shadow-sm"
    >
      Tu CV
    </Link>
  );
}

export default function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        className="rounded-lg p-2 text-stone-600 hover:bg-stone-100"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-b border-stone-200 bg-white px-4 py-4 shadow-lg">
          <div className="flex flex-col gap-1 text-sm font-medium">
            <div className="mb-1 self-start" onClick={close}>
              <Suspense fallback={<TuCvNavLinkFallback />}>
                <TuCvNavLink />
              </Suspense>
            </div>
            <Link
              href="/"
              onClick={close}
              className="rounded-lg px-3 py-2 text-stone-600 hover:bg-stone-50 hover:text-stone-900"
            >
              Buscar profesores
            </Link>
            <Link
              href="/materiales"
              onClick={close}
              className="rounded-lg px-3 py-2 text-stone-600 hover:bg-stone-50 hover:text-stone-900"
            >
              Materiales
            </Link>
            <Link
              href="/preguntas-frecuentes"
              onClick={close}
              className="rounded-lg px-3 py-2 text-stone-600 hover:bg-stone-50 hover:text-stone-900"
            >
              Preguntas frecuentes
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/panel"
                  onClick={close}
                  className="rounded-lg px-3 py-2 text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                >
                  Mi panel
                </Link>
                <form action={logout} className="mt-1">
                  <button
                    type="submit"
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-left text-stone-700 hover:bg-stone-50"
                  >
                    Cerrar sesión
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/iniciar-sesion"
                  onClick={close}
                  className="rounded-lg px-3 py-2 text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  onClick={close}
                  className="mt-1 rounded-lg bg-teal-600 px-3 py-2 text-center text-white hover:bg-teal-700"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
