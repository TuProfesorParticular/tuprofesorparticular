import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Recibe cuánto tiempo ha pasado la persona en la página (enviado vía
// navigator.sendBeacon al salir/cambiar de pestaña). Best-effort: si el id
// no existe o ya se cerró la conexión, simplemente no hace nada.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : null;
  const durationMs = typeof body?.durationMs === "number" ? Math.round(body.durationMs) : null;

  if (!id || durationMs === null || durationMs < 0 || durationMs > 1000 * 60 * 60 * 6) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await prisma.pageView
    .update({ where: { id }, data: { durationMs } })
    .catch(() => null);

  return NextResponse.json({ ok: true });
}
