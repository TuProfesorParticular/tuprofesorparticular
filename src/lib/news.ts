import { prisma } from "@/lib/prisma";
import type { Vertical } from "@prisma/client";

export function getNewsForVertical(vertical: Vertical, take = 24) {
  return prisma.newsItem.findMany({
    where: { vertical },
    orderBy: { publishedAt: "desc" },
    take,
  });
}
