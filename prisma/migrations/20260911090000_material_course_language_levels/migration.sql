-- La categoría "Cursos oficiales" (certificaciones de idiomas) no debe
-- organizarse por curso escolar (1º ESO... Universidad), sino por nivel del
-- Marco Común Europeo de Referencia (MCER/CEFR), que es el estándar común a
-- Cambridge, EOI, DELF/DALF, Goethe-Institut, CELI, etc.
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'a1';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'a2';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'b1';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'b2';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'c1';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'c2';
