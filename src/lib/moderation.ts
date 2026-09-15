// Filtro básico de lenguaje inadecuado para contenido público (anuncios, perfiles).
// Lista de partida en español (+ algunos términos en inglés habituales) — se puede
// ampliar añadiendo entradas a BANNED_STEMS.
const BANNED_STEMS = [
  "puta", "puto", "putas", "putos", "putada", "hijoputa", "hdp",
  "gilipollas", "gilipoll",
  "cabron", "cabrona", "cabrones",
  "coño",
  "polla", "pollas",
  "zorra", "zorras",
  "maricon", "marica",
  "subnormal",
  "retrasado", "retrasada",
  "pendejo", "pendeja",
  "capullo",
  "mierda",
  "joder", "jodete",
  "chinga", "chingada", "chingar",
  "verga",
  "follar", "follon",
  "fuck", "shit", "bitch", "asshole", "cunt", "nigger", "nigga",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const BANNED_REGEX = new RegExp(
  `\\b(${BANNED_STEMS.map(normalize).join("|")})\\b`,
  "i",
);

export function containsBannedLanguage(text: string): boolean {
  if (!text) return false;
  return BANNED_REGEX.test(normalize(text));
}

export const MODERATION_ERROR_MESSAGE =
  "Este texto contiene lenguaje inadecuado. Revísalo y vuelve a intentarlo.";
