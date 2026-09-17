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

type NewsItemData = {
  id: string;
  title: string;
  link: string;
  summary: string | null;
  imageUrl: string | null;
  sourceName: string;
  publishedAt: Date;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" }).format(date);
}

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
  const [featured, ...rest] = news;
  const secondary = rest.slice(0, 2);
  const grid = rest.slice(2);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
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
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <FeaturedCard item={featured} />
            <div className="flex flex-col gap-5">
              {secondary.map((item) => (
                <SecondaryCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {grid.length > 0 && (
            <>
              <div className="my-8">
                <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_NEWS_SLOT} />
              </div>

              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
                Más noticias
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {grid.map((item) => (
                  <GridCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}

function FeaturedCard({ item }: { item: NewsItemData }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md lg:col-span-2"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-stone-100">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">📰</div>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs font-medium text-stone-400">
          {item.sourceName} · {formatDate(item.publishedAt)}
        </p>
        <h2 className="mt-1 text-xl font-bold text-stone-900 group-hover:underline sm:text-2xl">
          {item.title}
        </h2>
        {item.summary && (
          <p className="mt-2 line-clamp-2 text-sm text-stone-500">{item.summary}</p>
        )}
      </div>
    </a>
  );
}

function SecondaryCard({ item }: { item: NewsItemData }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex flex-1 gap-3 overflow-hidden rounded-2xl border border-stone-200 bg-white p-3 shadow-sm transition hover:shadow-md"
    >
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl">📰</div>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-semibold text-stone-900 group-hover:underline">
          {item.title}
        </h3>
        <p className="mt-1 text-xs text-stone-400">
          {item.sourceName} · {formatDate(item.publishedAt)}
        </p>
      </div>
    </a>
  );
}

function GridCard({ item }: { item: NewsItemData }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-stone-100">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">📰</div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-stone-400">
          {item.sourceName} · {formatDate(item.publishedAt)}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-stone-900 group-hover:underline">
          {item.title}
        </h3>
      </div>
    </a>
  );
}
