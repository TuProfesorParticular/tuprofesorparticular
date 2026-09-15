-- Generalize "Enviar CV" beyond colegios: rename school_contacts to
-- institution_contacts and tag each row (and each campaign) with the
-- vertical it belongs to (educacion / deporte / salud_mental). Existing
-- rows are all colegios, so they default to 'educacion'.

-- AlterTable
ALTER TABLE "school_contacts" RENAME TO "institution_contacts";
ALTER TABLE "institution_contacts" ADD COLUMN "vertical" "Vertical" NOT NULL DEFAULT 'educacion';

-- RenameIndex (region+active+unsubscribed -> vertical+region+active+unsubscribed)
DROP INDEX "school_contacts_region_active_unsubscribed_idx";
CREATE INDEX "institution_contacts_vertical_region_active_unsubscribed_idx" ON "institution_contacts"("vertical", "region", "active", "unsubscribed");

-- AlterTable
ALTER TABLE "cv_campaigns" ADD COLUMN "vertical" "Vertical" NOT NULL DEFAULT 'educacion';
ALTER TABLE "cv_campaigns" RENAME COLUMN "excludedSchoolIds" TO "excludedContactIds";
