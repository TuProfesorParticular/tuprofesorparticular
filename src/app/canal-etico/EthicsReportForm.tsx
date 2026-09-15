"use client";

import { useActionState } from "react";
import HoneypotFields from "@/components/HoneypotFields";
import { submitEthicsReport, type EthicsReportState } from "./actions";

const initialState: EthicsReportState = {};

export default function EthicsReportForm({
  teacherName,
  teacherProfileId,
}: {
  teacherName?: string;
  teacherProfileId?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    submitEthicsReport,
    initialState,
  );

  if (state.success) {
    return (
      <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-700">
        Gracias por avisarnos. Un administrador revisará tu reporte de forma
        confidencial — nunca compartimos tu identidad con el profesor.
      </p>
    );
  }

  return (
    <form action={formAction} className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <HoneypotFields />
      {teacherProfileId && (
        <input type="hidden" name="teacherProfileId" value={teacherProfileId} />
      )}

      {teacherName && (
        <p className="mb-4 rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-600">
          Vas a reportar a <span className="font-medium">{teacherName}</span>.
        </p>
      )}

      <label htmlFor="message" className="block text-sm font-medium text-stone-700">
        Cuéntanos qué ha ocurrido
      </label>
      <textarea
        id="message"
        name="message"
        rows={6}
        minLength={20}
        maxLength={3000}
        required
        placeholder="Describe la situación con el máximo detalle posible: qué pasó, cuándo, y cualquier evidencia que tengas."
        className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      />

      {state.error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
      >
        {isPending ? "Enviando…" : "Enviar reporte confidencial"}
      </button>
    </form>
  );
}
