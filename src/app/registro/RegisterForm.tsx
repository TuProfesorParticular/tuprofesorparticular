"use client";

import { useActionState, useState } from "react";
import { MATERIAL_DISCOUNT_PER_UPLOAD, FOUNDER_LIMIT, FOUNDER_PRICES } from "@/lib/plans";
import { registerUser, type RegisterState } from "./actions";

const initialState: RegisterState = {};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState,
  );
  const [role, setRole] = useState<"student" | "teacher">("student");

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-stone-700">
          Quiero registrarme como
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex cursor-pointer items-center justify-center rounded-lg border border-stone-300 px-4 py-3 text-sm font-medium has-[:checked]:border-teal-600 has-[:checked]:bg-teal-50 has-[:checked]:text-teal-700">
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === "student"}
              onChange={() => setRole("student")}
              className="sr-only"
            />
            Alumno
          </label>
          <label className="flex cursor-pointer items-center justify-center rounded-lg border border-stone-300 px-4 py-3 text-sm font-medium has-[:checked]:border-teal-600 has-[:checked]:bg-teal-50 has-[:checked]:text-teal-700">
            <input
              type="radio"
              name="role"
              value="teacher"
              checked={role === "teacher"}
              onChange={() => setRole("teacher")}
              className="sr-only"
            />
            Profesor
          </label>
        </div>

        {role === "teacher" && (
          <>
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              🎉 Los {FOUNDER_LIMIT} primeros profesores que se registren
              obtienen el plan Pro <span className="font-medium">gratis</span>{" "}
              los 3 primeros meses. Después, precio de fundador para siempre:{" "}
              {FOUNDER_PRICES.pro}€/mes en Pro o {FOUNDER_PRICES.premium}
              €/mes en Premium.
            </p>
            <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
              💡 Si compartes materiales cada mes en tu sección de{" "}
              <span className="font-medium">Materiales</span>, tus planes Pro
              y Premium se abaratan {MATERIAL_DISCOUNT_PER_UPLOAD}€ por cada
              material que subas ese mes. Es un descuento mes a mes: si un mes
              no subes nada, la cuota de ese mes vuelve al precio original.
            </p>
          </>
        )}
      </fieldset>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-stone-700">
          Nombre completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stone-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-stone-700">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <p className="mt-1 text-xs text-stone-400">Mínimo 8 caracteres.</p>
      </div>

      <label className="flex items-start gap-2 text-sm text-stone-600">
        <input
          type="checkbox"
          name="acceptTerms"
          required
          className="mt-0.5 h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-500"
        />
        <span>
          He leído y acepto los{" "}
          <a href="/terminos" target="_blank" className="text-teal-600 hover:underline">
            Términos y Condiciones
          </a>{" "}
          y la{" "}
          <a href="/privacidad" target="_blank" className="text-teal-600 hover:underline">
            Política de Privacidad
          </a>
          .
        </span>
      </label>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {isPending ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );
}
