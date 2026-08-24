-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- CreateTable
CREATE TABLE "availability_slots" (
    "id" TEXT NOT NULL,
    "teacherProfileId" TEXT NOT NULL,
    "weekday" "Weekday" NOT NULL,
    "hour" INTEGER NOT NULL,

    CONSTRAINT "availability_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "availability_slots_teacherProfileId_weekday_hour_key" ON "availability_slots"("teacherProfileId", "weekday", "hour");

-- AddForeignKey
ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slots_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
