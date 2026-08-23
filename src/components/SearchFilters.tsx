import type { Subject } from "@prisma/client";
import { LEVEL_LABELS, LEVEL_ORDER, MODALITY_LABELS } from "@/lib/constants";

type SearchFiltersProps = {
  subjects: Subject[];
  defaultValues: {
    materia?: string;
    categoria?: string;
    ciudad?: string;
    modalidad?: string;
    nivel?: string;
    precioMax?: string;
    ambito?: string;
  };
  showLevel?: boolean;
};

const selectClass =
  "rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

export default function SearchFilters({
  subjects,
  defaultValues,
  showLevel = true,
}: SearchFiltersProps) {
  const subjectsByCategory = new Map<string, Subject[]>();
  for (const subject of subjects) {
    const list = subjectsByCategory.get(subject.category) ?? [];
    list.push(subject);
    subjectsByCategory.set(subject.category, list);
  }

  return (
    <form
      className={`grid grid-cols-1 gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm ${showLevel ? "sm:grid-cols-5" : "sm:grid-cols-4"}`}
    >
      {defaultValues.categoria && (
        <input type="hidden" name="categoria" value={defaultValues.categoria} />
      )}
      {defaultValues.ambito && (
        <input type="hidden" name="ambito" value={defaultValues.ambito} />
      )}

      <select
        name="materia"
        defaultValue={defaultValues.materia ?? ""}
        className={selectClass}
      >
        <option value="">Todas las materias</option>
        {[...subjectsByCategory.entries()].map(([category, items]) => (
          <optgroup key={category} label={category}>
            {items.map((subject) => (
              <option key={subject.id} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <input
        name="ciudad"
        type="text"
        placeholder="Ciudad"
        defaultValue={defaultValues.ciudad ?? ""}
        className={selectClass}
      />

      <select
        name="modalidad"
        defaultValue={defaultValues.modalidad ?? ""}
        className={selectClass}
      >
        <option value="">Cualquier modalidad</option>
        {Object.entries(MODALITY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {showLevel && (
        <select
          name="nivel"
          defaultValue={defaultValues.nivel ?? ""}
          className={selectClass}
        >
          <option value="">Cualquier nivel</option>
          {LEVEL_ORDER.map((level) => (
            <option key={level} value={level}>
              {LEVEL_LABELS[level]}
            </option>
          ))}
        </select>
      )}

      <input
        name="precioMax"
        type="number"
        min="0"
        placeholder="Precio máx. €/h"
        defaultValue={defaultValues.precioMax ?? ""}
        className={selectClass}
      />

      <button
        type="submit"
        className={`col-span-full rounded-lg bg-teal-600 py-2 text-sm font-semibold text-white hover:bg-teal-700 ${showLevel ? "sm:col-span-5" : "sm:col-span-4"}`}
      >
        Buscar
      </button>
    </form>
  );
}
