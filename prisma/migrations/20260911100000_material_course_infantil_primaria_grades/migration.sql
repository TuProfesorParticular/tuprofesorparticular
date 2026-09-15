-- "Infantil" y "Primaria" tenían un único curso genérico cada una. El
-- currículo (LOMLOE) distingue 3 cursos en el segundo ciclo de Infantil
-- (3, 4 y 5 años) y 6 cursos en Primaria (1º a 6º). Los valores antiguos
-- "infantil"/"primaria" se dejan en el enum (por si hay materiales ya
-- guardados con ellos) pero dejan de ofrecerse al subir un material nuevo.
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'infantil_1';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'infantil_2';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'infantil_3';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'primaria_1';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'primaria_2';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'primaria_3';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'primaria_4';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'primaria_5';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'primaria_6';
