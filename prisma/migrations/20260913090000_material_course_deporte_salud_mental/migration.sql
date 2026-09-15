-- Segundo nivel de "Materiales" para Deporte (nivel de progresión) y Salud
-- Mental (tipo de recurso), igual que ya existe para Educación (curso) e
-- idiomas (MCER).
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'principiante';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'intermedio';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'avanzado';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'guias_pacientes';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'casos_protocolos';
ALTER TYPE "MaterialCourse" ADD VALUE IF NOT EXISTS 'tests_evaluacion';
