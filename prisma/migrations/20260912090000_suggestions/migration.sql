-- Apartado "Sugerencias" del panel: alumnos y profesores pueden reportar
-- errores o proponer mejoras, que se guardan aquí y llegan por email al
-- administrador.
CREATE TYPE "SuggestionCategory" AS ENUM ('error', 'mejora', 'otro');

CREATE TABLE "suggestions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "SuggestionCategory" NOT NULL DEFAULT 'otro',
    "message" TEXT NOT NULL,
    "status" "EthicsReportStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suggestions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "suggestions_status_idx" ON "suggestions"("status");

ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
