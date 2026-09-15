import { prisma } from "@/lib/prisma";
import type { TeacherProfile } from "@prisma/client";

// Si a un profesor (fundador o con la recompensa de referidos) se le acabó
// la ventana de Pro gratis y nunca llegó a pagar, su plan vuelve a Gratis.
// Se llama de forma perezosa al cargar el panel del profesor, así no
// depende de que un cron pase justo el día exacto.
export async function syncFounderExpiry(
  teacherProfile: TeacherProfile,
): Promise<TeacherProfile> {
  const expired =
    teacherProfile.founderProUntil &&
    teacherProfile.founderProUntil.getTime() <= Date.now() &&
    teacherProfile.plan === "pro" &&
    !teacherProfile.stripeSubscriptionId;

  if (!expired) return teacherProfile;

  return prisma.teacherProfile.update({
    where: { id: teacherProfile.id },
    data: { plan: "free" },
  });
}
