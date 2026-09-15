"use client";

import { useActionState, useRef, useEffect } from "react";
import HoneypotFields from "@/components/HoneypotFields";
import { submitSuggestion, type SuggestionState } from "./actions";

const initialState: SuggestionState = {};

const CATEGORY_OPTIONS = [
  { value: "error", label: "🐞 He encontrado un error" },
  { value: "mejora", label: "💡 Propongo una mejora" },
  { value: "otro", label: "📝 Otro" },
];

export default function SuggestionForm({ ctaClass }: { ctaClass: string }) {
  const [state, formAction, isPending] = useActionState(submitSuggestion, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      <HoneypotFields />

      <label htmlFor="category" className="block text-sm font-medium text-stone-700">
        ¿Qué nos quieres contar?
      </label>
      <select
        id="category"
        name="category"
        defaultValue="mejora"
        className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      >
        {CATEGORY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <label htmlFor="message" className="mt-4 block text-sm font-medium text-stone-700">
        Cuéntanoslo con el máximo detalle posible
      </label>
      <textarea
        id="message"
        name="message"
        rows={5}
        minLength={10}
        maxLength={3000}
        required
        placeholder="Qué ha pasado (o qué te gustaría que hubiera), en qué pantalla, y cualquier detalle que ayude a entenderlo..."
        className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      />

      {state.error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Gracias, nos ha llegado. Lo revisamos lo antes posible.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={`mt-4 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-60 ${ctaClass}`}
      >
        {isPending ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}
