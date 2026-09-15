import type { Level, MaterialCourse, Modality, Vertical, Weekday } from "@prisma/client";

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

export const WEEKDAY_SHORT_LABELS: Record<Weekday, string> = {
  monday: "Lun",
  tuesday: "Mar",
  wednesday: "Mié",
  thursday: "Jue",
  friday: "Vie",
  saturday: "Sáb",
  sunday: "Dom",
};

export const WEEKDAY_ORDER: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// Franja horaria de la rejilla de disponibilidad: de 8:00 a 21:00 (tramos de 1h).
export const AVAILABILITY_HOURS: number[] = Array.from({ length: 14 }, (_, i) => i + 8);

// Ámbitos de nivel superior de la web: educación (el original), deporte
// (entrenadores) y salud mental (psicólogos, psicopedagogos...).
export type VerticalSection = {
  slug: Vertical;
  label: string;
  icon: string;
  description: string;
};

export const VERTICALS: VerticalSection[] = [
  {
    slug: "educacion",
    label: "Educación",
    icon: "🎓",
    description: "Profesores particulares para cualquier etapa educativa.",
  },
  {
    slug: "deporte",
    label: "Deporte",
    icon: "🏋️",
    description: "Entrenadores personales y de cualquier disciplina deportiva.",
  },
  {
    slug: "salud_mental",
    label: "Salud Mental",
    icon: "🧠",
    description: "Psicólogos, psicopedagogos y profesionales del bienestar emocional.",
  },
];

export const DEFAULT_VERTICAL: Vertical = "educacion";

// Tema visual por ámbito: cada uno tiene su propio color de acento (en vez
// de usar el teal de marca en los tres), y su propia búsqueda de fotos de
// portada. Clases completas (no interpoladas) para que Tailwind no las purgue.
export type VerticalTheme = {
  pillActive: string;
  blob: string;
  blobStrong: string;
  button: string;
  ctaGradient: string;
  textGradient: string;
  accentText: string;
  badge: string;
  glow: string;
  ring: string;
  heroQuery: string;
  // Estado hover para enlaces de navegación secundarios (sidebars de panel/Tu CV)
  navHover: string;
  // Borde de énfasis a juego con `ring` (p.ej. la tarjeta del plan actual)
  borderStrong: string;
  // Mancha decorativa secundaria del hero (mismo tono que el segundo color
  // de `ctaGradient`, para que las manchas de fondo también sigan el ámbito
  // en vez de quedarse siempre en ámbar)
  blobAccent: string;
};

export const VERTICAL_THEME: Record<Vertical, VerticalTheme> = {
  educacion: {
    pillActive: "border-teal-600 bg-teal-600 text-white",
    blob: "bg-teal-200/40",
    blobStrong: "bg-teal-300/50",
    button: "bg-teal-600 hover:bg-teal-700",
    ctaGradient: "bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600",
    textGradient: "bg-gradient-to-r from-teal-600 to-emerald-500",
    accentText: "text-teal-600",
    badge: "border-teal-200 bg-teal-50 text-teal-700",
    glow: "shadow-teal-200/60",
    ring: "ring-teal-500",
    heroQuery: "tutor teaching student",
    navHover: "hover:bg-teal-50 hover:text-teal-700",
    borderStrong: "border-teal-500",
    blobAccent: "bg-emerald-200/30",
  },
  deporte: {
    pillActive: "border-orange-600 bg-orange-600 text-white",
    blob: "bg-orange-200/40",
    blobStrong: "bg-orange-300/50",
    button: "bg-orange-600 hover:bg-orange-700",
    ctaGradient: "bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600",
    textGradient: "bg-gradient-to-r from-orange-600 to-amber-500",
    accentText: "text-orange-600",
    badge: "border-orange-200 bg-orange-50 text-orange-700",
    glow: "shadow-orange-200/60",
    ring: "ring-orange-500",
    heroQuery: "personal trainer coaching athlete",
    navHover: "hover:bg-orange-50 hover:text-orange-700",
    borderStrong: "border-orange-500",
    blobAccent: "bg-amber-200/30",
  },
  salud_mental: {
    pillActive: "border-violet-600 bg-violet-600 text-white",
    blob: "bg-violet-200/40",
    blobStrong: "bg-violet-300/50",
    button: "bg-violet-600 hover:bg-violet-700",
    ctaGradient: "bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600",
    textGradient: "bg-gradient-to-r from-violet-600 to-fuchsia-500",
    accentText: "text-violet-600",
    badge: "border-violet-200 bg-violet-50 text-violet-700",
    glow: "shadow-violet-200/60",
    ring: "ring-violet-500",
    heroQuery: "therapist counseling session",
    navHover: "hover:bg-violet-50 hover:text-violet-700",
    borderStrong: "border-violet-500",
    blobAccent: "bg-fuchsia-200/30",
  },
};

export const MODALITY_LABELS: Record<Modality, string> = {
  in_person: "Presencial a domicilio",
  online: "Online",
  both: "Presencial y online",
};

export const LEVEL_LABELS: Record<Level, string> = {
  infantil: "Infantil",
  primaria: "Primaria",
  eso: "ESO",
  bachillerato: "Bachillerato",
  universidad: "Universidad",
  adultos: "Adultos",
};

export const LEVEL_ORDER: Level[] = [
  "infantil",
  "primaria",
  "eso",
  "bachillerato",
  "universidad",
  "adultos",
];

// Secciones de nivel superior que estructuran la web. El slug se usa en la URL
// (?categoria=) y debe coincidir exactamente con Subject.category en la base de datos.
export type CategorySection = {
  slug: string;
  label: string;
  description: string;
  vertical: Vertical;
  colors: {
    bg: string;
    border: string;
    text: string;
    ring: string;
  };
  // Búsqueda en inglés para las fotos de Pexels de la página propia de esta
  // categoría (ver /categoria/[slug]) — profesiones y escenas propias de esa
  // rama, para que cada una tenga su propia ambientación visual.
  heroQuery?: string;
};

// Icono de cada categoría (y de Universidad, que no es una categoría de
// materia sino un filtro de nivel). Se usa tanto en la rejilla de globos de
// la home como en la cabecera de la página propia de cada categoría.
export const CATEGORY_ICONS: Record<string, string> = {
  Ciencias: "🔬",
  Humanidades: "📚",
  "Ciencias Sociales": "🗺️",
  Infantil: "🧸",
  Primaria: "🎒",
  Oposiciones: "🏛️",
  "Cursos oficiales": "🌍",
  Universidad: "🎓",
  "Deportes de Combate": "🥊",
  "Deportes de Raqueta": "🎾",
  "Deportes de Equipo": "⚽",
  "Entrenamiento Personal": "💪",
  Yoga: "🧘",
  "Fitness y Bienestar Físico": "🏃",
  "Psicología Clínica": "🧠",
  "Psicología Infantil y Juvenil": "🧒",
  "Terapia de Pareja": "💑",
  "Terapia Familiar": "👨‍👩‍👧",
  "Terapia Cognitivo-Conductual": "🧩",
  "Coaching Personal": "🎯",
  "Mindfulness y Gestión del Estrés": "🌿",
  "Psicopedagogía y Aprendizaje": "📘",
};

export const CATEGORIES: CategorySection[] = [
  {
    slug: "Ciencias",
    label: "Ciencias",
    description: "Matemáticas, física, química, biología, dibujo técnico...",
    vertical: "educacion",
    colors: {
      bg: "bg-sky-50",
      border: "border-sky-200",
      text: "text-sky-700",
      ring: "hover:border-sky-400",
    },
    heroQuery: "scientist laboratory research",
  },
  {
    slug: "Humanidades",
    label: "Humanidades",
    description: "Filosofía, lengua, latín, griego, idiomas...",
    vertical: "educacion",
    colors: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-700",
      ring: "hover:border-violet-400",
    },
    heroQuery: "writer library books reading",
  },
  {
    slug: "Ciencias Sociales",
    label: "Ciencias Sociales",
    description: "Historia, geografía, economía, matemáticas sociales...",
    vertical: "educacion",
    colors: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      ring: "hover:border-orange-400",
    },
    heroQuery: "historian old map globe",
  },
  {
    slug: "Infantil",
    label: "Infantil",
    description: "Educación infantil, estimulación temprana, lectoescritura...",
    vertical: "educacion",
    colors: {
      bg: "bg-pink-50",
      border: "border-pink-200",
      text: "text-pink-700",
      ring: "hover:border-pink-400",
    },
    heroQuery: "kindergarten teacher preschool children",
  },
  {
    slug: "Primaria",
    label: "Primaria",
    description: "Apoyo escolar, refuerzo y técnicas de estudio para Primaria.",
    vertical: "educacion",
    colors: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      ring: "hover:border-yellow-400",
    },
    heroQuery: "primary school teacher classroom",
  },
  {
    slug: "Oposiciones",
    label: "Oposiciones",
    description: "Preparación de las oposiciones más demandadas.",
    vertical: "educacion",
    colors: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      ring: "hover:border-emerald-400",
    },
    heroQuery: "civil servant office exam study",
  },
  {
    slug: "Cursos oficiales",
    label: "Cursos oficiales",
    description: "Preparación de certificaciones oficiales de cualquier idioma.",
    vertical: "educacion",
    colors: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      ring: "hover:border-amber-400",
    },
    heroQuery: "language learning conversation classroom",
  },

  // Deporte
  {
    slug: "Deportes de Combate",
    label: "Deportes de Combate",
    description: "Boxeo, kickboxing, artes marciales, defensa personal...",
    vertical: "deporte",
    colors: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      ring: "hover:border-red-400",
    },
    heroQuery: "boxing martial arts training",
  },
  {
    slug: "Deportes de Raqueta",
    label: "Deportes de Raqueta",
    description: "Tenis, pádel, bádminton...",
    vertical: "deporte",
    colors: {
      bg: "bg-lime-50",
      border: "border-lime-200",
      text: "text-lime-700",
      ring: "hover:border-lime-400",
    },
    heroQuery: "tennis padel racket sport lesson",
  },
  {
    slug: "Deportes de Equipo",
    label: "Deportes de Equipo",
    description: "Fútbol, baloncesto, voleibol...",
    vertical: "deporte",
    colors: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      ring: "hover:border-emerald-400",
    },
    heroQuery: "football basketball team sport training",
  },
  {
    slug: "Entrenamiento Personal",
    label: "Entrenamiento Personal",
    description: "Entrenador personal a domicilio, gimnasio, online...",
    vertical: "deporte",
    colors: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      text: "text-cyan-700",
      ring: "hover:border-cyan-400",
    },
    heroQuery: "personal trainer gym fitness workout",
  },
  {
    slug: "Yoga",
    label: "Yoga",
    description: "Hatha, vinyasa, yoga terapéutico, para embarazadas...",
    vertical: "deporte",
    colors: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-700",
      ring: "hover:border-violet-400",
    },
    heroQuery: "yoga class meditation studio",
  },
  {
    slug: "Fitness y Bienestar Físico",
    label: "Fitness y Bienestar Físico",
    description: "Crossfit, calistenia, musculación, natación, running, pilates, ciclismo...",
    vertical: "deporte",
    colors: {
      bg: "bg-sky-50",
      border: "border-sky-200",
      text: "text-sky-700",
      ring: "hover:border-sky-400",
    },
    heroQuery: "running cycling fitness outdoor",
  },

  // Salud Mental
  {
    slug: "Psicología Clínica",
    label: "Psicología Clínica",
    description: "Ansiedad, depresión, autoestima, duelo...",
    vertical: "salud_mental",
    colors: {
      bg: "bg-fuchsia-50",
      border: "border-fuchsia-200",
      text: "text-fuchsia-700",
      ring: "hover:border-fuchsia-400",
    },
    heroQuery: "psychologist therapy session counseling",
  },
  {
    slug: "Psicología Infantil y Juvenil",
    label: "Psicología Infantil y Juvenil",
    description: "Niños, adolescentes, conducta, desarrollo emocional...",
    vertical: "salud_mental",
    colors: {
      bg: "bg-pink-50",
      border: "border-pink-200",
      text: "text-pink-700",
      ring: "hover:border-pink-400",
    },
    heroQuery: "child psychologist therapy session",
  },
  {
    slug: "Terapia de Pareja",
    label: "Terapia de Pareja",
    description: "Comunicación, crisis de pareja, terapia prematrimonial...",
    vertical: "salud_mental",
    colors: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-700",
      ring: "hover:border-rose-400",
    },
    heroQuery: "couple therapy counseling session",
  },
  {
    slug: "Terapia Familiar",
    label: "Terapia Familiar",
    description: "Conflictos familiares, mediación, dinámica familiar...",
    vertical: "salud_mental",
    colors: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      ring: "hover:border-orange-400",
    },
    heroQuery: "family therapy counseling session",
  },
  {
    slug: "Terapia Cognitivo-Conductual",
    label: "Terapia Cognitivo-Conductual",
    description: "TCC para ansiedad, fobias, hábitos, pensamientos negativos...",
    vertical: "salud_mental",
    colors: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-700",
      ring: "hover:border-indigo-400",
    },
    heroQuery: "cognitive behavioral therapy session",
  },
  {
    slug: "Coaching Personal",
    label: "Coaching Personal",
    description: "Objetivos personales, hábitos, desarrollo profesional...",
    vertical: "salud_mental",
    colors: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      ring: "hover:border-amber-400",
    },
    heroQuery: "life coach personal coaching session",
  },
  {
    slug: "Mindfulness y Gestión del Estrés",
    label: "Mindfulness y Gestión del Estrés",
    description: "Meditación, respiración, manejo del estrés y la ansiedad...",
    vertical: "salud_mental",
    colors: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      ring: "hover:border-emerald-400",
    },
    heroQuery: "mindfulness meditation relaxation",
  },
  {
    slug: "Psicopedagogía y Aprendizaje",
    label: "Psicopedagogía y Aprendizaje",
    description: "Psicopedagogía, logopedia, dificultades del aprendizaje...",
    vertical: "salud_mental",
    colors: {
      bg: "bg-teal-50",
      border: "border-teal-200",
      text: "text-teal-700",
      ring: "hover:border-teal-400",
    },
    heroQuery: "speech therapist child learning support",
  },
];

export const MATERIALS_CATEGORY: CategorySection = {
  slug: "Materiales",
  label: "Materiales",
  description: "Apuntes, ejercicios y recursos que comparten los profesores.",
  vertical: "educacion",
  colors: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    ring: "hover:border-rose-400",
  },
};

// Sección especial: no es una categoría de materia (Subject.category), sino un
// filtro por nivel (Level = universidad) que cruza todas las materias.
export const UNIVERSITY_SECTION: CategorySection = {
  slug: "Universidad",
  label: "Universidad",
  description: "Profesores para cualquier materia a nivel universitario.",
  vertical: "educacion",
  colors: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    ring: "hover:border-indigo-400",
  },
  heroQuery: "university lecture hall students",
};

// Cursos para organizar los Materiales dentro de cada categoría
export const MATERIAL_COURSE_LABELS: Record<MaterialCourse, string> = {
  // Obsoletos: ver la nota en el enum (prisma/schema.prisma). Se conservan
  // aquí solo para poder mostrar materiales antiguos que ya los usaran.
  infantil: "Infantil",
  primaria: "Primaria",
  eso_1: "1º ESO",
  eso_2: "2º ESO",
  eso_3: "3º ESO",
  eso_4: "4º ESO",
  bachillerato_1: "1º Bachillerato",
  bachillerato_2: "2º Bachillerato",
  universidad: "Universidad",
  oposiciones: "Oposiciones",
  a1: "A1",
  a2: "A2",
  b1: "B1",
  b2: "B2",
  c1: "C1",
  c2: "C2",
  infantil_1: "1º Infantil (3 años)",
  infantil_2: "2º Infantil (4 años)",
  infantil_3: "3º Infantil (5 años)",
  primaria_1: "1º Primaria",
  primaria_2: "2º Primaria",
  primaria_3: "3º Primaria",
  primaria_4: "4º Primaria",
  primaria_5: "5º Primaria",
  primaria_6: "6º Primaria",
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
  guias_pacientes: "Guías y recursos para pacientes",
  casos_protocolos: "Casos prácticos y protocolos",
  tests_evaluacion: "Test y escalas de evaluación",
  programaciones: "Programaciones",
};

export const MATERIAL_COURSE_ORDER: MaterialCourse[] = [
  "infantil",
  "primaria",
  "eso_1",
  "eso_2",
  "eso_3",
  "eso_4",
  "bachillerato_1",
  "bachillerato_2",
  "universidad",
  "oposiciones",
  "a1",
  "a2",
  "b1",
  "b2",
  "c1",
  "c2",
  "infantil_1",
  "infantil_2",
  "infantil_3",
  "primaria_1",
  "primaria_2",
  "primaria_3",
  "primaria_4",
  "primaria_5",
  "primaria_6",
  "principiante",
  "intermedio",
  "avanzado",
  "guias_pacientes",
  "casos_protocolos",
  "tests_evaluacion",
  "programaciones",
];

// "Programaciones" (programaciones didácticas, planes de entrenamiento,
// programas de intervención) se añade dentro de todas las categorías de
// Materiales, en las tres ramas — por eso se concatena en cada lista de
// abajo en vez de vivir en una sola.
const PROGRAMACIONES: MaterialCourse[] = ["programaciones"];

// Qué cursos tiene sentido mostrar dentro de cada categoría de Materiales.
// Ciencias, Humanidades... van de 1º ESO a Universidad.
const ACADEMIC_COURSES: MaterialCourse[] = [
  "eso_1",
  "eso_2",
  "eso_3",
  "eso_4",
  "bachillerato_1",
  "bachillerato_2",
  "universidad",
  ...PROGRAMACIONES,
];

// Segundo ciclo de Educación Infantil (LOMLOE): 3, 4 y 5 años.
const INFANTIL_COURSES: MaterialCourse[] = [
  "infantil_1",
  "infantil_2",
  "infantil_3",
  ...PROGRAMACIONES,
];

// Educación Primaria (LOMLOE): 1º a 6º.
const PRIMARIA_COURSES: MaterialCourse[] = [
  "primaria_1",
  "primaria_2",
  "primaria_3",
  "primaria_4",
  "primaria_5",
  "primaria_6",
  ...PROGRAMACIONES,
];

// Niveles del Marco Común Europeo de Referencia (MCER/CEFR): el estándar
// común a las certificaciones oficiales de idiomas (Cambridge, EOI, DELF/
// DALF, Goethe-Institut, CELI...), independientemente del idioma. De momento
// mostramos los seis niveles completos, que son los más solicitados.
const LANGUAGE_LEVELS: MaterialCourse[] = ["a1", "a2", "b1", "b2", "c1", "c2", ...PROGRAMACIONES];

// Deporte: no hay "curso" académico, así que los materiales se organizan
// por nivel de progresión — vale igual para artes marciales, un deporte de
// equipo, entrenamiento personal, yoga o fitness en general.
const DEPORTE_LEVELS: MaterialCourse[] = [
  "principiante",
  "intermedio",
  "avanzado",
  ...PROGRAMACIONES,
];

// Salud Mental: aquí lo que organiza mejor los materiales no es un nivel,
// sino el tipo de recurso (para dar al paciente, para el propio
// profesional, o herramientas de evaluación) — vale para cualquiera de sus
// especialidades.
const SALUD_MENTAL_RESOURCE_TYPES: MaterialCourse[] = [
  "guias_pacientes",
  "casos_protocolos",
  "tests_evaluacion",
  ...PROGRAMACIONES,
];

const CATEGORY_COURSES: Record<string, MaterialCourse[]> = {
  Infantil: INFANTIL_COURSES,
  Primaria: PRIMARIA_COURSES,
  Oposiciones: ["oposiciones"],
  "Cursos oficiales": LANGUAGE_LEVELS,

  // Deporte
  "Deportes de Combate": DEPORTE_LEVELS,
  "Deportes de Raqueta": DEPORTE_LEVELS,
  "Deportes de Equipo": DEPORTE_LEVELS,
  "Entrenamiento Personal": DEPORTE_LEVELS,
  Yoga: DEPORTE_LEVELS,
  "Fitness y Bienestar Físico": DEPORTE_LEVELS,

  // Salud Mental
  "Psicología Clínica": SALUD_MENTAL_RESOURCE_TYPES,
  "Psicología Infantil y Juvenil": SALUD_MENTAL_RESOURCE_TYPES,
  "Terapia de Pareja": SALUD_MENTAL_RESOURCE_TYPES,
  "Terapia Familiar": SALUD_MENTAL_RESOURCE_TYPES,
  "Terapia Cognitivo-Conductual": SALUD_MENTAL_RESOURCE_TYPES,
  "Coaching Personal": SALUD_MENTAL_RESOURCE_TYPES,
  "Mindfulness y Gestión del Estrés": SALUD_MENTAL_RESOURCE_TYPES,
  "Psicopedagogía y Aprendizaje": SALUD_MENTAL_RESOURCE_TYPES,
};

export function getCoursesForCategory(categorySlug: string): MaterialCourse[] {
  return CATEGORY_COURSES[categorySlug] ?? ACADEMIC_COURSES;
}
