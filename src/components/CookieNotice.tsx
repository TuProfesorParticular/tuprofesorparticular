"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie-notice-dismissed";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-stone-600 sm:flex-row">
        <p>
          Usamos solo cookies esenciales para que puedas iniciar sesión y
          navegar por la plataforma. Más información en nuestra{" "}
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
