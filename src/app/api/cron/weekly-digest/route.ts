import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWeeklyDigestEmail } from "@/lib/mailer";
import { getBasePrice } from "@/lib/plans";

// Se ejecuta cada lunes (ver vercel.json): un resumen por email a cada
// profesor con anuncio publicado — visitas, mensajes nuevos y valoraciones
// de la última semana, con un aviso a Pro solo si está en plan Básico.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Filtro opcional (?email=...) para probar el resumen contra un único
  // profesor sin disparar el envío real a todo el mundo — solo utilizable
  // por quien ya tiene el CRON_SECRET.
  const testEmail = new URL(request.url).searchParams.get("email");

  const teacherProfiles = await prisma.teacherProfile.findMany({
    where: {
      status: "approved",
      ...(testEmail ? { user: { email: testEmail } } : { weeklyDigestOptOut: false }),
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  let sent = 0;
  let failed = 0;

  for (const teacherProfile of teacherProfiles) {
    try {
      const [visits, newMessages, totalReviews] = await Promise.all([
        prisma.pageView.count({
          where: { path: `/profesores/${teacherProfile.id}`, createdAt: { gte: weekAgo } },
        }),
        prisma.message.count({
          where: {
            createdAt: { gte: weekAgo },
            senderId: { not: teacherProfile.userId },
            conversation: { teacherId: teacherProfile.userId },
          },
        }),
        prisma.review.count({ where: { teacherProfileId: teacherProfile.id } }),
      ]);

      await sendWeeklyDigestEmail({
        teacherName: teacherProfile.user.name,
        teacherEmail: teacherProfile.user.email,
        teacherProfileId: teacherProfile.id,
        visits,
        newMessages,
        totalReviews,
        isFreePlan: teacherProfile.plan === "free",
        proPrice: getBasePrice("pro", teacherProfile),
      });
      sent++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ sent, failed, total: teacherProfiles.length });
}
