import { prisma } from "@/lib/prisma";
import { sendCvToInstitutions } from "@/lib/mailer";

// Envía de verdad el CV a los centros de la campaña (colegios, gimnasios/
// clubes o clínicas/gabinetes según su vertical, dentro de su comunidad,
// menos los que el profesional haya quitado a mano, o todo el país si es
// nationwide) y actualiza su estado. Requiere que ya tenga CV subido.
export async function dispatchCvCampaign(campaignId: string) {
  const campaign = await prisma.cvCampaign.findUnique({
    where: { id: campaignId },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!campaign || !campaign.cvFileUrl) return;

  const institutions = await prisma.institutionContact.findMany({
    where: {
      vertical: campaign.vertical,
      active: true,
      unsubscribed: false,
      id: campaign.excludedContactIds.length ? { notIn: campaign.excludedContactIds } : undefined,
      ...(campaign.nationwide
        ? {}
        : {
            region: campaign.region ?? undefined,
            ...(campaign.provinces.length ? { province: { in: campaign.provinces } } : {}),
          }),
    },
    select: { id: true, email: true },
  });

  try {
    const { sent, failed } = await sendCvToInstitutions({
      vertical: campaign.vertical,
      teacherName: campaign.user.name,
      teacherEmail: campaign.user.email,
      cvFileUrl: campaign.cvFileUrl,
      message: campaign.message,
      recommendationFileUrl: campaign.recommendationFileUrl,
      references: campaign.referencesText,
      institutions,
    });

    await prisma.cvCampaign.update({
      where: { id: campaign.id },
      data: {
        status: "sent",
        sentCount: sent,
        failedCount: failed,
        sentAt: new Date(),
      },
    });
  } catch {
    await prisma.cvCampaign.update({
      where: { id: campaign.id },
      data: { status: "failed" },
    });
  }
}
