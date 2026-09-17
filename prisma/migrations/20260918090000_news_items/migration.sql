CREATE TABLE IF NOT EXISTS "news_items" (
    "id" TEXT NOT NULL,
    "vertical" "Vertical" NOT NULL,
    "sourceName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "summary" TEXT,
    "imageUrl" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "news_items_link_key" ON "news_items"("link");
CREATE INDEX IF NOT EXISTS "news_items_vertical_publishedAt_idx" ON "news_items"("vertical", "publishedAt");
