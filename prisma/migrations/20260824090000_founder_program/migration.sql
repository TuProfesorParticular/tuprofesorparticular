-- AlterTable
ALTER TABLE "teacher_profiles"
  ADD COLUMN "isFounder" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "founderProUntil" TIMESTAMP(3),
  ADD COLUMN "founderLockedPrice" DECIMAL(10,2);
