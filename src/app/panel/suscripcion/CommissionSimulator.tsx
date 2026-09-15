"use client";

import { useState } from "react";
import type { Vertical } from "@prisma/client";
import { VERTICAL_THEME } from "@/lib/constants";
import { PLATFORM_FEE_PERCENT } from "@/lib/plans";

const eur = (n: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);

// Simulación de comisiones para el profesor antes de contratar un plan.
// Sustituye al texto que antes estaba expuesto en la home: aquí, ya dentro
// del panel y justo antes de elegir plan, se explica con un ejemplo propio
// cuánto retiene la plataforma y cuánto se queda el profesor.
export default function CommissionSimulator({ vertical }: { vertical: Vertical }) {
  const theme = VERTICAL_THEME[vertical];
  const [newStudents, setNewStudents] = useState(4);
  const [firstClassPrice, setFirstClassPrice] = useState(15);

  const gross = newStudents * firstClassPrice;
  const platformFee = Math.round(gross * (PLATFORM_FEE_PERCENT / 100) * 100) / 100;
  const youKeep = Math.round((gross - platformFee) * 100) / 100;

  return (
    <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-stone-900">
        ¿Cuánto se lleva la plataforma?
      </h2>
      <p className="mt-2 text-sm text-stone-600">
        Solo una comisión de gestión del{" "}
        <span className="font-semibold">{PLATFORM_FEE_PERCENT}%</span> sobre la{" "}
        <span className="font-semibold">primera clase</span> que te reserva por
        la web cada alumno nuevo. A partir de la segunda clase de ese alumno, el{" "}
        <span className="font-semibold">100%</span> de lo que acordéis es para
        ti. La cuota mensual del plan es aparte.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-stone-700">
            Alumnos nuevos al mes:{" "}
            <span className={`font-bold ${theme.accentText}`}>{newStudents}</span>
          </span>
          <input
            type="range"
            min={1}
            max={20}
            value={newStudents}
            onChange={(e) => setNewStudents(Number(e.target.value))}
            style={{ accentColor: "currentColor" }}
            className={`mt-2 w-full ${theme.accentText}`}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-stone-700">
            Precio de tu primera clase
          </span>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={300}
              value={firstClassPrice}
              onChange={(e) =>
                setFirstClassPrice(Math.max(0, Math.min(300, Number(e.target.value))))
              }
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-300"
            />
            <span className="text-sm text-stone-400">€</span>
          </div>
        </label>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-stone-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
            Comisión de la plataforma
          </p>
          <p className="mt-1 text-2xl font-bold text-stone-900">{eur(platformFee)}</p>
          <p className="text-xs text-stone-500">
            este mes, solo por esas primeras clases
          </p>
        </div>
        <div className={`rounded-xl border p-4 ${theme.badge}`}>
          <p className="text-xs font-medium uppercase tracking-wide opacity-70">
            Recibes tú
          </p>
          <p className="mt-1 text-2xl font-bold">{eur(youKeep)}</p>
          <p className="text-xs opacity-80">
            de esas primeras clases · + el 100% de todas las siguientes
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-stone-400">
        Ejemplo orientativo. La comisión solo se aplica a reservas hechas y
        pagadas a través de la plataforma.
      </p>
    </div>
  );
}
