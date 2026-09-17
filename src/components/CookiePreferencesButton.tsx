"use client";

import { clearConsent } from "@/lib/cookieConsent";

// Vuelve a mostrar el aviso de cookies para poder cambiar la decisión —
// el RGPD exige poder retirar el consentimiento tan fácilmente como se dio.
export default function CookiePreferencesButton() {
  return (
    <button type="button" onClick={() => clearConsent()} className="hover:text-stone-700">
      Preferencias de cookies
    </button>
  );
}
