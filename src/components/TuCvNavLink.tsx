"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Vertical } from "@prisma/client";
import { VERTICAL_THEME, DEFAULT_VERTICAL } from "@/lib/constants";

// El pill "Tu CV" del navbar adopta el color del ámbito que se esté viendo
// en ese momento (?ambito= en la home): teal en Educación, naranja en
// Deporte, violeta en Salud Mental. Componente cliente porque necesita leer
// el query param actual, que cambia sin recargar la página al navegar entre
// pestañas de ámbito.
export default function TuCvNavLink({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const ambito = searchParams.get("ambito");
  const vertical: Vertical =
    ambito === "deporte" || ambito === "salud_mental" ? ambito : DEFAULT_VERTICAL;
  const theme = VERTICAL_THEME[vertical];

  return (
    <Link
      href="/tu-cv"
      className={`rounded-full px-4 py-1.5 text-white shadow-sm transition hover:shadow-md ${theme.ctaGradient} ${className ?? ""}`}
    >
      Tu CV
    </Link>
  );
}
