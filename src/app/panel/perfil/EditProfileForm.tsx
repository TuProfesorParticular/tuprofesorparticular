"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import type { Subject, TeacherProfile } from "@prisma/client";
import { LEVEL_LABELS, LEVEL_ORDER, MODALITY_LABELS, VERTICAL_THEME } from "@/lib/constants";
import { updateTeacherProfile, type EditProfileState } from "./actions";
import AvailabilityGrid from "./AvailabilityGrid";

const initialState: EditProfileState = {};

const inputClass =
  "mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

type EditProfileFormProps = {
  teacherProfile: Omit<TeacherProfile, "pricePerHour"> & { pricePerHour: number };
  avatarUrl: string | null;
  allSubjects: Subject[];
  selectedSubjectIds: string[];
  selectedLevels: string[];
  selectedSlots: string[];
};

export default function EditProfileForm({
  teacherProfile,
  avatarUrl,
  allSubjects,
  selectedSubjectIds,
  selectedLevels,
  selectedSlots,
}: EditProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateTeacherProfile,
    initialState,
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedSubjectIds);
  // Vista previa de la foto de perfil: arranca con la que ya hay guardada
  // (si hay) y se actualiza al momento al elegir un archivo nuevo, antes
  // incluso de guardar el formulario.
  const [avatarPreview, setAvatarPreview] = useState<string | null>(avatarUrl);
  const theme = VERTICAL_THEME[teacherProfile.vertical];

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  const subjectVerticalById = new Map(allSubjects.map((s) => [s.id, s.vertical]));
  const showLicenseField = selectedIds.some(
    (id) => subjectVerticalById.get(id) === "salud_mental",
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
        <p className="mt-0.5 text-xs text-stone-400">
          Se ve en tu anuncio público y en los resultados de búsqueda. Los
          anuncios con foto generan más confianza.
        </p>
        <div className="mt-2 flex items-center gap-4">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-100 text-3xl text-stone-400">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview}
                alt="Vista previa de tu foto de perfil"
                className="h-full w-full object-cover"
              />
            ) : (
              "👤"
            )}
          </div>
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="block w-full text-sm text-stone-600 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teal-700 hover:file:bg-teal-100"
          />
        </div>
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
          onChange={(e) =>
            setSelectedIds(Array.from(e.target.selectedOptions, (o) => o.value))
          }
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

      {showLicenseField && (
        <div>
          <label htmlFor="licenseNumber" className="block text-sm font-medium text-stone-700">
            Número de colegiado
          </label>
          <p className="mt-0.5 text-xs text-stone-400">
            Se muestra en tu anuncio público para dar confianza a los
            alumnos. Déjalo vacío si no aplica en tu caso.
          </p>
          <input
            id="licenseNumber"
            name="licenseNumber"
            type="text"
            maxLength={60}
            defaultValue={teacherProfile.licenseNumber ?? ""}
            placeholder="ej. M-12345"
            className={inputClass}
          />
        </div>
      )}

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
        className={`rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-60 ${theme.ctaGradient}`}
      >
        {isPending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
