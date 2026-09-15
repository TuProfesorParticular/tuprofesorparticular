import { prisma } from "@/lib/prisma";

export type DailyVisits = {
  date: string;
  visits: number;
  uniqueVisitors: number;
};

export async function getDailyVisits(days = 30): Promise<DailyVisits[]> {
  const rows = await prisma.$queryRaw<
    { date: Date; visits: bigint; uniquevisitors: bigint }[]
  >`
    SELECT
      date_trunc('day', "createdAt") AS date,
      COUNT(*)::bigint AS visits,
      COUNT(DISTINCT "visitorId")::bigint AS uniquevisitors
    FROM page_views
    WHERE "createdAt" >= NOW() - (${days}::text || ' days')::interval
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  return rows.map((row) => ({
    date: row.date.toISOString().slice(0, 10),
    visits: Number(row.visits),
    uniqueVisitors: Number(row.uniquevisitors),
  }));
}

export type TopPage = { path: string; visits: number };

export async function getTopPages(days = 30, limit = 10): Promise<TopPage[]> {
  const rows = await prisma.$queryRaw<{ path: string; visits: bigint }[]>`
    SELECT "path" AS path, COUNT(*)::bigint AS visits
    FROM page_views
    WHERE "createdAt" >= NOW() - (${days}::text || ' days')::interval
    GROUP BY "path"
    ORDER BY visits DESC
    LIMIT ${limit}
  `;

  return rows.map((row) => ({ path: row.path, visits: Number(row.visits) }));
}

export type AnalyticsSummary = {
  totalViews: number;
  uniqueVisitors: number;
  avgDurationSeconds: number | null;
};

export async function getAnalyticsSummary(days = 30): Promise<AnalyticsSummary> {
  const rows = await prisma.$queryRaw<
    { totalviews: bigint; uniquevisitors: bigint; avgdurationms: number | null }[]
  >`
    SELECT
      COUNT(*)::bigint AS totalviews,
      COUNT(DISTINCT "visitorId")::bigint AS uniquevisitors,
      AVG("durationMs") AS avgdurationms
    FROM page_views
    WHERE "createdAt" >= NOW() - (${days}::text || ' days')::interval
  `;

  const row = rows[0];
  return {
    totalViews: Number(row?.totalviews ?? 0),
    uniqueVisitors: Number(row?.uniquevisitors ?? 0),
    avgDurationSeconds:
      row?.avgdurationms != null ? Math.round(row.avgdurationms / 1000) : null,
  };
}
