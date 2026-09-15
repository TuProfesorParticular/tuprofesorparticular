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
  },
};

export function isVertical(value: string): value is Vertical {
  return value === "educacion" || value === "deporte" || value === "salud_mental";
}
