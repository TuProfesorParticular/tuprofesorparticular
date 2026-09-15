-- CreateEnum
CREATE TYPE "MaterialStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "materials" ADD COLUMN "status" "MaterialStatus" NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "materials_status_idx" ON "materials"("status");

-- Los materiales ya existentes, subidos antes de que existiera esta
-- moderación, se consideran ya aceptados (no deben desaparecer de golpe).
UPDATE "materials" SET "status" = 'approved' WHERE "createdAt" < NOW();
