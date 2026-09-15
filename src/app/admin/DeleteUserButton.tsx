"use client";

import { adminDeleteUser } from "./actions";

export default function DeleteUserButton({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  return (
    <form
      action={adminDeleteUser}
      onSubmit={(e) => {
        if (
          !confirm(
            `¿Eliminar la cuenta de ${userName} de forma permanente? Esta acción no se puede deshacer.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className="text-xs font-medium text-red-600 hover:underline"
      >
        Eliminar
      </button>
    </form>
  );
}
