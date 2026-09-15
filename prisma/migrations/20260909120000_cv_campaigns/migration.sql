-- CreateEnum
CREATE TYPE "SpanishRegion" AS ENUM ('madrid', 'andalucia', 'cataluna', 'valencia', 'murcia', 'canarias', 'castilla_la_mancha', 'castilla_y_leon', 'galicia', 'aragon', 'extremadura', 'pais_vasco', 'asturias', 'cantabria', 'navarra', 'la_rioja', 'baleares');

-- CreateEnum
CREATE TYPE "CvCampaignStatus" AS ENUM ('pending', 'paid', 'sent', 'failed');

-- CreateTable
CREATE TABLE "school_contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" "SpanishRegion" NOT NULL,
    "email" TEXT NOT NULL,
    "province" TEXT,
    "type" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "unsubscribed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_campaigns" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "region" "SpanishRegion",
    "nationwide" BOOLEAN NOT NULL DEFAULT false,
    "amount" DECIMAL(10,2) NOT NULL,
    "cvFileUrl" TEXT NOT NULL,
    "cvFileName" TEXT NOT NULL,
    "message" TEXT,
    "status" "CvCampaignStatus" NOT NULL DEFAULT 'pending',
    "stripeCheckoutSessionId" TEXT,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "cv_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "school_contacts_region_active_unsubscribed_idx" ON "school_contacts"("region", "active", "unsubscribed");

-- CreateIndex
CREATE UNIQUE INDEX "cv_campaigns_stripeCheckoutSessionId_key" ON "cv_campaigns"("stripeCheckoutSessionId");

-- CreateIndex
CREATE INDEX "cv_campaigns_status_idx" ON "cv_campaigns"("status");

-- CreateIndex
CREATE INDEX "cv_campaigns_userId_idx" ON "cv_campaigns"("userId");

-- AddForeignKey
ALTER TABLE "cv_campaigns" ADD CONSTRAINT "cv_campaigns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
