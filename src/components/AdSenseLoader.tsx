"use client";

import { useConsent } from "@/lib/cookieConsent";

// Solo carga el script de AdSense si el usuario ha aceptado cookies no
// esenciales — antes de eso, ni se solicita el script (RGPD: consentimiento
// previo a cualquier cookie de publicidad, no un "opt-out" a posteriori).
export default function AdSenseLoader({ clientId }: { clientId: string }) {
  const consent = useConsent();
  if (consent !== "all") return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
    />
  );
}
