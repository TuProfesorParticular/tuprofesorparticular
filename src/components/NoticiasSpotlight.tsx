import Link from "next/link";
import type { Vertical } from "@prisma/client";
import { DEFAULT_VERTICAL } from "@/lib/constants";
import { getNewsForVertical } from "@/lib/news";

// Espacio propio para "Noticias" en la home, junto a Materiales — igual que
// aquella sección, no un globo más dentro de la rejilla de categorías.
export default async function NoticiasSpotlight({ vertical }: { vertical: Vertical }) {
  const news = await getNewsForVertical(vertical, 3);
  if (news.length === 0) return null;

  const noticiasHref =
    vertical === DEFAULT_VERTICAL ? "/noticias" : `/noticias?ambito=${vertical}`;

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">📰 Noticias</h2>
        <Link href={noticiasHref} className="text-sm font-semibold text-teal-600 hover:underline">
          Ver todas →
        </Link>
      </div>
      <p className="mt-1 text-stone-500">
        Actualidad recopilada de distintos medios — cada titular enlaza a su fuente original.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {news.map((item) => (
          <a
            key={item.id}
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
              <p className="text-xs font-medium text-stone-400">{item.sourceName}</p>
              <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-stone-900 group-hover:underline">
                {item.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
