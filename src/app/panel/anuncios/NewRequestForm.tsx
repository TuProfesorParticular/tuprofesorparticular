"use client";

import { useActionState, useRef, useEffect } from "react";
import type { Subject } from "@prisma/client";
import { LEVEL_LABELS, LEVEL_ORDER, MODALITY_LABELS } from "@/lib/constants";
import { createStudentRequest, type CreateStudentRequestState } from "./actions";

const initialState: CreateStudentRequestState = {};

const fieldClass =
  "mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

export default function NewRequestForm({ subjects }: { subjects: Subject[] }) {
  const [state, formAction, isPending] = useActionState(createStudentRequest, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-stone-700">
          Título
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          placeholder="Ej. Busco profesor de Matemáticas para 4º ESO"
          className={fieldClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="subjectId" className="block text-sm font-medium text-stone-700">
            Materia
          </label>
          <select id="subjectId" name="subjectId" required className={fieldClass}>
            <option value="">Selecciona una materia</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.category} · {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-stone-700">
            Nivel
          </label>
          <select id="level" name="level" required className={fieldClass}>
            <option value="">Selecciona un nivel</option>
            {LEVEL_ORDER.map((level) => (
              <option key={level} value={level}>
                {LEVEL_LABELS[level]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="modality" className="block text-sm font-medium text-stone-700">
            Modalidad
          </label>
          <select id="modality" name="modality" required className={fieldClass}>
            {Object.entries(MODALITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-stone-700">
            Ciudad (opcional)
          </label>
          <input id="city" name="city" type="text" maxLength={100} className={fieldClass} />
        </div>
      </div>

      <div>
        <label htmlFor="budgetPerHour" className="block text-sm font-medium text-stone-700">
          Presupuesto por hora en € (opcional)
        </label>
        <input
          id="budgetPerHour"
          name="budgetPerHour"
          type="number"
          min="1"
          step="0.5"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-stone-700">
          Cuéntanos qué necesitas
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          maxLength={1000}
          placeholder="Horario disponible, objetivo de las clases, nivel actual..."
          className={fieldClass}
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Anuncio publicado correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-teal-700 hover:to-emerald-600 hover:shadow-lg disabled:opacity-60"
      >
        {isPending ? "Publicando…" : "Publicar anuncio"}
      </button>
    </form>
  );
}
