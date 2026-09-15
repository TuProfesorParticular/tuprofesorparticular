import type { SpanishRegion } from "@prisma/client";

// Precio del envío de CV: fijo por comunidad autónoma (elijas una sola
// provincia o toda la comunidad, el precio no cambia), y de la opción
// nacional (todas las comunidades de una vez). Fácil de cambiar.
export const CV_REGION_PRICE = 15;
export const CV_NATIONWIDE_PRICE = 69;

export const REGION_LABELS: Record<SpanishRegion, string> = {
  madrid: "Madrid",
  andalucia: "Andalucía",
  cataluna: "Cataluña",
  valencia: "C. Valenciana",
  murcia: "Murcia",
  canarias: "Canarias",
  castilla_la_mancha: "Castilla-La Mancha",
  castilla_y_leon: "Castilla y León",
  galicia: "Galicia",
  aragon: "Aragón",
  extremadura: "Extremadura",
  pais_vasco: "País Vasco",
  asturias: "Asturias",
  cantabria: "Cantabria",
  navarra: "Navarra",
  la_rioja: "La Rioja",
  baleares: "Baleares",
};

export const REGION_ORDER: SpanishRegion[] = [
  "madrid",
  "andalucia",
  "cataluna",
  "valencia",
  "murcia",
  "canarias",
  "castilla_la_mancha",
  "castilla_y_leon",
  "galicia",
  "aragon",
  "extremadura",
  "pais_vasco",
  "asturias",
  "cantabria",
  "navarra",
  "la_rioja",
  "baleares",
];
