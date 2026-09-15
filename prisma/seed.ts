import "dotenv/config";
import type { Vertical } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

const subjects: { name: string; category: string; vertical?: Vertical }[] = [
  // Infantil (maestros generalistas de 0-6 años)
  { name: "Educación Infantil", category: "Infantil" },
  { name: "Estimulación Temprana", category: "Infantil" },
  { name: "Lectoescritura y Grafomotricidad", category: "Infantil" },

  // Primaria (maestros generalistas de 6-12 años)
  { name: "Apoyo Escolar Primaria (todas las asignaturas)", category: "Primaria" },
  { name: "Técnicas de Estudio y Refuerzo", category: "Primaria" },

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

  // Oposiciones (las más comunes y demandadas). "Oposición Secundaria",
  // "Oposición Primaria" y "Oposición Infantil" ya no son una materia más
  // aquí: tienen tantas especialidades (o al menos exámenes/casos
  // prácticos propios) que se organizan como su propia categoría — ver
  // los bloques de abajo. El enlace desde la lista de Oposiciones hacia
  // ellas está en COMPOUND_OPOSICIONES (src/app/materiales/page.tsx).
  { name: "Oposición Auxiliar Administrativo", category: "Oposiciones" },
  { name: "Oposición Policía Nacional / Guardia Civil", category: "Oposiciones" },
  { name: "Oposición Correos", category: "Oposiciones" },
  { name: "Oposición Enfermería", category: "Oposiciones" },
  { name: "Oposición Justicia", category: "Oposiciones" },

  // Oposición Secundaria: las especialidades oficiales del Cuerpo de
  // Profesores de Enseñanza Secundaria (código 0590), más exámenes y casos
  // prácticos. Se sufija "(Opos. Secundaria)" porque el nombre de la
  // materia tiene que ser único en toda la web (Subject.name), y muchas
  // especialidades coinciden de nombre con materias normales (Filosofía,
  // Matemáticas...).
  { name: "Filosofía (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Griego (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Latín (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Lengua Castellana y Literatura (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Geografía e Historia (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Matemáticas (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Física y Química (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Biología y Geología (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Dibujo (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Francés (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Inglés (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Alemán (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Italiano (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Música (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Educación Física (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Orientación Educativa (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Tecnología (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Economía (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Administración de Empresas (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Análisis y Química Industrial (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Asesoría y Procesos de Imagen Personal (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Construcciones Civiles y Edificación (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Formación y Orientación Laboral (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Hostelería y Turismo (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Informática (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Intervención Sociocomunitaria (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Organización y Gestión Comercial (Opos. Secundaria)", category: "Oposición Secundaria" },
  {
    name: "Organización y Procesos de Mantenimiento de Vehículos (Opos. Secundaria)",
    category: "Oposición Secundaria",
  },
  {
    name: "Organización y Proyectos de Fabricación Mecánica (Opos. Secundaria)",
    category: "Oposición Secundaria",
  },
  {
    name: "Organización y Proyectos de Sistemas Energéticos (Opos. Secundaria)",
    category: "Oposición Secundaria",
  },
  { name: "Procesos de Producción Agraria (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Procesos en la Industria Alimentaria (Opos. Secundaria)", category: "Oposición Secundaria" },
  {
    name: "Procesos de Diagnóstico Clínico y Productos Ortoprotésicos (Opos. Secundaria)",
    category: "Oposición Secundaria",
  },
  { name: "Procesos Sanitarios (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Procesos y Medios de Comunicación (Opos. Secundaria)", category: "Oposición Secundaria" },
  {
    name: "Procesos y Productos de Textil, Confección y Piel (Opos. Secundaria)",
    category: "Oposición Secundaria",
  },
  { name: "Procesos y Productos en Madera y Mueble (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Sistemas Electrónicos (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Sistemas Electrotécnicos y Automáticos (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Instalaciones Electrotécnicas (Opos. Secundaria)", category: "Oposición Secundaria" },
  {
    name: "Procedimientos de Diagnóstico Clínico y Ortoprotésico (Opos. Secundaria)",
    category: "Oposición Secundaria",
  },
  { name: "Procedimientos Sanitarios y Asistenciales (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Procesos Comerciales (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Procesos de Gestión Administrativa (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Servicios a la Comunidad (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Sistemas y Aplicaciones Informáticas (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Exámenes (Opos. Secundaria)", category: "Oposición Secundaria" },
  { name: "Ejercicios Prácticos y Casos Prácticos (Opos. Secundaria)", category: "Oposición Secundaria" },

  // Oposición Primaria y Oposición Infantil: de momento sin desglose por
  // especialidad (el Cuerpo de Maestros es mucho más generalista que el de
  // Secundaria), solo exámenes y casos prácticos.
  { name: "Exámenes (Opos. Primaria)", category: "Oposición Primaria" },
  { name: "Ejercicios Prácticos y Casos Prácticos (Opos. Primaria)", category: "Oposición Primaria" },
  { name: "Exámenes (Opos. Infantil)", category: "Oposición Infantil" },
  { name: "Ejercicios Prácticos y Casos Prácticos (Opos. Infantil)", category: "Oposición Infantil" },

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

  // Deportes de Raqueta (antes iba junto con los de equipo en una sola
  // categoría — se separan porque son perfiles de profesor muy distintos)
  { name: "Tenis", category: "Deportes de Raqueta", vertical: "deporte" },
  { name: "Pádel", category: "Deportes de Raqueta", vertical: "deporte" },
  { name: "Bádminton", category: "Deportes de Raqueta", vertical: "deporte" },

  // Deportes de Equipo
  { name: "Fútbol", category: "Deportes de Equipo", vertical: "deporte" },
  { name: "Baloncesto", category: "Deportes de Equipo", vertical: "deporte" },
  { name: "Voleibol", category: "Deportes de Equipo", vertical: "deporte" },

  // Entrenamiento Personal (antes dentro de "Fitness y Bienestar Físico" —
  // categoría propia por la demanda que tiene)
  { name: "Entrenamiento Personal", category: "Entrenamiento Personal", vertical: "deporte" },

  // Yoga (antes dentro de "Fitness y Bienestar Físico" — categoría propia
  // por la demanda que tiene)
  { name: "Yoga", category: "Yoga", vertical: "deporte" },

  // Fitness y Bienestar Físico (el resto, sin Entrenamiento Personal ni Yoga)
  { name: "Crossfit", category: "Fitness y Bienestar Físico", vertical: "deporte" },
  { name: "Calistenia", category: "Fitness y Bienestar Físico", vertical: "deporte" },
  { name: "Musculación", category: "Fitness y Bienestar Físico", vertical: "deporte" },
  { name: "Natación", category: "Fitness y Bienestar Físico", vertical: "deporte" },
  { name: "Running y Atletismo", category: "Fitness y Bienestar Físico", vertical: "deporte" },
  { name: "Pilates", category: "Fitness y Bienestar Físico", vertical: "deporte" },
  { name: "Ciclismo", category: "Fitness y Bienestar Físico", vertical: "deporte" },

  // Antes agrupadas en una sola categoría "Psicología y Terapia" — ahora
  // cada especialidad es su propia categoría (globo) independiente.
  { name: "Psicología Clínica", category: "Psicología Clínica", vertical: "salud_mental" },
  {
    name: "Psicología Infantil y Juvenil",
    category: "Psicología Infantil y Juvenil",
    vertical: "salud_mental",
  },
  { name: "Terapia de Pareja", category: "Terapia de Pareja", vertical: "salud_mental" },
  { name: "Terapia Familiar", category: "Terapia Familiar", vertical: "salud_mental" },
  {
    name: "Terapia Cognitivo-Conductual",
    category: "Terapia Cognitivo-Conductual",
    vertical: "salud_mental",
  },
  { name: "Coaching Personal", category: "Coaching Personal", vertical: "salud_mental" },
  {
    name: "Mindfulness y Gestión del Estrés",
    category: "Mindfulness y Gestión del Estrés",
    vertical: "salud_mental",
  },

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
