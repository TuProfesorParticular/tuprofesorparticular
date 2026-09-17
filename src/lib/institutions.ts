import type { Vertical } from "@prisma/client";

// Textos y opciones de "Enviar CV" específicos de cada ámbito de la web:
// un profesor manda su CV a colegios, un entrenador a gimnasios/clubes y un
// psicólogo a clínicas/gabinetes. El flujo (comprar → subir CV → elegir
// centros → enviar) es exactamente el mismo para los tres — solo cambia
// este texto. Ver InstitutionContact y CvCampaign en prisma/schema.prisma.
export type InstitutionCopy = {
  // Icono del tipo de centro (no del ámbito del profesional): 🏫 colegio,
  // 🏋️ gimnasio/club, 🏥 clínica/gabinete.
  icon: string;
  // "colegios" / "gimnasios y clubes" / "clínicas y centros de psicología"
  pluralLower: string;
  // Versión larga para textos descriptivos
  pluralDescriptive: string;
  // "colegio" / "centro deportivo" / "centro de psicología"
  singularLower: string;
  // Opciones orientativas para el campo "tipo" en el admin (sin restricción real)
  typeOptions: string[];
  heroKicker: string;
  heroTitle: string;
  heroDescription: string;
  // Copy del email que reciben los centros
  emailSubjectRole: string;
  emailIntroRole: string;
  // Copy del aviso general de la plataforma (no ligado a un profesor
  // concreto) — ver sendPlatformOutreachEmail.
  outreachSubject: string;
  outreachBody: string;
};

export const INSTITUTION_COPY: Record<Vertical, InstitutionCopy> = {
  educacion: {
    icon: "🏫",
    pluralLower: "colegios",
    pluralDescriptive: "colegios privados y concertados",
    singularLower: "colegio",
    typeOptions: ["Privado", "Concertado"],
    heroKicker: "ENVÍO DE CV PARA DOCENTES",
    heroTitle: "Tu CV en colegios privados y concertados",
    heroDescription:
      "Llega a centros educativos sin pasarte semanas buscando correos y formularios.",
    emailSubjectRole: "Candidatura docente",
    emailIntroRole: "incorporarse a su equipo docente",
    outreachSubject: "Profesores particulares — TuProfesorParticular",
    outreachBody:
      "Le escribimos desde TuProfesorParticular, una plataforma donde profesores particulares publican su anuncio gratis y contactan directamente con alumnos, sin intermediarios ni comisiones sobre las clases habituales. Si en su centro hay docentes que compaginan la enseñanza con clases particulares, o quiere dar a conocer esta opción entre las familias, puede interesarles.",
  },
  deporte: {
    icon: "🏋️",
    pluralLower: "gimnasios y clubes",
    pluralDescriptive: "gimnasios, clubes y centros de entrenamiento",
    singularLower: "centro deportivo",
    typeOptions: ["Gimnasio", "Club deportivo", "Centro de entrenamiento", "Federación"],
    heroKicker: "ENVÍO DE CV PARA ENTRENADORES",
    heroTitle: "Tu CV en gimnasios y clubes deportivos",
    heroDescription:
      "Llega a centros deportivos sin pasarte semanas buscando correos y formularios.",
    emailSubjectRole: "Candidatura como entrenador/a",
    emailIntroRole: "incorporarse a su equipo",
    outreachSubject: "Entrenadores personales — TuProfesorParticular",
    outreachBody:
      "Le escribimos desde TuProfesorParticular, una plataforma donde entrenadores personales publican su anuncio gratis y contactan directamente con nuevos clientes. Si en su centro hay entrenadores que buscan ampliar su cartera de clientes de forma independiente, puede interesarles conocernos.",
  },
  salud_mental: {
    icon: "🏥",
    pluralLower: "clínicas y centros de psicología",
    pluralDescriptive: "clínicas, gabinetes y centros de psicología",
    singularLower: "centro de psicología",
    typeOptions: ["Clínica", "Gabinete", "Centro de salud mental"],
    heroKicker: "ENVÍO DE CV PARA PROFESIONALES DE LA SALUD MENTAL",
    heroTitle: "Tu CV en clínicas y centros de psicología",
    heroDescription:
      "Llega a centros de salud mental sin pasarte semanas buscando correos y formularios.",
    emailSubjectRole: "Candidatura profesional",
    emailIntroRole: "incorporarse a su equipo de profesionales",
    outreachSubject: "Psicólogos y terapeutas — TuProfesorParticular",
    outreachBody:
      "Le escribimos desde TuProfesorParticular, una plataforma donde psicólogos y terapeutas publican su anuncio gratis y contactan directamente con pacientes. Si en su centro hay profesionales que buscan ampliar su consulta privada de forma independiente, puede interesarles conocernos.",
  },
};

export function isVertical(value: string): value is Vertical {
  return value === "educacion" || value === "deporte" || value === "salud_mental";
}
