"use client";

import { useActionState } from "react";
import { updateAccountInfo, type AccountFormState } from "./actions";

const initialState: AccountFormState = {};

const inputClass =
  "mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

export default function EditAccountForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [state, formAction, isPending] = useActionState(updateAccountInfo, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-stone-700">
          Nombre completo
        </label>
        <input id="name" name="name" type="text" required minLength={2} defaultValue={name} className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stone-700">
          Email
        </label>
        <input id="email" name="email" type="email" required defaultValue={email} className={inputClass} />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Datos actualizados. Si cambiaste el nombre o el email, puede tardar en
          reflejarse en el menú hasta que vuelvas a iniciar sesión.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-teal-700 hover:to-emerald-600 hover:shadow-lg disabled:opacity-60"
      >
        {isPending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
