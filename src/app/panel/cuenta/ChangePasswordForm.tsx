"use client";

import { useActionState } from "react";
import { changePassword, type AccountFormState } from "./actions";

const initialState: AccountFormState = {};

const inputClass =
  "mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePassword, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-stone-700">
          Contraseña actual
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-stone-700">
          Nueva contraseña
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={8}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700">
          Confirmar nueva contraseña
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          className={inputClass}
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Contraseña actualizada correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800 disabled:opacity-60"
      >
        {isPending ? "Guardando…" : "Cambiar contraseña"}
      </button>
    </form>
  );
}
