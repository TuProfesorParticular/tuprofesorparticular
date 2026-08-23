import "dotenv/config";
import type { Vertical } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

const subjects: { name: string; category: string; vertical?: Vertical }[] = [
  // Ciencias (Primaria, ESO y Bachillerato — modalidad Ciencias y Tecnología, LOMLOE)
  { name: "Matemáticas", category: "Ciencias" },
  { name: "Física", category: "Ciencias" },
  { name: "Química", category: "Ciencias" },
  { name: "Biología", category: "Ciencias" },
  { name: "Dibujo Técnico", category: "Ciencias" },
  { name: "Informática", category: "Ciencias" },
  { name: "Ciencias Naturales", category: "Ciencias" },
  { name: "Biología y Geología", category: "Ciencias" },
  { name: "Física y Química", category: "Ciencias" },
  { name: "Geología y Ciencias Ambientales", category: "Ciencias" },
  { name: "Cultura Científica", category: "Ciencias" },
  { name: "Tecnología y Digitalización", category: "Ciencias" },
  { name: "Tecnología e Ingeniería", category: "Ciencias" },
  { name: "Digitalización", category: "Ciencias" },
  { name: "Tecnologías de la Información y la Comunicación", category: "Ciencias" },

  // Humanidades (incluye idiomas, artes y las materias comunes de formación)
  { name: "Filosofía", category: "Humanidades" },
  { name: "Historia de la Filosofía", category: "Humanidades" },
  { name: "Lengua y Literatura", category: "Humanidades" },
  { name: "Literatura Universal", category: "Humanidades" },
  { name: "Latín", category: "Humanidades" },
  { name: "Griego", category: "Humanidades" },
  { name: "Cultura Clásica", category: "Humanidades" },
  { name: "Valenciano", category: "Humanidades" },
  { name: "Inglés", category: "Humanidades" },
  { name: "Francés", category: "Humanidades" },
  { name: "Alemán", category: "Humanidades" },
  { name: "Español", category: "Humanidades" },
  { name: "Música", category: "Humanidades" },
  { name: "Educación Física", category: "Humanidades" },
  { name: "Religión", category: "Humanidades" },
  { name: "Valores Cívicos y Éticos", category: "Humanidades" },
  { name: "Educación Plástica, Visual y Audiovisual", category: "Humanidades" },
  { name: "Historia del Arte", category: "Humanidades" },
  { name: "Dibujo Artístico", category: "Humanidades" },
  { name: "Cultura Audiovisual", category: "Humanidades" },
  { name: "Fundamentos Artísticos", category: "Humanidades" },
  { name: "Análisis Musical", category: "Humanidades" },
  { name: "Artes Escénicas", category: "Humanidades" },

  // Ciencias Sociales (Primaria, ESO y Bachillerato — modalidad Humanidades y CCSS)
  { name: "Historia", category: "Ciencias Sociales" },
  { name: "Geografía", category: "Ciencias Sociales" },
  { name: "Ciencias Sociales (Primaria)", category: "Ciencias Sociales" },
  { name: "Geografía e Historia", category: "Ciencias Sociales" },
  { name: "Historia de España", category: "Ciencias Sociales" },
  { name: "Historia del Mundo Contemporáneo", category: "Ciencias Sociales" },
  { name: "Economía", category: "Ciencias Sociales" },
  { name: "Economía de la Empresa", category: "Ciencias Sociales" },
  { name: "Matemáticas Aplicadas a las Ciencias Sociales", category: "Ciencias Sociales" },
  { name: "Fundamentos de Administración y Gestión", category: "Ciencias Sociales" },
  { name: "Iniciación a la Actividad Emprendedora y Empresarial", category: "Ciencias Sociales" },

  // Oposiciones (las más comunes y demandadas)
  { name: "Oposición Secundaria", category: "Oposiciones" },
  { name: "Oposición Primaria", category: "Oposiciones" },
  { name: "Oposición Auxiliar Administrativo", category: "Oposiciones" },
  { name: "Oposición Policía Nacional / Guardia Civil", category: "Oposiciones" },
  { name: "Oposición Correos", category: "Oposiciones" },
  { name: "Oposición Enfermería", category: "Oposiciones" },
  { name: "Oposición Justicia", category: "Oposiciones" },

  // Cursos oficiales (certificaciones de idiomas — cualquier idioma, no solo los tres iniciales)
  { name: "Inglés (Cambridge / EOI)", category: "Cursos oficiales" },
  { name: "Valenciano (JQCV)", category: "Cursos oficiales" },
  { name: "Francés (DELF / DALF)", category: "Cursos oficiales" },
  { name: "Alemán (Goethe-Institut / EOI)", category: "Cursos oficiales" },
  { name: "Italiano (CELI / EOI)", category: "Cursos oficiales" },
  { name: "Portugués (CAPLE / EOI)", category: "Cursos oficiales" },
  { name: "Chino (HSK)", category: "Cursos oficiales" },
  { name: "Japonés (JLPT)", category: "Cursos oficiales" },
  { name: "Árabe (EOI)", category: "Cursos oficiales" },
  { name: "Ruso (TORFL / EOI)", category: "Cursos oficiales" },
  { name: "Catalán (JQCV / EOI)", category: "Cursos oficiales" },
  { name: "Euskera (EGA / EOI)", category: "Cursos oficiales" },
  { name: "Gallego (CELGA)", category: "Cursos oficiales" },

  // Deportes de Combate
  { name: "Boxeo", category: "Deportes de Combate", vertical: "deporte" },
  { name: "Kickboxing", category: "Deportes de Combate", vertical: "deporte" },
  { name: "Muay Thai", category: "Deportes de Combate", vertical: "deporte" },
  { name: "Artes Marciales Mixtas (MMA)", category: "Deportes de Combate", vertical: "deporte" },
  { name: "Judo", category: "Deportes de Combate", vertical: "deporte" },
  { name: "Karate", category: "Deportes de Combate", vertical: "deporte" },
  { name: "Defensa Personal", category: "Deportes de Combate", vertical: "deporte" },

  // Deportes de Raqueta y Equipo
  { name: "Tenis", category: "Deportes de Raqueta y Equipo", vertical: "deporte" },
  { name: "Pádel", category: "Deportes de Raqueta y Equipo", vertical: "deporte" },
  { name: "Bádminton", category: "Deportes de Raqueta y Equipo", vertical: "deporte" },
  { name: "Fútbol", category: "Deportes de Raqueta y Equipo", vertical: "deporte" },
  { name: "Baloncesto", category: "Deportes de Raqueta y Equipo", vertical: "deporte" },
  { name: "Voleibol", category: "Deportes de Raqueta y Equipo", vertical: "deporte" },

  // Fitness y Bienestar Físico
  { name: "Entrenamiento Personal", category: "Fitness y Bienestar Físico", vertical: "deporte" },
  { name: "Crossfit", category: "Fitness y Bienestar Físico", vertical: "deporte" },
  { name: "Calistenia", category: "Fitness y Bienestar Físico", vertical: "deporte" },
  { name: "Musculación", category: "Fitness y Bienestar Físico", vertical: "deporte" },
  { name: "Natación", category: "Fitness y Bienestar Físico", vertical: "deporte" },
  { name: "Running y Atletismo", category: "Fitness y Bienestar Físico", vertical: "deporte" },
  { name: "Yoga", category: "Fitness y Bienestar Físico", vertical: "deporte" },
  { name: "Pilates", category: "Fitness y Bienestar Físico", vertical: "deporte" },
  { name: "Ciclismo", category: "Fitness y Bienestar Físico", vertical: "deporte" },

  // Psicología y Terapia
  { name: "Psicología Clínica", category: "Psicología y Terapia", vertical: "salud_mental" },
  { name: "Psicología Infantil y Juvenil", category: "Psicología y Terapia", vertical: "salud_mental" },
  { name: "Terapia de Pareja", category: "Psicología y Terapia", vertical: "salud_mental" },
  { name: "Terapia Familiar", category: "Psicología y Terapia", vertical: "salud_mental" },
  { name: "Terapia Cognitivo-Conductual", category: "Psicología y Terapia", vertical: "salud_mental" },
  { name: "Coaching Personal", category: "Psicología y Terapia", vertical: "salud_mental" },
  { name: "Mindfulness y Gestión del Estrés", category: "Psicología y Terapia", vertical: "salud_mental" },

  // Psicopedagogía y Aprendizaje
  { name: "Psicopedagogía", category: "Psicopedagogía y Aprendizaje", vertical: "salud_mental" },
  { name: "Logopedia", category: "Psicopedagogía y Aprendizaje", vertical: "salud_mental" },
  { name: "Dificultades del Aprendizaje", category: "Psicopedagogía y Aprendizaje", vertical: "salud_mental" },
  { name: "Altas Capacidades", category: "Psicopedagogía y Aprendizaje", vertical: "salud_mental" },
];

async function main() {
  for (const subject of subjects) {
    const vertical = subject.vertical ?? "educacion";
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: { category: subject.category, vertical },
      create: { name: subject.name, category: subject.category, vertical },
    });
  }
  console.log(`Seed completado: ${subjects.length} materias.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
