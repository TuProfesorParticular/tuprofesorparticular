import type { Vertical } from "@prisma/client";

// Fuentes RSS públicas por ámbito para la sección "Noticias" (ver
// /api/cron/fetch-news). Solo guardamos titular + resumen corto + enlace al
// artículo original — nunca el contenido completo del medio de origen.
export const NEWS_SOURCES: { vertical: Vertical; name: string; feedUrl: string }[] = [
  {
    vertical: "educacion",
    name: "El Diario de la Educación",
    feedUrl: "https://eldiariodelaeducacion.com/feed/",
  },
  {
    vertical: "educacion",
    name: "Magisnet",
    feedUrl: "https://www.magisnet.com/feed/",
  },
  {
    vertical: "educacion",
    name: "Educación 3.0",
    feedUrl: "https://www.educaciontrespuntocero.com/feed/",
  },
  {
    vertical: "deporte",
    name: "Marca",
    feedUrl: "https://e00-xlk-ue-marca.uecdn.es/rss/googlenews/portada.xml",
  },
  {
    vertical: "deporte",
    name: "Vitónica",
    feedUrl: "https://www.vitonica.com/feedburner.xml",
  },
  {
    vertical: "deporte",
    name: "Mundo Deportivo",
    feedUrl: "https://www.mundodeportivo.com/rss/home.xml",
  },
  {
    vertical: "deporte",
    name: "Diario AS",
    feedUrl: "https://as.com/rss/tags/ultimas_noticias.xml",
  },
  {
    vertical: "salud_mental",
    name: "Psicología y Mente",
    feedUrl: "https://www.psicologiaymente.com/feed",
  },
  {
    vertical: "salud_mental",
    name: "Infocop",
    feedUrl: "https://www.infocop.es/feed/",
  },
  {
    vertical: "salud_mental",
    name: "Confederación Salud Mental España",
    feedUrl: "https://www.consaludmental.org/feed/",
  },
];
