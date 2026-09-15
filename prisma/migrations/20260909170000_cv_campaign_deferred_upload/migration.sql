-- AlterTable
ALTER TABLE "cv_campaigns" ALTER COLUMN "cvFileUrl" DROP NOT NULL;
ALTER TABLE "cv_campaigns" ALTER COLUMN "cvFileName" DROP NOT NULL;
ALTER TABLE "cv_campaigns" ADD COLUMN "excludedSchoolIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
