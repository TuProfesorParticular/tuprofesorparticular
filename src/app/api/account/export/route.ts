import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-helpers";

// Exportación de datos propios (RGPD, derecho de portabilidad): todo lo que
// la plataforma guarda sobre el usuario autenticado, en un único JSON.
export async function GET() {
  const session = await requireSession();
  const userId = session.user.id;

  const [user, teacherProfile, studentRequests, bookingsAsStudent, reviewsWritten, ethicsReports, conversations] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.teacherProfile.findUnique({
        where: { userId },
        include: { subjects: { include: { subject: true } }, availability: true },
      }),
      prisma.studentRequest.findMany({ where: { studentId: userId } }),
      prisma.booking.findMany({ where: { studentId: userId } }),
      prisma.review.findMany({ where: { studentId: userId } }),
      prisma.ethicsReport.findMany({ where: { reporterId: userId } }),
      prisma.conversation.findMany({
        where: { OR: [{ studentId: userId }, { teacherId: userId }] },
        include: { messages: true },
      }),
    ]);

  const data = {
    exportedAt: new Date().toISOString(),
    user,
    teacherProfile,
    studentRequests,
    bookingsAsStudent,
    reviewsWritten,
    ethicsReports,
    conversations,
  };

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="mis-datos-tuprofesorparticular.json"`,
    },
  });
}
