"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { uploadCvFile, uploadRecommendationLetter } from "@/lib/storage";
import { dispatchCvCampaign } from "@/lib/cv-campaigns";

const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_REFERENCES_LENGTH = 2000;

// El atributo accept=".pdf,.doc,.docx" del input es solo una ayuda visual:
// cualquiera puede saltárselo enviando el formulario a mano. El archivo
// acaba en un bucket público (para que los centros puedan abrirlo desde el
// email), así que hay que comprobar el tipo también aquí, o cualquiera
// podría alojar lo que quisiera bajo nuestro dominio.
const ALLOWED_CV_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_CV_EXTENSIONS = [".pdf", ".doc", ".docx"];

function isAllowedDocument(file: File): boolean {
  const hasAllowedExtension = ALLOWED_CV_EXTENSIONS.some((ext) =>
    file.name.toLowerCase().endsWith(ext),
  );
  return ALLOWED_CV_TYPES.has(file.type) && hasAllowedExtension;
}

export async function confirmCvCampaignAndSend(formData: FormData) {
  const session = await requireRole("teacher");

  const campaignId = String(formData.get("campaignId") || "");
  const campaign = await prisma.cvCampaign.findUnique({ where: { id: campaignId } });

  if (!campaign || campaign.userId !== session.user.id || campaign.status !== "paid") {
    redirect("/tu-cv");
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    redirect(`/tu-cv/envios/${campaignId}?error=archivo`);
  }
  if (file.size > MAX_CV_SIZE) {
    redirect(`/tu-cv/envios/${campaignId}?error=tamano`);
  }
  if (!isAllowedDocument(file)) {
    redirect(`/tu-cv/envios/${campaignId}?error=formato`);
  }

  // Carta de recomendación: opcional, mismas reglas que el CV.
  const recommendationFile = formData.get("recommendationFile");
  const hasRecommendation =
    recommendationFile instanceof File && recommendationFile.size > 0;
  if (hasRecommendation) {
    if (recommendationFile.size > MAX_CV_SIZE) {
      redirect(`/tu-cv/envios/${campaignId}?error=recomendacion-tamano`);
    }
    if (!isAllowedDocument(recommendationFile)) {
      redirect(`/tu-cv/envios/${campaignId}?error=recomendacion-formato`);
    }
  }

  const message = String(formData.get("message") || "").slice(0, 1000) || null;
  const referencesText =
    String(formData.get("references") || "")
      .slice(0, MAX_REFERENCES_LENGTH)
      .trim() || null;
  const excludedContactIds = formData
    .getAll("excludedContact")
    .map((v) => String(v).trim())
    .filter(Boolean);

  const { fileUrl, fileName } = await uploadCvFile(session.user.id, file);

  let recommendationFileUrl: string | null = null;
  let recommendationFileName: string | null = null;
  if (hasRecommendation) {
    const uploaded = await uploadRecommendationLetter(
      session.user.id,
      recommendationFile,
    );
    recommendationFileUrl = uploaded.fileUrl;
    recommendationFileName = uploaded.fileName;
  }

  await prisma.cvCampaign.update({
    where: { id: campaign.id },
    data: {
      cvFileUrl: fileUrl,
      cvFileName: fileName,
      message,
      referencesText,
      recommendationFileUrl,
      recommendationFileName,
      excludedContactIds,
    },
  });

  await dispatchCvCampaign(campaign.id);

  redirect("/tu-cv?enviado=1");
}
