import { Resend } from "resend";
import type { Vertical } from "@prisma/client";
import { INSTITUTION_COPY } from "@/lib/institutions";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM || "TuProfesorParticular <no-reply@tuprofesorparticular.es>";
const APP_URL = process.env.APP_URL || "http://localhost:3000";
// Buzón del administrador — donde llegan los avisos del apartado
// "Sugerencias" del panel. Configurable por si el contacto público
// (contacto@...) y el buzón que revisa el admin no son el mismo.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "contacto@tuprofesorparticular.es";

// Plantilla visual compartida por todos los correos: cabecera con la marca,
// tarjeta blanca con el contenido propio de cada función, y un pie de
// página genérico — así ningún email sale en texto plano sin más.
function renderEmailShell(bodyHtml: string): string {
  return `
  <div style="background-color:#f5f5f4;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;">
      <div style="text-align:center;padding-bottom:24px;">
        <span style="font-size:22px;font-weight:800;color:#1c1917;letter-spacing:-0.02em;">
          Tu<span style="color:#0d9488;">Profesor</span>Particular
        </span>
      </div>
      <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(28,25,23,0.08);">
        <div style="height:4px;background:linear-gradient(90deg,#0d9488,#ea580c,#7c3aed);"></div>
        <div style="padding:32px;color:#292524;font-size:14px;line-height:1.6;">
          ${bodyHtml}
        </div>
      </div>
      <div style="text-align:center;padding-top:24px;font-size:12px;color:#a8a29e;">
        TuProfesorParticular · <a href="${APP_URL}" style="color:#a8a29e;">tuprofesorparticular.es</a>
      </div>
    </div>
  </div>`;
}

// Botón de llamada a la acción, consistente en todos los correos que lo usan.
function emailButton(
  url: string,
  label: string,
  variant: "primary" | "secondary" = "primary",
): string {
  const bg = variant === "primary" ? "#0d9488" : "#ffffff";
  const color = variant === "primary" ? "#ffffff" : "#0d9488";
  const border = variant === "primary" ? "none" : "1px solid #0d9488";
  return `<a href="${url}" style="display:inline-block;background:${bg};color:${color};border:${border};font-weight:600;font-size:14px;padding:11px 22px;border-radius:9999px;text-decoration:none;">${label}</a>`;
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log(`[mailer] RESEND_API_KEY no configurada. Email simulado:
  Para: ${to}
  Asunto: ${subject}
  ${html}`);
    return;
  }
  await resend.emails.send({ from: FROM, to, subject, html: renderEmailShell(html) });
}

export function sendVerificationEmail(email: string, token: string) {
  const url = `${APP_URL}/verificar-email?token=${token}&email=${encodeURIComponent(email)}`;
  return sendEmail(
    email,
    "Verifica tu email — TuProfesorParticular",
    `<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1c1917;">¡Bienvenido/a! 🎉</p>
     <p style="margin:0 0 24px;color:#57534e;">
       Ya casi está. Confirma tu email para activar tu cuenta y empezar a
       usar TuProfesorParticular.
     </p>
     <div style="text-align:center;">${emailButton(url, "Verificar mi email")}</div>
     <p style="margin:24px 0 0;color:#a8a29e;font-size:12px;">
       Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
       <a href="${url}" style="color:#0d9488;word-break:break-all;">${url}</a>
     </p>`,
  );
}

export function sendPasswordResetEmail(email: string, token: string) {
  const url = `${APP_URL}/restablecer-contrasena?token=${token}`;
  return sendEmail(
    email,
    "Recupera tu contraseña — TuProfesorParticular",
    `<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1c1917;">Recupera tu contraseña</p>
     <p style="margin:0 0 24px;color:#57534e;">
       Hemos recibido una solicitud para restablecer la contraseña de tu
       cuenta. Elige una nueva contraseña desde este enlace, que caduca en
       <strong>1 hora</strong>:
     </p>
     <div style="text-align:center;">${emailButton(url, "Elegir nueva contraseña")}</div>
     <p style="margin:24px 0 0;color:#a8a29e;font-size:12px;">
       Si no has sido tú, puedes ignorar este correo — tu contraseña seguirá
       siendo la misma.<br/>
       Si el botón no funciona, copia y pega este enlace:
       <a href="${url}" style="color:#0d9488;word-break:break-all;">${url}</a>
     </p>`,
  );
}

export function sendNewMessageEmail(
  email: string,
  senderName: string,
  conversationUrl: string,
) {
  return sendEmail(
    email,
    `Nuevo mensaje de ${senderName} — TuProfesorParticular`,
    `<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1c1917;">📬 Tienes un mensaje nuevo</p>
     <p style="margin:0 0 24px;color:#57534e;">
       <strong>${toSafeHtml(senderName)}</strong> te ha escrito en TuProfesorParticular.
     </p>
     <div style="text-align:center;">${emailButton(conversationUrl, "Ver conversación")}</div>`,
  );
}

// Recibo para el alumno y aviso para el profesional cuando se paga la
// primera clase (ver el webhook de Stripe, checkout.session.completed).
// Antes de esto, un pago real no generaba ningún email de confirmación.
export function sendBookingConfirmedEmails(params: {
  studentName: string;
  studentEmail: string;
  teacherName: string;
  teacherEmail: string;
  amount: number;
  platformFeeAmount: number;
  teacherProfileId: string;
}) {
  const {
    studentName,
    studentEmail,
    teacherName,
    teacherEmail,
    amount,
    platformFeeAmount,
    teacherProfileId,
  } = params;
  const amountLabel = `${amount.toFixed(2)}€`;
  const netAmountLabel = `${(amount - platformFeeAmount).toFixed(2)}€`;
  const teacherUrl = `${APP_URL}/profesores/${teacherProfileId}`;
  const messagesUrl = `${APP_URL}/panel/mensajes`;

  return Promise.all([
    sendEmail(
      studentEmail,
      `Reserva confirmada con ${teacherName} — TuProfesorParticular`,
      `<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1c1917;">✅ ¡Reserva confirmada!</p>
       <p style="margin:0 0 20px;color:#57534e;">
         Tu primera clase con <strong>${toSafeHtml(teacherName)}</strong> está pagada y
         confirmada.
       </p>
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdfa;border-radius:12px;">
         <tr>
           <td style="padding:16px 20px;">
             <span style="font-size:12px;color:#78716c;">Pagado de forma segura con Stripe</span><br/>
             <span style="font-size:22px;font-weight:800;color:#1c1917;">${amountLabel}</span>
           </td>
         </tr>
       </table>
       <p style="margin:20px 0;color:#57534e;">
         Ahora podéis acordar el día y la hora directamente. A partir de la segunda
         clase, el pago lo acordáis vosotros — la plataforma no vuelve a intervenir.
       </p>
       <div style="text-align:center;">${emailButton(teacherUrl, `Ver el anuncio de ${teacherName}`)}</div>`,
    ),
    sendEmail(
      teacherEmail,
      `Nueva reserva pagada de ${studentName} — TuProfesorParticular`,
      `<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1c1917;">💰 ¡Nueva reserva pagada!</p>
       <p style="margin:0 0 20px;color:#57534e;">
         <strong>${toSafeHtml(studentName)}</strong> acaba de pagar su primera clase contigo.
       </p>
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdfa;border-radius:12px;">
         <tr>
           <td align="center" style="padding:16px 8px;">
             <div style="font-size:12px;color:#78716c;">Importe pagado</div>
             <div style="font-size:20px;font-weight:800;color:#1c1917;margin-top:2px;">${amountLabel}</div>
           </td>
           <td align="center" style="padding:16px 8px;">
             <div style="font-size:12px;color:#78716c;">Recibirás</div>
             <div style="font-size:20px;font-weight:800;color:#0d9488;margin-top:2px;">${netAmountLabel}</div>
           </td>
         </tr>
       </table>
       <p style="margin:20px 0;color:#57534e;">Escríbele para acordar el día y la hora:</p>
       <div style="text-align:center;">${emailButton(messagesUrl, "Ver mensajes")}</div>`,
    ),
  ]);
}

// Aviso al administrador cuando un alumno pide el reembolso de una primera
// clase pagada (ver /panel/reservas) — hasta ahora esa solicitud no llegaba
// a ningún sitio, solo quedaría anotada en la base de datos.
export function sendNewRefundRequestEmail(params: {
  studentName: string;
  studentEmail: string;
  teacherName: string;
  amount: number;
  reason: string;
}) {
  const { studentName, studentEmail, teacherName, amount, reason } = params;
  return sendEmail(
    ADMIN_EMAIL,
    `Solicitud de reembolso — ${studentName}`,
    `<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1c1917;">💸 Solicitud de reembolso</p>
     <p style="margin:0 0 16px;color:#57534e;">
       <strong>${toSafeHtml(studentName)}</strong> (${studentEmail}) ha solicitado el
       reembolso de <strong>${amount.toFixed(2)}€</strong> pagados por la primera clase con
       <strong>${toSafeHtml(teacherName)}</strong>:
     </p>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
       <tr>
         <td style="padding:12px 16px;background:#fafaf9;border-left:3px solid #a8a29e;border-radius:6px;font-size:13px;color:#44403c;white-space:pre-wrap;">${toSafeHtml(reason)}</td>
       </tr>
     </table>
     <div style="text-align:center;margin-top:20px;">${emailButton(`${APP_URL}/admin`, "Revisar en administración")}</div>`,
  );
}

// Avisa al alumno cuando el administrador resuelve su solicitud de
// reembolso, ya sea aprobándola (con el cargo ya devuelto en Stripe) o
// descartándola.
export function sendRefundResolvedEmail(params: {
  studentEmail: string;
  teacherName: string;
  amount: number;
  approved: boolean;
}) {
  const { studentEmail, teacherName, amount, approved } = params;
  return sendEmail(
    studentEmail,
    approved
      ? "Tu reembolso ha sido procesado — TuProfesorParticular"
      : "Sobre tu solicitud de reembolso — TuProfesorParticular",
    approved
      ? `<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1c1917;">✅ Reembolso procesado</p>
         <p style="margin:0 0 20px;color:#57534e;">
           Hemos procesado el reembolso de tu primera clase con
           <strong>${toSafeHtml(teacherName)}</strong>.
         </p>
         <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdfa;border-radius:12px;">
           <tr>
             <td style="padding:16px 20px;">
               <span style="font-size:12px;color:#78716c;">Importe reembolsado</span><br/>
               <span style="font-size:22px;font-weight:800;color:#1c1917;">${amount.toFixed(2)}€</span>
             </td>
           </tr>
         </table>
         <p style="margin:20px 0 0;color:#78716c;font-size:13px;">
           El importe volverá a tu medio de pago original en los próximos días,
           según los plazos de tu banco o tarjeta.
         </p>`
      : `<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1c1917;">Sobre tu solicitud de reembolso</p>
         <p style="margin:0;color:#57534e;">
           Hemos revisado tu solicitud de reembolso de la primera clase con
           <strong>${toSafeHtml(teacherName)}</strong> y, por el momento, no procede la
           devolución. Si crees que es un error o quieres darnos más detalle,
           responde directamente a este correo.
         </p>`,
  );
}

// Avisa a un profesor de que uno de sus referidos ha sido aprobado y le ha
// hecho ganar días de Pro gratis (ver REFERRAL_REWARD_DAYS y
// setTeacherProfileStatus).
export function sendReferralRewardEmail(params: {
  referrerEmail: string;
  referredName: string;
  rewardDays: number;
}) {
  const { referrerEmail, referredName, rewardDays } = params;
  return sendEmail(
    referrerEmail,
    "🎁 Has ganado Pro gratis por invitar a un profesor — TuProfesorParticular",
    `<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1c1917;">🎉 ¡Enhorabuena!</p>
     <p style="margin:0 0 20px;color:#57534e;">
       <strong>${toSafeHtml(referredName)}</strong>, a quien invitaste a
       TuProfesorParticular, ya tiene su anuncio publicado.
     </p>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border-radius:12px;">
       <tr>
         <td align="center" style="padding:20px;">
           <div style="font-size:28px;font-weight:800;color:#ea580c;">+${rewardDays} días</div>
           <div style="font-size:13px;color:#78716c;margin-top:2px;">de Pro gratis para ti</div>
         </td>
       </tr>
     </table>
     <p style="margin:20px 0;color:#57534e;">
       Destacado en búsquedas, materiales ilimitados y contacto con alumnos que
       buscan profesor. Sigue invitando a más profesores — no hay límite.
     </p>
     <div style="text-align:center;">${emailButton(`${APP_URL}/panel/referidos`, "Ver mi enlace de invitación")}</div>`,
  );
}

// Resumen semanal para profesores (ver /api/cron/weekly-digest): visitas,
// mensajes y valoraciones reales de la última semana, con un aviso a Pro
// solo si de verdad conviene (plan Básico) — no repetimos consejos que no
// podamos respaldar con datos reales de la plataforma.
export function sendWeeklyDigestEmail(params: {
  teacherName: string;
  teacherEmail: string;
  teacherProfileId: string;
  visits: number;
  newMessages: number;
  totalReviews: number;
  isFreePlan: boolean;
  proPrice: number;
}) {
  const {
    teacherName,
    teacherEmail,
    teacherProfileId,
    visits,
    newMessages,
    totalReviews,
    isFreePlan,
    proPrice,
  } = params;
  const profileUrl = `${APP_URL}/profesores/${teacherProfileId}`;
  const upgradeUrl = `${APP_URL}/panel/suscripcion`;
  const accountUrl = `${APP_URL}/panel/cuenta`;
  const firstName = teacherName.split(" ")[0];

  const tips: { text: string }[] = [];
  if (visits === 0) {
    tips.push({
      text: `Tu anuncio no ha tenido visitas esta semana. <a href="${profileUrl}" style="color:#0d9488;">Revísalo</a> y comprueba que el precio, la presentación y las materias estén completos.`,
    });
  }
  if (totalReviews === 0) {
    tips.push({
      text: "Todavía no tienes valoraciones. Pide a tus alumnos que dejen una reseña después de la primera clase — genera mucha más confianza que un anuncio sin ninguna.",
    });
  }
  if (isFreePlan) {
    tips.push({
      text: `Con el plan Básico tu anuncio aparece por detrás de los Pro y Premium en las búsquedas. Por ${proPrice}€/mes puedes destacarlo.`,
    });
  }

  const statCell = (emoji: string, value: number, label: string) => `
    <td align="center" style="padding:16px 8px;">
      <div style="font-size:22px;">${emoji}</div>
      <div style="font-size:24px;font-weight:800;color:#1c1917;margin-top:4px;">${value}</div>
      <div style="font-size:12px;color:#78716c;margin-top:2px;">${label}</div>
    </td>`;

  const tipRow = (text: string) => `
    <tr>
      <td style="padding:12px 16px;background:#fffbeb;border-left:3px solid #f59e0b;border-radius:6px;font-size:13px;color:#78350f;">
        ${text}
      </td>
    </tr>
    <tr><td style="height:8px;"></td></tr>`;

  return sendEmail(
    teacherEmail,
    "Así va tu anuncio esta semana — TuProfesorParticular",
    `<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1c1917;">Hola ${toSafeHtml(firstName)} 👋</p>
     <p style="margin:0 0 20px;color:#57534e;">Esto es lo que ha pasado con tu anuncio en los últimos 7 días.</p>

     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdfa;border-radius:12px;">
       <tr>
         ${statCell("👀", visits, visits === 1 ? "Visita" : "Visitas")}
         ${statCell("💬", newMessages, newMessages === 1 ? "Mensaje nuevo" : "Mensajes nuevos")}
         ${statCell("⭐", totalReviews, totalReviews === 1 ? "Valoración" : "Valoraciones")}
       </tr>
     </table>

     ${
       tips.length > 0
         ? `<p style="margin:24px 0 10px;font-size:13px;font-weight:700;color:#1c1917;text-transform:uppercase;letter-spacing:0.03em;">Para conseguir más alumnos</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${tips.map((t) => tipRow(t.text)).join("")}</table>`
         : `<p style="margin:24px 0 0;color:#57534e;">Todo va bien — sigue así 🎉</p>`
     }

     <div style="text-align:center;margin-top:28px;">
       ${emailButton(profileUrl, "Ver mi anuncio")}
       ${isFreePlan ? `&nbsp; ${emailButton(upgradeUrl, "Ver planes Pro", "secondary")}` : ""}
     </div>

     <p style="margin:28px 0 0;text-align:center;color:#a8a29e;font-size:12px;">
       ¿No quieres recibir este resumen? Puedes desactivarlo desde
       <a href="${accountUrl}" style="color:#a8a29e;">Mi cuenta</a>.
     </p>`,
  );
}

const SUGGESTION_CATEGORY_LABELS: Record<string, string> = {
  error: "🐞 Error",
  mejora: "💡 Propuesta de mejora",
  otro: "📝 Otro",
};

// Aviso al administrador cada vez que se registra un profesor nuevo (su
// anuncio queda "pending" hasta que se revise y apruebe en /admin).
export function sendNewTeacherRegisteredEmail(params: {
  name: string;
  email: string;
  verticalLabel: string;
}) {
  const { name, email, verticalLabel } = params;
  return sendEmail(
    ADMIN_EMAIL,
    `Nuevo profesor registrado — ${name}`,
    `<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1c1917;">🧑‍🏫 Nuevo profesor registrado</p>
     <p style="margin:0 0 20px;color:#57534e;">
       <strong>${toSafeHtml(name)}</strong> (${email}) se acaba de registrar en
       <strong>${toSafeHtml(verticalLabel)}</strong>. Su anuncio está pendiente
       de aprobación.
     </p>
     <div style="text-align:center;">${emailButton(`${APP_URL}/admin`, "Revisar en administración")}</div>`,
  );
}

// Aviso al administrador cuando se registra un error en producción (ver
// instrumentation.ts) — antes solo se veía entrando a revisar /admin.
export function sendErrorAlertEmail(params: { message: string; path: string }) {
  const { message, path } = params;
  return sendEmail(
    ADMIN_EMAIL,
    "⚠️ Error en producción — TuProfesorParticular",
    `<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#b91c1c;">⚠️ Error en producción</p>
     <p style="margin:0 0 16px;color:#57534e;">
       Se ha registrado un error en <strong>${toSafeHtml(path || "(ruta desconocida)")}</strong>:
     </p>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
       <tr>
         <td style="padding:12px 16px;background:#fef2f2;border-left:3px solid #dc2626;border-radius:6px;font-family:monospace;font-size:12px;color:#7f1d1d;white-space:pre-wrap;">${toSafeHtml(message)}</td>
       </tr>
     </table>
     <div style="text-align:center;margin-top:20px;">${emailButton(`${APP_URL}/admin/errores`, "Ver todos los errores")}</div>
     <p style="margin:20px 0 0;color:#a8a29e;font-size:12px;text-align:center;">
       Este aviso se silencia 15 minutos tras enviarse uno, para no saturarte
       el correo si el error se repite en bucle.
     </p>`,
  );
}

// Aviso al administrador cuando alguien manda algo desde "Sugerencias" (ver
// /panel/sugerencias) — así llega directamente al buzón, sin depender de
// que el admin entre a revisar /admin.
export function sendNewSuggestionEmail(params: {
  authorName: string;
  authorEmail: string;
  role: string;
  category: string;
  message: string;
}) {
  const { authorName, authorEmail, role, category, message } = params;
  const categoryLabel = SUGGESTION_CATEGORY_LABELS[category] ?? category;
  const roleLabel = role === "teacher" ? "Profesor" : role === "student" ? "Alumno" : role;

  return sendEmail(
    ADMIN_EMAIL,
    `Nueva sugerencia (${categoryLabel}) — ${authorName}`,
    `<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1c1917;">💌 Nueva sugerencia — ${categoryLabel}</p>
     <p style="margin:0 0 16px;color:#57534e;">
       <strong>${toSafeHtml(authorName)}</strong> (${roleLabel}, ${authorEmail}) ha enviado
       ${categoryLabel.toLowerCase()} desde su panel:
     </p>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
       <tr>
         <td style="padding:12px 16px;background:#fafaf9;border-left:3px solid #a8a29e;border-radius:6px;font-size:13px;color:#44403c;white-space:pre-wrap;">${toSafeHtml(message)}</td>
       </tr>
     </table>
     <div style="text-align:center;margin-top:20px;">${emailButton(`${APP_URL}/admin`, "Ver en administración")}</div>`,
  );
}

const RESEND_BATCH_SIZE = 100;

// El mensaje de presentación y las referencias los escribe el profesional
// en un textarea: hay que escaparlos antes de meterlos en el HTML del
// correo (y convertir los saltos de línea en <br/> para que se lean bien).
function toSafeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\r?\n/g, "<br/>");
}

// Envía el CV de un profesional a una lista de centros (campaña de pago,
// ver CvCampaign) — colegios, gimnasios/clubes o clínicas/gabinetes, según
// `vertical`. Va en tandas de 100 (límite de la API de envío por lotes de
// Resend), con una identificación clara del remitente y una forma de darse
// de baja en cada email, tal y como exige la LSSICE para comunicaciones
// comerciales B2B.
export async function sendCvToInstitutions(params: {
  vertical: Vertical;
  teacherName: string;
  teacherEmail: string;
  cvFileUrl: string;
  message: string | null;
  recommendationFileUrl: string | null;
  references: string | null;
  institutions: { id: string; email: string }[];
}): Promise<{ sent: number; failed: number }> {
  const {
    vertical,
    teacherName,
    teacherEmail,
    cvFileUrl,
    message,
    recommendationFileUrl,
    references,
    institutions,
  } = params;
  const copy = INSTITUTION_COPY[vertical];

  if (!resend) {
    console.log(
      `[mailer] RESEND_API_KEY no configurada. Envío de CV simulado a ${institutions.length} ${copy.pluralLower}.`,
    );
    return { sent: institutions.length, failed: 0 };
  }

  const buildHtml = (institutionId: string) => renderEmailShell(`
    <p style="margin:0 0 16px;color:#57534e;">Buenos días,</p>
    <p style="margin:0 0 16px;color:#57534e;">
      Le escribimos desde TuProfesorParticular en nombre de
      <strong>${toSafeHtml(teacherName)}</strong>, quien está interesado/a en
      ${copy.emailIntroRole}.
    </p>
    ${message ? `<p style="margin:0 0 16px;color:#57534e;">${toSafeHtml(message)}</p>` : ""}
    ${
      references
        ? `<p style="margin:0 0 16px;color:#57534e;"><strong>Referencias:</strong><br/>${toSafeHtml(references)}</p>`
        : ""
    }
    <div style="text-align:center;margin:24px 0;">
      ${emailButton(cvFileUrl, `Descargar CV de ${teacherName}`)}
      ${
        recommendationFileUrl
          ? `<div style="margin-top:10px;">${emailButton(recommendationFileUrl, "Descargar carta de recomendación", "secondary")}</div>`
          : ""
      }
    </div>
    <p style="margin:16px 0 0;color:#57534e;">
      Puede responder directamente a este correo (${teacherEmail}) para contactar con el candidato.
    </p>
    <hr style="border:none;border-top:1px solid #e7e5e4;margin:24px 0;"/>
    <p style="color:#a8a29e;font-size:12px;">
      Este correo se envía desde TuProfesorParticular, plataforma de intermediación de
      profesionales, a petición de una persona registrada. Si no desea recibir más
      comunicaciones de este tipo, escríbanos a contacto@tuprofesorparticular.es indicando el
      nombre de su centro y no volveremos a escribirle (ref: ${institutionId}). No responda a
      esta dirección para darse de baja: esa respuesta llega directamente a la persona
      candidata, no a la plataforma.
    </p>
  `);

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < institutions.length; i += RESEND_BATCH_SIZE) {
    const batch = institutions.slice(i, i + RESEND_BATCH_SIZE);
    try {
      const { error } = await resend.batch.send(
        batch.map((institution) => ({
          from: FROM,
          to: institution.email,
          replyTo: teacherEmail,
          subject: `${copy.emailSubjectRole} — ${teacherName}`,
          html: buildHtml(institution.id),
        })),
      );
      if (error) {
        failed += batch.length;
      } else {
        sent += batch.length;
      }
    } catch {
      failed += batch.length;
    }
  }

  return { sent, failed };
}
