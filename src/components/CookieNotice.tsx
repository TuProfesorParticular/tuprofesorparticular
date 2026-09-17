"use client";

import Link from "next/link";
import { useConsent, setConsent } from "@/lib/cookieConsent";

export default function CookieNotice() {
  const consent = useConsent();

  if (consent !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white px-4 py-4 shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-stone-600 sm:flex-row">
        <p>
          Usamos cookies esenciales para que puedas iniciar sesión y navegar
          por la plataforma, y una analítica propia y anónima para saber
          cómo se usa la web. Si aceptas, también permitirás anuncios
          personalizados de Google AdSense. Más información en nuestra{" "}
          <Link href="/cookies" className="text-teal-600 hover:underline">
            Política de Cookies
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent("essential")}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
          >
            Rechazar no esenciales
          </button>
          <button
            type="button"
            onClick={() => setConsent("all")}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  );
}
