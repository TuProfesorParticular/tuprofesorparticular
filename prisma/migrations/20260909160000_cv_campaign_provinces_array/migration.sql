-- AlterTable
ALTER TABLE "cv_campaigns" DROP COLUMN "province";
ALTER TABLE "cv_campaigns" ADD COLUMN "provinces" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
