// Protección anti-spam ligera para formularios públicos, sin depender de un
// servicio externo (captcha):
//  1. Honeypot: un campo oculto que solo un bot rellenaría.
//  2. Tiempo mínimo: si el formulario se envía casi instantáneamente tras
//     cargar la página, casi seguro es un bot.
export const HONEYPOT_FIELD = "website";
export const TIMESTAMP_FIELD = "formRenderedAt";

const MIN_SUBMIT_MS = 2000;

export function isLikelyBot(formData: FormData): boolean {
  const honeypot = String(formData.get(HONEYPOT_FIELD) || "");
  if (honeypot.trim() !== "") return true;

  const renderedAt = Number(formData.get(TIMESTAMP_FIELD));
  if (!renderedAt || Number.isNaN(renderedAt)) return true;

  return Date.now() - renderedAt < MIN_SUBMIT_MS;
}
