"use client";

import { useEffect } from "react";
import { useConsent } from "@/lib/cookieConsent";

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

// Hueco de anuncio de Google AdSense. No renderiza nada hasta que se
// configuren NEXT_PUBLIC_ADSENSE_CLIENT_ID y un ID de bloque (una vez
// aprobada la cuenta de AdSense), y solo si el usuario ha aceptado cookies
// no esenciales — así no hay huecos rotos ni anuncios sin consentimiento.
export default function AdSlot({ slot }: { slot?: string }) {
  const consent = useConsent();
  const canShow = consent === "all" && Boolean(ADSENSE_CLIENT_ID) && Boolean(slot);

  useEffect(() => {
    if (!canShow) return;
    try {
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
    } catch {
      // Si el script de AdSense todavía no ha cargado, no pasa nada — el
      // hueco simplemente se queda vacío.
    }
  }, [canShow]);

  if (!canShow) return null;

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
