"use client";

import { sendPlatformOutreachToRegion } from "./actions";

export default function SendOutreachButton({
  vertical,
  region,
  count,
}: {
  vertical: string;
  region: string;
  count: number;
}) {
  return (
    <form
      action={sendPlatformOutreachToRegion}
      onSubmit={(e) => {
        if (
          !confirm(
            `¿Enviar el aviso de la plataforma a ${count} centros que todavía no lo han recibido? No se puede deshacer.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="vertical" value={vertical} />
      <input type="hidden" name="region" value={region} />
      <button
        type="submit"
        disabled={count === 0}
        className="w-full rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {count === 0
          ? "Ya se avisó a todos los centros de esta región"
          : `Enviar aviso a ${count} centros sin contactar`}
      </button>
    </form>
  );
}
