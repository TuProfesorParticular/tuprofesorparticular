// Aviso por email al admin cuando hay un error nuevo — para no depender de
// entrar a /admin/errores a mirar. Se silencia 15 minutos tras cada envío:
// vive en memoria del proceso (no en la base de datos), así que en
// serverless dura lo que dure caliente esa instancia de la función — es un
// límite "mejor esfuerzo", no una garantía exacta, pero evita el caso más
// dañino (un error en bucle mandando un correo por cada petición).
const ALERT_THROTTLE_MS = 15 * 60 * 1000;
let lastAlertSentAt = 0;

// Monitorización de errores propia (equivalente casero a Sentry): Next.js
// llama a onRequestError automáticamente cuando algo revienta sin controlar
// en un Server Component, Route Handler o Server Action. Lo guardamos en la
// base de datos para poder verlo en /admin/errores sin depender de logs.
export async function onRequestError(
  err: unknown,
  request: { path: string },
) {
  // Solo tiene sentido en el runtime de Node (donde vive Prisma) — el
  // runtime "edge" no se usa en este proyecto, pero por si acaso.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  try {
    const { prisma } = await import("@/lib/prisma");
    const error = err instanceof Error ? err : new Error(String(err));
    const message = error.message.slice(0, 2000);
    const path = request.path?.slice(0, 300) ?? "";

    await prisma.errorLog.create({
      data: {
        message,
        stack: error.stack?.slice(0, 5000),
        path,
      },
    });

    const now = Date.now();
    if (now - lastAlertSentAt > ALERT_THROTTLE_MS) {
      lastAlertSentAt = now;
      const { sendErrorAlertEmail } = await import("@/lib/mailer");
      await sendErrorAlertEmail({ message, path }).catch(() => null);
    }
  } catch {
    // Si el propio logging falla, no queremos que tumbe nada más — se
    // ignora en silencio.
  }
}
