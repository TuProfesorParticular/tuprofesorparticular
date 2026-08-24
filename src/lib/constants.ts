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
  button: string;
  accentText: string;
  heroWash: string;
  heroQuery: string;
};

export const VERTICAL_THEME: Record<Vertical, VerticalTheme> = {
  educacion: {
    pillActive: "border-teal-600 bg-teal-600 text-white",
    blob: "bg-teal-200/40",
    button: "bg-teal-600 hover:bg-teal-700",
    accentText: "text-teal-600",
    heroWash: "from-teal-100/60 via-white/80 to-white",
    heroQuery: "tutor teaching student",
  },
  deporte: {
    pillActive: "border-orange-600 bg-orange-600 text-white",
    blob: "bg-orange-200/40",
    button: "bg-orange-600 hover:bg-orange-700",
    accentText: "text-orange-600",
    heroWash: "from-orange-100/60 via-white/80 to-white",
    heroQuery: "personal trainer coaching athlete",
  },
  salud_mental: {
    pillActive: "border-violet-600 bg-violet-600 text-white",
    blob: "bg-violet-200/40",
    button: "bg-violet-600 hover:bg-violet-700",
    accentText: "text-violet-600",
    heroWash: "from-violet-100/60 via-white/80 to-white",
    heroQuery: "therapist counseling session",
  },
};

export const MODALITY_LABELS: Record<Modality, string> = {
  in_person: "Presencial a domicilio",
  online: "Online",
  both: "Presencial y online",
};

export const LEVEL_LABELS: Record<Level, string> = {
  primaria: "Primaria",
  eso: "ESO",
  bachillerato: "Bachillerato",
  universidad: "Universidad",
  adultos: "Adultos",
};

export const LEVEL_ORDER: Level[] = [
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
  },
  {
    slug: "Deportes de Raqueta y Equipo",
    label: "Deportes de Raqueta y Equipo",
    description: "Tenis, pádel, fútbol, baloncesto, voleibol...",
    vertical: "deporte",
    colors: {
      bg: "bg-lime-50",
      border: "border-lime-200",
      text: "text-lime-700",
      ring: "hover:border-lime-400",
    },
  },
  {
    slug: "Fitness y Bienestar Físico",
    label: "Fitness y Bienestar Físico",
    description: "Entrenamiento personal, crossfit, natación, yoga, running...",
    vertical: "deporte",
    colors: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      text: "text-cyan-700",
      ring: "hover:border-cyan-400",
    },
  },

  // Salud Mental
  {
    slug: "Psicología y Terapia",
    label: "Psicología y Terapia",
    description: "Psicología clínica, infantil, terapia de pareja y familiar...",
    vertical: "salud_mental",
    colors: {
      bg: "bg-fuchsia-50",
      border: "border-fuchsia-200",
      text: "text-fuchsia-700",
      ring: "hover:border-fuchsia-400",
    },
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
};

// Cursos para organizar los Materiales dentro de cada categoría
export const MATERIAL_COURSE_LABELS: Record<MaterialCourse, string> = {
  eso_1: "1º ESO",
  eso_2: "2º ESO",
  eso_3: "3º ESO",
  eso_4: "4º ESO",
  bachillerato_1: "1º Bachillerato",
  bachillerato_2: "2º Bachillerato",
  universidad: "Universidad",
  oposiciones: "Oposiciones",
};

export const MATERIAL_COURSE_ORDER: MaterialCourse[] = [
  "eso_1",
  "eso_2",
  "eso_3",
  "eso_4",
  "bachillerato_1",
  "bachillerato_2",
  "universidad",
  "oposiciones",
];
