-- AlterEnum
ALTER TYPE "Level" ADD VALUE IF NOT EXISTS 'infantil' BEFORE 'primaria';

-- AlterEnum
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'infantil' BEFORE 'eso_1';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'primaria' BEFORE 'eso_1';
