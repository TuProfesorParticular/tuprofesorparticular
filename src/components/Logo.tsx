// Marca: tres círculos superpuestos (Educación, Deporte, Salud Mental) —
// los tres ámbitos de la plataforma, unidos en un solo símbolo.
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g style={{ mixBlendMode: "multiply" }}>
        <circle cx="16" cy="10" r="9" fill="#0d9488" fillOpacity="0.9" />
        <circle cx="10.8" cy="19" r="9" fill="#ea580c" fillOpacity="0.9" />
        <circle cx="21.2" cy="19" r="9" fill="#7c3aed" fillOpacity="0.9" />
      </g>
    </svg>
  );
}

export default function Logo({
  className = "",
  markClassName = "h-8 w-8",
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className={markClassName} />
      <span className="text-lg font-bold text-stone-900">
        Tu<span className="text-teal-600">Profesor</span>Particular
      </span>
    </span>
  );
}
