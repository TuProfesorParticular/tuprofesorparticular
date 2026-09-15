import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Registra una visita a una página. No usa cookies ni identifica a la
// persona: el visitorId es un id aleatorio generado en el navegador y
// guardado en localStorage, solo para poder contar visitantes únicos.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const path = typeof body?.path === "string" ? body.path.slice(0, 300) : null;
  const visitorId =
    typeof body?.visitorId === "string" ? body.visitorId.slice(0, 100) : null;

  if (!path || !visitorId) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const pageView = await prisma.pageView.create({
    data: { path, visitorId },
    select: { id: true },
  });

  return NextResponse.json({ id: pageView.id });
}
