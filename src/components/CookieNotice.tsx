"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie-notice-dismissed";

// No hay ningún evento externo al que suscribirse (solo leemos localStorage
// una vez tras montar) — una suscripción vacía es la forma correcta de
// pedirle a useSyncExternalStore que compruebe el valor tras la hidratación
// sin arriesgarse a un desajuste servidor/cliente ni a un setState en un
// efecto.
function subscribe() {
  return () => {};
}

export default function CookieNotice() {
  // En el servidor no hay localStorage: asumimos "ya descartado" para no
  // pintar nada hasta que el cliente compruebe el valor real tras montar.
  const alreadyDismissed = useSyncExternalStore(
    subscribe,
    () => Boolean(localStorage.getItem(STORAGE_KEY)),
    () => true,
  );
  const [justDismissed, setJustDismissed] = useState(false);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setJustDismissed(true);
  };

  if (alreadyDismissed || justDismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-stone-600 sm:flex-row">
        <p>
          Usamos cookies esenciales para que puedas iniciar sesión y navegar
          por la plataforma, y una analítica propia y anónima para saber
          cómo se usa la web. Más información en nuestra{" "}
          <Link href="/cookies" className="text-teal-600 hover:underline">
            Política de Cookies
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="flex-shrink-0 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
