"use client";

import { useEffect, useState } from "react";
import { HONEYPOT_FIELD, TIMESTAMP_FIELD } from "@/lib/antispam";

// Campos invisibles para el usuario real (fuera de pantalla, no display:none
// para que un bot poco cuidadoso no lo detecte y lo salte) que ayudan a
// filtrar envíos automáticos sin necesidad de un captcha.
export default function HoneypotFields() {
  const [renderedAt, setRenderedAt] = useState<number | "">("");

  // A propósito en un efecto (no en el estado inicial): así el campo se
  // queda vacío para cualquier bot que no ejecute JavaScript en absoluto,
  // que es justo la señal que usamos en el servidor para descartar el
  // envío. Si se calculara en el render inicial, ya vendría relleno en el
  // HTML del servidor y ese bot pasaría el filtro.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- necesita ejecutarse tras montar en el cliente, ver comentario arriba
    setRenderedAt(Date.now());
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
    >
      <label>
        No rellenar este campo
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </label>
      <input type="hidden" name={TIMESTAMP_FIELD} value={renderedAt} />
    </div>
  );
}
