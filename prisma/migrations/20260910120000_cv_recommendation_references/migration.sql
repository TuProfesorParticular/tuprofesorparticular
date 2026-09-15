-- "Tu CV": permitir que el profesional adjunte una carta de recomendación
-- (archivo PDF/Word) y unas referencias (texto libre) en el paso de
-- confirmación del envío. Ambas cosas se incluyen, junto con el CV, en el
-- correo que reciben los centros.

-- AlterTable
ALTER TABLE "cv_campaigns" ADD COLUMN "recommendationFileUrl" TEXT;
ALTER TABLE "cv_campaigns" ADD COLUMN "recommendationFileName" TEXT;
ALTER TABLE "cv_campaigns" ADD COLUMN "referencesText" TEXT;
