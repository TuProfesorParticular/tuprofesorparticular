// Contenido de la página de Preguntas Frecuentes (/preguntas-frecuentes).
// Se agrupa por apartado de la web y cada pregunta se etiqueta según a
// quién le interesa (alumno / profesor / todos) para poder filtrar en la
// página. Mantener las respuestas cortas y en el mismo tono que el resto
// del sitio. Si cambia un precio o una regla de negocio, actualizar aquí
// también (los números viven en @/lib/plans y @/lib/regions).

export type FaqAudience = "todos" | "alumno" | "profesor";

export type FaqItem = {
  q: string;
  a: string;
  audience: FaqAudience;
  // Enlace opcional "ver más" a la sección relevante de la web.
  more?: { label: string; href: string };
};

export type FaqCategory = {
  id: string;
  icon: string;
  title: string;
  items: FaqItem[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "cuenta",
    icon: "👤",
    title: "Cuenta y registro",
    items: [
      {
        q: "¿Cuánto cuesta registrarse?",
        a: "Nada. Crear una cuenta es gratis, tanto para alumnos como para profesionales. Los profesionales solo pagan si eligen un plan de pago para tener más visibilidad.",
        audience: "todos",
      },
      {
        q: "¿Me registro como alumno o como profesional?",
        a: "Al crear la cuenta eliges una de las dos opciones. Si te registras como profesional, además indicas tu categoría: profesor particular, entrenador deportivo o profesional de la salud mental. Ese dato marca el color de tu panel y a qué tipo de centros puedes enviar tu CV.",
        audience: "todos",
        more: { label: "Crear cuenta", href: "/registro" },
      },
      {
        q: "¿Puedo tener una cuenta de alumno y otra de profesional?",
        a: "Cada cuenta es de un solo tipo. Si necesitas las dos cosas, crea una segunda cuenta con otro correo electrónico.",
        audience: "todos",
      },
      {
        q: "¿Por qué tengo que verificar mi correo?",
        a: "Para confirmar que la dirección es tuya y poder avisarte de mensajes nuevos. Te enviamos un enlace al registrarte; si no llega, revisa spam o pide otro desde la pantalla de inicio de sesión.",
        audience: "todos",
      },
      {
        q: "He olvidado mi contraseña.",
        a: "Desde la pantalla de inicio de sesión, pulsa en «¿Has olvidado tu contraseña?» y te enviaremos un enlace para elegir una nueva. El enlace caduca en una hora.",
        audience: "todos",
        more: { label: "Recuperar contraseña", href: "/recuperar-contrasena" },
      },
      {
        q: "¿Cómo descargo mis datos o elimino mi cuenta?",
        a: "En tu panel, en «Mi cuenta», puedes descargar una copia de tus datos y solicitar la eliminación de la cuenta.",
        audience: "todos",
        more: { label: "Mi cuenta", href: "/panel/cuenta" },
      },
    ],
  },
  {
    id: "buscar",
    icon: "🔍",
    title: "Buscar y contactar (alumnos)",
    items: [
      {
        q: "¿Cómo busco profesor?",
        a: "Desde la página principal, escribe la materia o disciplina y, si quieres, tu ciudad. También puedes explorar por categorías. Cada anuncio muestra precio, modalidad (online o presencial) y valoraciones.",
        audience: "alumno",
      },
      {
        q: "¿Cuánto cuesta contactar con un profesional?",
        a: "El contacto es gratis. Puedes escribir a todos los profesionales que quieras por la mensajería interna, sin límite y sin coste.",
        audience: "alumno",
      },
      {
        q: "¿La plataforma se queda una parte de lo que pago?",
        a: "Solo en la primera clase que reservas con cada profesional nuevo a través de la web: sobre esa primera clase hay un 20% de gestión. A partir de la segunda clase con ese mismo profesional, lo acordáis directamente entre vosotros y la plataforma no cobra nada.",
        audience: "alumno",
      },
      {
        q: "¿Cómo reservo y pago la primera clase?",
        a: "Desde el anuncio del profesional, con el botón de reservar. El pago es seguro a través de Stripe. Después de esa primera clase, vosotros decidís cómo continuar.",
        audience: "alumno",
      },
      {
        q: "¿Y si el profesional no me responde o no me encaja?",
        a: "No hay ningún compromiso hasta que reservas. Puedes escribir a varios a la vez y quedarte con quien mejor te venga.",
        audience: "alumno",
      },
      {
        q: "¿Puedo pedir yo que los profesores me encuentren?",
        a: "Sí. En tu panel puedes publicar un anuncio de «busco profesor» explicando qué necesitas. Los profesionales con plan de pago pueden verlo y escribirte.",
        audience: "alumno",
        more: { label: "Mis anuncios", href: "/panel/anuncios" },
      },
      {
        q: "¿Puedo dejar una valoración?",
        a: "Sí, si has reservado una primera clase con ese profesional. Puedes puntuar de 1 a 5 estrellas y dejar un comentario, que aparecerá en su anuncio.",
        audience: "alumno",
      },
    ],
  },
  {
    id: "anuncio",
    icon: "📝",
    title: "Tu anuncio (profesionales)",
    items: [
      {
        q: "¿Cómo publico mi anuncio?",
        a: "Regístrate como profesional y completa tu perfil en «Mi anuncio»: materias o disciplinas, precio, modalidad, zona y disponibilidad. Antes de aparecer en las búsquedas, un administrador lo revisa.",
        audience: "profesor",
        more: { label: "Mi anuncio", href: "/panel/perfil" },
      },
      {
        q: "¿Por qué mi anuncio está «pendiente de aprobación»?",
        a: "Revisamos manualmente cada anuncio nuevo para mantener la calidad de la plataforma. Suele tardar poco. Mientras tanto puedes seguir editándolo.",
        audience: "profesor",
      },
      {
        q: "¿Cuántas materias o disciplinas puedo ofrecer?",
        a: "Con el plan Básico, una. Con Pro, hasta dos. Con Premium, sin límite.",
        audience: "profesor",
      },
      {
        q: "¿Puedo poner el precio que quiera?",
        a: "Sí. Tú fijas tu tarifa por hora y puedes cambiarla cuando quieras desde «Mi anuncio».",
        audience: "profesor",
      },
      {
        q: "¿Cómo consigo aparecer más arriba en los resultados?",
        a: "Los planes de pago dan prioridad: Pro aparece destacado sobre los anuncios gratuitos y Premium tiene la prioridad máxima. También ayuda tener el perfil completo y buenas valoraciones.",
        audience: "profesor",
        more: { label: "Ver planes", href: "/panel/suscripcion" },
      },
    ],
  },
  {
    id: "planes",
    icon: "⭐",
    title: "Planes y suscripción (profesionales)",
    items: [
      {
        q: "¿Qué incluye cada plan?",
        a: "Básico: anuncio en las búsquedas, una materia y mensajería ilimitada. Pro (9,99 €/mes): hasta 2 materias, anuncio destacado, materiales ilimitados y contacto con alumnos que buscan profesor. Premium (19,99 €/mes): todo lo anterior sin límite de materias, prioridad máxima y estadísticas de tu anuncio.",
        audience: "profesor",
        more: { label: "Ver planes", href: "/panel/suscripcion" },
      },
      {
        q: "¿Qué es el programa de profesional fundador?",
        a: "Los 100 primeros profesionales de cada categoría (Educación, Deporte y Salud Mental) consiguen el plan Pro gratis durante 3 meses. Al terminar, pasan automáticamente a su precio de fundador: 4,99 €/mes en Pro u 8,99 €/mes en Premium, más barato que el precio normal.",
        audience: "profesor",
      },
      {
        q: "¿Hay permanencia?",
        a: "No. Puedes cancelar cuando quieras desde «Mi suscripción», sin coste adicional. Mantienes el plan hasta el final del periodo que ya has pagado.",
        audience: "profesor",
      },
      {
        q: "¿Cómo puedo pagar menos compartiendo materiales?",
        a: "Si tienes un plan de pago al precio normal (no el de fundador), aportar al menos un material aprobado cada mes te rebaja 3 € fijos la cuota de ese mes, subas uno o varios. Se recalcula cada mes: si un mes no subes nada, la cuota vuelve a su precio.",
        audience: "profesor",
        more: { label: "Materiales", href: "/panel/materiales" },
      },
      {
        q: "¿Cómo cambio o cancelo mi plan?",
        a: "Desde «Mi suscripción», en tu panel. Ahí puedes subir o bajar de plan y gestionar el método de pago o la cancelación.",
        audience: "profesor",
        more: { label: "Mi suscripción", href: "/panel/suscripcion" },
      },
    ],
  },
  {
    id: "cobros",
    icon: "💳",
    title: "Cobros y comisión (profesionales)",
    items: [
      {
        q: "¿Cómo cobro la primera clase de un alumno?",
        a: "Primero conecta tu cuenta bancaria en el apartado «Cobros» de tu panel (lo gestiona Stripe). A partir de ahí, cuando un alumno nuevo reserva contigo por la web, ese pago pasa por la plataforma y Stripe te transfiere el importe menos la comisión.",
        audience: "profesor",
        more: { label: "Cobros", href: "/panel/pagos" },
      },
      {
        q: "¿Qué comisión cobra la plataforma?",
        a: "Un 20% de gestión, y solo sobre la primera clase que te reserva por la web cada alumno nuevo. A partir de la segunda clase con ese alumno, el 100% es para ti. La cuota mensual de tu plan es independiente de esto.",
        audience: "profesor",
      },
      {
        q: "¿Puedo ver un ejemplo con números?",
        a: "Sí. En «Mi suscripción» hay un simulador: pones cuántos alumnos nuevos esperas al mes y el precio de tu primera clase, y te muestra cuánto retendría la plataforma y cuánto recibirías tú.",
        audience: "profesor",
        more: { label: "Mi suscripción", href: "/panel/suscripcion" },
      },
      {
        q: "¿Las clases siguientes también pasan por la plataforma?",
        a: "No es obligatorio. La plataforma cubre esa primera clase para dar seguridad a ambas partes; a partir de ahí tú y el alumno acordáis cómo seguir.",
        audience: "profesor",
      },
    ],
  },
  {
    id: "materiales",
    icon: "📁",
    title: "Materiales",
    items: [
      {
        q: "¿Qué es la sección de Materiales?",
        a: "Una biblioteca de apuntes y recursos. Cualquiera puede consultarlos; los profesionales pueden subir los suyos.",
        audience: "todos",
        more: { label: "Ver materiales", href: "/materiales" },
      },
      {
        q: "¿Quién revisa los materiales que subo?",
        a: "Un administrador los aprueba antes de que se publiquen, para comprobar que el contenido es adecuado y no infringe derechos de autor.",
        audience: "profesor",
      },
      {
        q: "¿Gano algo por subir materiales?",
        a: "Aportar materiales aprobados te da el descuento de 3 € al mes en tu cuota, si tienes un plan de pago al precio normal. Además, tus materiales enlazan a tu anuncio, así que también son visibilidad.",
        audience: "profesor",
      },
    ],
  },
  {
    id: "tu-cv",
    icon: "📤",
    title: "Tu CV (envío a centros)",
    items: [
      {
        q: "¿Qué es «Tu CV»?",
        a: "Un servicio para enviar tu CV de golpe a los centros de tu sector (colegios, gimnasios y clubes, o clínicas y centros de psicología, según tu categoría) en una comunidad autónoma o en toda España, sin tener que buscar tú los correos uno a uno.",
        audience: "profesor",
        more: { label: "Tu CV", href: "/tu-cv" },
      },
      {
        q: "¿Cuánto cuesta y es una suscripción?",
        a: "Es un pago único, no una suscripción: 15 € por comunidad autónoma o 69 € por toda España. Pagas una vez y ese envío queda hecho.",
        audience: "profesor",
      },
      {
        q: "¿A qué centros se envía exactamente?",
        a: "A los de tu categoría dentro de la zona que compras. Después del pago eliges las provincias y puedes quitar a mano de la lista los centros a los que no quieras escribir.",
        audience: "profesor",
      },
      {
        q: "¿Puedo adjuntar una carta de recomendación y referencias?",
        a: "Sí. Al preparar el envío puedes subir una carta de recomendación (PDF o Word) y escribir tus referencias (personas de contacto que pueden avalarte). Se incluyen junto con tu CV en el correo que reciben los centros.",
        audience: "profesor",
      },
      {
        q: "¿Qué ven los centros y cómo me contestan?",
        a: "Reciben tu nombre, tu mensaje de presentación, tu CV y, si los añades, tu carta de recomendación y tus referencias. Responden directamente a tu correo electrónico; la plataforma no interviene en esa conversación.",
        audience: "profesor",
      },
      {
        q: "¿Cuándo se hace el envío?",
        a: "Tras pagar, entras a completar el envío (subir el CV y elegir centros). En cuanto lo confirmas, se envía automáticamente. Ese paso de confirmación solo se puede hacer una vez por compra.",
        audience: "profesor",
      },
    ],
  },
  {
    id: "mensajes",
    icon: "💬",
    title: "Mensajes y avisos",
    items: [
      {
        q: "¿Cómo funcionan los mensajes?",
        a: "Toda la conversación ocurre dentro de la plataforma, en el apartado «Mensajes» de tu panel. Cuando recibes un mensaje nuevo te avisamos por correo.",
        audience: "todos",
        more: { label: "Mensajes", href: "/panel/mensajes" },
      },
      {
        q: "Recibo demasiados correos.",
        a: "Los avisos por correo son solo de cosas importantes (mensajes nuevos, estado de tu anuncio o de un pago). Si algo te llega y no lo esperas, escríbenos a contacto@tuprofesorparticular.es.",
        audience: "todos",
      },
    ],
  },
  {
    id: "privacidad",
    icon: "🔒",
    title: "Privacidad y datos",
    items: [
      {
        q: "¿Qué hacéis con mis datos?",
        a: "Solo usamos tus datos para que la plataforma funcione: mostrar tu anuncio si eres profesional, permitir el contacto y gestionar los pagos. No vendemos datos a terceros. Tienes el detalle completo en la Política de Privacidad.",
        audience: "todos",
        more: { label: "Política de Privacidad", href: "/privacidad" },
      },
      {
        q: "¿Mi correo es visible para otros usuarios?",
        a: "No en la web. Los alumnos y profesionales se escriben por la mensajería interna. En «Tu CV», los centros sí reciben tu correo, porque el objetivo es justamente que te puedan contestar.",
        audience: "todos",
      },
      {
        q: "¿Cómo comunico un problema o una mala conducta?",
        a: "Tienes un canal ético para informar de cualquier incidencia, de forma confidencial.",
        audience: "todos",
        more: { label: "Canal ético", href: "/canal-etico" },
      },
    ],
  },
];

export function filterFaqByAudience(
  categories: FaqCategory[],
  audience: FaqAudience | "all",
): FaqCategory[] {
  if (audience === "all") return categories;
  return categories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) => item.audience === "todos" || item.audience === audience,
      ),
    }))
    .filter((cat) => cat.items.length > 0);
}
