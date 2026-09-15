import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth-helpers";
import { getDailyVisits, getTopPages, getAnalyticsSummary } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Analítica · TuProfesorParticular",
};

const DAYS = 30;
const CHART_HEIGHT = 160;
const CHART_WIDTH = 760;

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes > 0 ? `${minutes} min ${rest}s` : `${rest}s`;
}

function formatDayLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
}

export default async function AdminAnalyticsPage() {
  await requireRole("admin");

  const [daily, topPages, summary] = await Promise.all([
    getDailyVisits(DAYS),
    getTopPages(DAYS, 10),
    getAnalyticsSummary(DAYS),
  ]);

  const maxVisits = Math.max(1, ...daily.map((d) => d.visits));
  const barCount = daily.length || 1;
  const barSlot = CHART_WIDTH / barCount;
  const barWidth = Math.min(18, barSlot * 0.35);
  const maxTopVisits = Math.max(1, ...topPages.map((p) => p.visits));

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Analítica</h1>
          <p className="mt-1 text-sm text-stone-500">
            Últimos {DAYS} días · datos anónimos, sin cookies de terceros.
          </p>
        </div>
        <Link href="/admin" className="text-sm text-teal-600 hover:underline">
          ← Volver a administración
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Visitas totales</p>
          <p className="mt-1 text-3xl font-bold text-stone-900">
            {summary.totalViews.toLocaleString("es-ES")}
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Visitantes únicos</p>
          <p className="mt-1 text-3xl font-bold text-stone-900">
            {summary.uniqueVisitors.toLocaleString("es-ES")}
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Tiempo medio en página</p>
          <p className="mt-1 text-3xl font-bold text-stone-900">
            {formatDuration(summary.avgDurationSeconds)}
          </p>
        </div>
      </div>

      <section className="mt-8 rounded-xl border border-stone-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold text-stone-900">
            Visitas por día
          </h2>
          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-teal-600" /> Visitas
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-teal-200" /> Visitantes únicos
            </span>
          </div>
        </div>

        {daily.length === 0 ? (
          <p className="mt-6 text-sm text-stone-400">
            Todavía no hay datos suficientes. Vuelve en unos días.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <svg
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT + 24}`}
              className="w-full"
              style={{ minWidth: 480 }}
            >
              {daily.map((d, i) => {
                const slotX = i * barSlot;
                const visitsH = (d.visits / maxVisits) * CHART_HEIGHT;
                const uniqueH = (d.uniqueVisitors / maxVisits) * CHART_HEIGHT;
                const showLabel = daily.length <= 10 || i % Math.ceil(daily.length / 10) === 0;
                return (
                  <g key={d.date}>
                    <rect
                      x={slotX + barSlot / 2 - barWidth - 1}
                      y={CHART_HEIGHT - visitsH}
                      width={barWidth}
                      height={visitsH}
                      fill="#0d9488"
                      rx={2}
                    >
                      <title>{`${d.date}: ${d.visits} visitas`}</title>
                    </rect>
                    <rect
                      x={slotX + barSlot / 2 + 1}
                      y={CHART_HEIGHT - uniqueH}
                      width={barWidth}
                      height={uniqueH}
                      fill="#99f6e4"
                      rx={2}
                    >
                      <title>{`${d.date}: ${d.uniqueVisitors} visitantes únicos`}</title>
                    </rect>
                    {showLabel && (
                      <text
                        x={slotX + barSlot / 2}
                        y={CHART_HEIGHT + 16}
                        textAnchor="middle"
                        fill="#a8a29e"
                        fontSize={9}
                      >
                        {formatDayLabel(d.date)}
                      </text>
                    )}
                  </g>
                );
              })}
              <line
                x1={0}
                y1={CHART_HEIGHT}
                x2={CHART_WIDTH}
                y2={CHART_HEIGHT}
                stroke="#e7e5e4"
              />
            </svg>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-stone-900">
          Páginas más visitadas
        </h2>

        {topPages.length === 0 ? (
          <p className="mt-4 text-sm text-stone-400">Todavía no hay datos.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {topPages.map((page) => (
              <li key={page.path} className="flex items-center gap-3">
                <span className="w-40 flex-shrink-0 truncate text-sm text-stone-700">
                  {page.path === "/" ? "Inicio" : page.path}
                </span>
                <div className="h-4 flex-1 rounded bg-stone-100">
                  <div
                    className="h-4 rounded bg-teal-600"
                    style={{ width: `${(page.visits / maxTopVisits) * 100}%` }}
                  />
                </div>
                <span className="w-12 flex-shrink-0 text-right text-sm text-stone-500">
                  {page.visits}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
