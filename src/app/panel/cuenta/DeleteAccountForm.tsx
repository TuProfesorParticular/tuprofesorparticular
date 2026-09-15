"use client";

import { useState } from "react";
import { deleteOwnAccount } from "./actions";

export default function DeleteAccountForm() {
  const [confirming, setConfirming] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Eliminar mi cuenta
      </button>
    );
  }

  return (
    <form action={deleteOwnAccount} className="rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="text-sm text-red-800">
        Esto borrará tu cuenta, tu anuncio (si eres profesor), tus mensajes,
        reseñas y reservas de forma permanente. No se puede deshacer.
      </p>
      <label className="mt-3 block text-xs font-medium text-red-800">
        Escribe <span className="font-bold">ELIMINAR</span> para confirmar
      </label>
      <input
        type="text"
        name="confirmation"
        value={confirmationText}
        onChange={(e) => setConfirmationText(e.target.value)}
        className="mt-1 w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
      />
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={confirmationText !== "ELIMINAR"}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Eliminar definitivamente
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-600 hover:bg-white"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
