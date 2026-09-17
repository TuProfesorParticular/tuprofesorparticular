import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { prisma } from "@/lib/prisma";
import { NEWS_SOURCES } from "@/lib/news-sources";

const MAX_ITEMS_PER_SOURCE = 15;
// Cuánto conservamos antes de limpiar: la sección solo enseña actualidad
// reciente, no un archivo histórico.
const RETENTION_DAYS = 30;

const parser = new Parser({ timeout: 15000 });

// Muchos feeds no traen la imagen en el campo "enclosure" — como último
// recurso buscamos la primera <img> dentro del HTML del contenido.
function extractImage(item: Parser.Item & { content?: string }): string | null {
  if (item.enclosure?.url) return item.enclosure.url;
  const match = item.content?.match(/<img[^>]+src="([^"]+)"/i);
  return match?.[1] ?? null;
}

// Algunos feeds (ej. Marca) traen el título con las entidades HTML
// codificadas dos veces ("&amp;quot;" en el XML se queda en "&quot;" tras
// decodificar el XML una vez) — las decodificamos otra vez y quitamos
// cualquier etiqueta suelta que quede (como un "<br>" literal).
function cleanText(text: string): string {
  const decodeOnce = (s: string) =>
    s
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#0?39;|&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ");
  return decodeOnce(decodeOnce(text))
    .replace(/<[^>]+>/g, " ")
    // Coletilla típica de WordPress al final del resumen ("La entrada X se
    // publicó primero en Y." / "The post X appeared first on Y.").
    .replace(/\s*(La entrada .+? se public[oó] primero en .+?\.|The post .+? appeared first on .+?\.)\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Se ejecuta una vez al día (ver vercel.json): importa titulares de medios
// externos para la sección /noticias. Cada uno enlaza al artículo original
// — nunca guardamos ni mostramos el contenido completo de otro medio.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let imported = 0;
  const errors: string[] = [];

  for (const source of NEWS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.feedUrl);
      const items = feed.items.slice(0, MAX_ITEMS_PER_SOURCE);

      const rows = items
        .filter((item) => item.link && item.title)
        .map((item) => ({
          vertical: source.vertical,
          sourceName: source.name,
          title: cleanText(item.title!).slice(0, 300),
          link: item.link!,
          summary: item.contentSnippet ? cleanText(item.contentSnippet).slice(0, 400) : null,
          imageUrl: extractImage(item),
          publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
        }));

      if (rows.length > 0) {
        const result = await prisma.newsItem.createMany({
          data: rows,
          skipDuplicates: true,
        });
        imported += result.count;
      }
    } catch (error) {
      errors.push(`${source.name}: ${(error as Error).message}`);
    }
  }

  const { count: deleted } = await prisma.newsItem.deleteMany({
    where: { publishedAt: { lt: new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000) } },
  });

  return NextResponse.json({ imported, deleted, errors });
}
