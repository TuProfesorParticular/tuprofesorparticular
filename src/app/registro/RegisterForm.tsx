"use client";

import { useActionState, useState } from "react";
import type { Vertical } from "@prisma/client";
import { MATERIAL_DISCOUNT_PER_UPLOAD, FOUNDER_LIMIT, FOUNDER_PRICES } from "@/lib/plans";
import { VERTICALS, DEFAULT_VERTICAL } from "@/lib/constants";
import HoneypotFields from "@/components/HoneypotFields";
import { registerUser, type RegisterState } from "./actions";

const initialState: RegisterState = {};

export default function RegisterForm({
  referralId,
  defaultRole = "student",
}: {
  referralId?: string;
  defaultRole?: "student" | "teacher";
}) {
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState,
  );
  const [role, setRole] = useState<"student" | "teacher">(defaultRole);
  const [vertical, setVertical] = useState<Vertical>(DEFAULT_VERTICAL);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <HoneypotFields />
      {referralId && <input type="hidden" name="ref" value={referralId} />}

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
            {referralId && (
              <p className="mt-3 rounded-lg bg-teal-50 px-3 py-2 text-xs text-teal-700">
                🎁 Te ha invitado otro profesor de la plataforma.
              </p>
            )}
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              🎉 Los {FOUNDER_LIMIT} primeros profesionales de{" "}
              <span className="font-medium">cada categoría</span> obtienen el
              plan Pro <span className="font-medium">gratis durante 3 meses</span>.
              Al terminar ese periodo, pasas{" "}
              <span className="font-medium">automáticamente</span> a tu precio
              de fundador: {FOUNDER_PRICES.pro}€/mes en Pro o{" "}
              {FOUNDER_PRICES.premium}€/mes en Premium — sin necesidad de hacer
              nada. Sin permanencia: cancela cuando quieras, sin costes
              adicionales.
            </p>
            <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
              💡 Si <span className="font-medium">no</span> eres fundador (o
              tu periodo de fundador ya pasó a precio fijo), aportar al
              menos un material aprobado cada mes en tu sección de{" "}
              <span className="font-medium">Materiales</span> abarata tus
              planes Pro y Premium {MATERIAL_DISCOUNT_PER_UPLOAD}€ fijos ese mes —
              da igual si subes uno o varios. Este descuento no se aplica al
              precio de fundador, que ya es fijo y rebajado de por sí.
            </p>

            <div className="mt-3">
              <p className="mb-2 text-xs font-medium text-stone-600">
                ¿A qué categoría perteneces?
              </p>
              <div className="grid grid-cols-3 gap-2">
                {VERTICALS.map((v) => (
                  <label
                    key={v.slug}
                    className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-stone-300 px-2 py-2 text-center text-xs font-medium has-[:checked]:border-teal-600 has-[:checked]:bg-teal-50 has-[:checked]:text-teal-700"
                  >
                    <input
                      type="radio"
                      name="vertical"
                      value={v.slug}
                      checked={vertical === v.slug}
                      onChange={() => setVertical(v.slug)}
                      className="sr-only"
                    />
                    <span className="text-base">{v.icon}</span>
                    {v.label}
                  </label>
                ))}
              </div>
            </div>
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
