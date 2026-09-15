ALTER TABLE "teacher_profiles" ADD COLUMN IF NOT EXISTS "weeklyDigestOptOut" BOOLEAN NOT NULL DEFAULT false;
