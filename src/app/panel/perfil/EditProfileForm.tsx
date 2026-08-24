"use client";

import { useActionState } from "react";
import type { Subject, TeacherProfile } from "@prisma/client";
import { LEVEL_LABELS, LEVEL_ORDER, MODALITY_LABELS } from "@/lib/constants";
import { updateTeacherProfile, type EditProfileState } from "./actions";
import AvailabilityGrid from "./AvailabilityGrid";

const initialState: EditProfileState = {};

const inputClass =
  "mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

type EditProfileFormProps = {
  teacherProfile: Omit<TeacherProfile, "pricePerHour"> & { pricePerHour: number };
  allSubjects: Subject[];
  selectedSubjectIds: string[];
  selectedLevels: string[];
  selectedSlots: string[];
};

export default function EditProfileForm({
  teacherProfile,
  allSubjects,
  selectedSubjectIds,
  selectedLevels,
  selectedSlots,
}: EditProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateTeacherProfile,
    initialState,
  );

  const subjectsByCategory: [string, Subject[]][] = [];
  for (const subject of allSubjects) {
    const group = subjectsByCategory.find(([category]) => category === subject.category);
    if (group) {
      group[1].push(subject);
    } else {
      subjectsByCategory.push([subject.category, [subject]]);
    }
  }

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <div>
        <label htmlFor="avatar" className="block text-sm font-medium text-stone-700">
          Foto de perfil
        </label>
        <input
          id="avatar"
          name="avatar"
          type="file"
          accept="image/*"
          className="mt-1 block w-full text-sm text-stone-600"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-stone-700">
          Presentación
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          maxLength={1000}
          defaultValue={teacherProfile.bio ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="subjectIds" className="block text-sm font-medium text-stone-700">
          Materias
        </label>
        <p className="mt-0.5 text-xs text-stone-400">
          Mantén pulsado Ctrl (⌘ en Mac) para seleccionar varias materias.
        </p>
        <select
          id="subjectIds"
          name="subjectIds"
          multiple
          size={8}
          defaultValue={selectedSubjectIds}
          className={inputClass}
        >
          {subjectsByCategory.map(([category, subjects]) => (
            <optgroup key={category} label={category}>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-stone-700">
          Niveles que impartes
        </legend>
        <p className="mb-2 text-xs text-stone-400">
          Solo aplica a materias académicas. Si impartes deporte o salud
          mental, puedes dejarlo sin marcar.
        </p>
        <div className="flex flex-wrap gap-2">
          {LEVEL_ORDER.map((level) => (
            <label
              key={level}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-stone-300 px-3 py-1.5 text-sm has-[:checked]:border-teal-600 has-[:checked]:bg-teal-50 has-[:checked]:text-teal-700"
            >
              <input
                type="checkbox"
                name="levels"
                value={level}
                defaultChecked={selectedLevels.includes(level)}
                className="sr-only"
              />
              {LEVEL_LABELS[level]}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className="block text-sm font-medium text-stone-700">
          Disponibilidad semanal
        </label>
        <div className="mt-1">
          <AvailabilityGrid selectedSlots={selectedSlots} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pricePerHour" className="block text-sm font-medium text-stone-700">
            Precio por hora (€)
          </label>
          <input
            id="pricePerHour"
            name="pricePerHour"
            type="number"
            min="0"
            step="0.5"
            required
            defaultValue={Number(teacherProfile.pricePerHour)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="modality" className="block text-sm font-medium text-stone-700">
            Modalidad
          </label>
          <select
            id="modality"
            name="modality"
            defaultValue={teacherProfile.modality}
            className={inputClass}
          >
            {Object.entries(MODALITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-stone-700">
            Ciudad
          </label>
          <input
            id="city"
            name="city"
            type="text"
            defaultValue={teacherProfile.city ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-stone-700">
            Código postal
          </label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            defaultValue={teacherProfile.postalCode ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="experienceText" className="block text-sm font-medium text-stone-700">
          Titulación y experiencia
        </label>
        <textarea
          id="experienceText"
          name="experienceText"
          rows={3}
          maxLength={2000}
          defaultValue={teacherProfile.experienceText ?? ""}
          className={inputClass}
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Perfil actualizado correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {isPending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
