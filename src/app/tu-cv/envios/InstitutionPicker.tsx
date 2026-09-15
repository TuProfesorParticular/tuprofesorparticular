"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Institution = { id: string; name: string; province: string };

// Checkbox de la provincia: marca/desmarca todos sus centros a la vez, y se
// muestra en un estado intermedio (una rayita) cuando solo parte de los
// centros de esa provincia están seleccionados.
function ProvinceCheckbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: (checked: boolean) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      onClick={(e) => e.stopPropagation()}
      className="h-4 w-4 flex-shrink-0 rounded border-stone-300 text-teal-600 focus:ring-teal-500"
    />
  );
}

export default function InstitutionPicker({
  institutions,
  pluralLower = "centros",
}: {
  institutions: Institution[];
  pluralLower?: string;
}) {
  const [query, setQuery] = useState("");
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [openProvinces, setOpenProvinces] = useState<Set<string>>(new Set());

  const groups = useMemo(() => {
    const map = new Map<string, Institution[]>();
    for (const s of institutions) {
      const key = s.province || "Sin especificar";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [institutions]);

  const q = query.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    if (!q) return groups;
    return groups
      .map(([province, list]): [string, Institution[]] => {
        const provinceMatches = province.toLowerCase().includes(q);
        const list2 = provinceMatches ? list : list.filter((s) => s.name.toLowerCase().includes(q));
        return [province, list2];
      })
      .filter(([, list]) => list.length > 0);
  }, [groups, q]);

  const toggleInstitution = (id: string) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleProvinceOpen = (province: string) => {
    setOpenProvinces((prev) => {
      const next = new Set(prev);
      if (next.has(province)) next.delete(province);
      else next.add(province);
      return next;
    });
  };

  const setProvinceAll = (list: Institution[], include: boolean) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      list.forEach((s) => {
        if (include) next.delete(s.id);
        else next.add(s.id);
      });
      return next;
    });
  };

  const setAll = (include: boolean) => {
    setExcluded(include ? new Set() : new Set(institutions.map((s) => s.id)));
  };

  const isOpen = (province: string) => Boolean(q) || openProvinces.has(province);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nombre o provincia..."
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      />

      <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
        <span>
          {institutions.length - excluded.size} de {institutions.length} {pluralLower} seleccionados
        </span>
        <span className="flex gap-3">
          <button type="button" onClick={() => setAll(true)} className="font-medium text-teal-600 hover:underline">
            Marcar todos
          </button>
          <button type="button" onClick={() => setAll(false)} className="font-medium text-stone-500 hover:underline">
            Desmarcar todos
          </button>
        </span>
      </div>

      <div className="mt-2 max-h-[32rem] divide-y divide-stone-100 overflow-y-auto rounded-xl border border-stone-200">
        {filteredGroups.map(([province, list]) => {
          const includedCount = list.filter((s) => !excluded.has(s.id)).length;
          const open = isOpen(province);
          return (
            <div key={province}>
              <div className="flex items-center gap-2 bg-stone-50 px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => toggleProvinceOpen(province)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span className="flex-shrink-0 text-stone-400">{open ? "▾" : "▸"}</span>
                  <span className="truncate font-medium text-stone-900">📍 {province}</span>
                  <span className="flex-shrink-0 text-xs text-stone-400">
                    {includedCount}/{list.length}
                  </span>
                </button>
                <ProvinceCheckbox
                  checked={includedCount === list.length}
                  indeterminate={includedCount > 0 && includedCount < list.length}
                  onChange={(checked) => setProvinceAll(list, checked)}
                />
              </div>
              {open && (
                <div>
                  {list.map((s) => (
                    <label
                      key={s.id}
                      className="flex cursor-pointer items-center justify-between gap-3 border-t border-stone-100 py-2 pl-9 pr-3 text-sm hover:bg-stone-50"
                    >
                      <span className="min-w-0 truncate text-stone-800">{s.name}</span>
                      <input
                        type="checkbox"
                        checked={!excluded.has(s.id)}
                        onChange={() => toggleInstitution(s.id)}
                        className="h-4 w-4 flex-shrink-0 rounded border-stone-300 text-teal-600 focus:ring-teal-500"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {filteredGroups.length === 0 && (
          <p className="p-4 text-center text-sm text-stone-400">Sin resultados.</p>
        )}
      </div>

      {/* Viajan con el <form> padre aunque este componente esté anidado. */}
      {[...excluded].map((id) => (
        <input key={id} type="hidden" name="excludedContact" value={id} />
      ))}
    </div>
  );
}
