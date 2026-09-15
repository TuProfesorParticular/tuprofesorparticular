-- "Programaciones" (programaciones didácticas, planes de entrenamiento,
-- programas de intervención): una carpeta transversal que se añade dentro
-- de todas las categorías de Materiales, en las tres ramas.
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'programaciones';
