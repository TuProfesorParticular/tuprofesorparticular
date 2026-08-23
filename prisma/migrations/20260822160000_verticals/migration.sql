-- CreateEnum
CREATE TYPE "Vertical" AS ENUM ('educacion', 'deporte', 'salud_mental');

-- AlterTable: subjects gain a vertical, existing rows default to "educacion"
ALTER TABLE "subjects" ADD COLUMN "vertical" "Vertical" NOT NULL DEFAULT 'educacion';

-- CreateIndex
CREATE INDEX "subjects_vertical_idx" ON "subjects"("vertical");

-- AlterTable: teacher_subjects gets a surrogate id so "level" can become
-- optional (a required column can't be part of a composite primary key).
ALTER TABLE "teacher_subjects" ADD COLUMN "id" TEXT;

-- Backfill deterministic ids from the old composite key so existing rows
-- keep a stable, unique identifier.
UPDATE "teacher_subjects"
SET "id" = 'ts_' || "teacherProfileId" || '_' || "subjectId" || '_' || "level"::text;

ALTER TABLE "teacher_subjects" ALTER COLUMN "id" SET NOT NULL;

ALTER TABLE "teacher_subjects" DROP CONSTRAINT "teacher_subjects_pkey";

ALTER TABLE "teacher_subjects" ADD CONSTRAINT "teacher_subjects_pkey" PRIMARY KEY ("id");

ALTER TABLE "teacher_subjects" ALTER COLUMN "level" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "teacher_subjects_teacherProfileId_subjectId_level_key" ON "teacher_subjects"("teacherProfileId", "subjectId", "level");
