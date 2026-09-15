ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "referredById" TEXT;

DO $$ BEGIN
  ALTER TABLE "users" ADD CONSTRAINT "users_referredById_fkey"
    FOREIGN KEY ("referredById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "teacher_profiles" ADD COLUMN IF NOT EXISTS "referralRewardGranted" BOOLEAN NOT NULL DEFAULT false;
