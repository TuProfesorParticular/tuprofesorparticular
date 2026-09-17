import type { Metadata } from "next";
import Link from "next/link";
import type { Vertical } from "@prisma/client";
import { VERTICALS, DEFAULT_VERTICAL } from "@/lib/constants";
import { getNewsForVertical } from "@/lib/news";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Noticias · TuProfesorParticular",
  description:
    "Actualidad de educación, deporte y salud mental, recopilada de distintos medios. Cada noticia enlaza a su fuente original.",
};

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ ambito?: string }>;
}) {
  const { ambito } = await searchParams;
  const activeVertical: Vertical = VERTICALS.some((v) => v.slug === ambito)
    ? (ambito as Vertical)
    : DEFAULT_VERTICAL;

  const news = await getNewsForVertical(activeVertical);
  const midpoint = Math.ceil(news.length / 2);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Noticias</h1>
      <p className="mt-2 text-stone-500">
        Actualidad de educación, deporte y salud mental. Cada noticia enlaza
        a su medio de origen — aquí solo recopilamos titulares.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {VERTICALS.map((v) => (
          <Link
            key={v.slug}
            href={v.slug === DEFAULT_VERTICAL ? "/noticias" : `/noticias?ambito=${v.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              activeVertical === v.slug
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-300 bg-white text-stone-600 hover:border-stone-400"
            }`}
          >
            {v.icon} {v.label}
          </Link>
        ))}
      </div>

      {news.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-stone-300 p-8 text-center text-sm text-stone-400">
          Todavía no hay noticias importadas en este ámbito.
        </p>
      ) : (
        <>
          <ul className="mt-6 space-y-3">
            {news.slice(0, midpoint).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </ul>

          <div className="my-6">
            <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_NEWS_SLOT} />
          </div>

          <ul className="space-y-3">
            {news.slice(midpoint).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </ul>
        </>
      )}
    </main>
  );
}

function NewsCard({
  item,
}: {
  item: {
    id: string;
    title: string;
    link: string;
    summary: string | null;
    imageUrl: string | null;
    sourceName: string;
    publishedAt: Date;
  };
}) {
  return (
    <li className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-stone-300 hover:shadow-md">
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt=""
          className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-stone-100 text-2xl">
          📰
        </div>
      )}
      <div className="min-w-0">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="font-medium text-stone-900 hover:underline"
        >
          {item.title}
        </a>
        {item.summary && (
          <p className="mt-1 line-clamp-2 text-sm text-stone-500">{item.summary}</p>
        )}
        <p className="mt-2 text-xs text-stone-400">
          {item.sourceName} ·{" "}
          {new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" }).format(
            item.publishedAt,
          )}
        </p>
      </div>
    </li>
  );
}
