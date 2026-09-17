"use client";

import { useEffect } from "react";

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

// Hueco de anuncio de Google AdSense. No renderiza nada hasta que se
// configuren NEXT_PUBLIC_ADSENSE_CLIENT_ID y un ID de bloque (una vez
// aprobada la cuenta de AdSense) — así no hay huecos rotos mientras tanto.
export default function AdSlot({ slot }: { slot?: string }) {
  useEffect(() => {
    if (!ADSENSE_CLIENT_ID || !slot) return;
    try {
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
    } catch {
      // Si el script de AdSense todavía no ha cargado, no pasa nada — el
      // hueco simplemente se queda vacío.
    }
  }, [slot]);

  if (!ADSENSE_CLIENT_ID || !slot) return null;

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
