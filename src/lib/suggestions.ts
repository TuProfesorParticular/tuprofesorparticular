import { prisma } from "@/lib/prisma";

export function getSuggestions() {
  return prisma.suggestion.findMany({
    include: {
      user: { select: { name: true, email: true, role: true } },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
}

export function getSuggestionsForUser(userId: string) {
  return prisma.suggestion.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
