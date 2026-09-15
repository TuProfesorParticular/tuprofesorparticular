import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { REGION_LABELS, REGION_ORDER } from "@/lib/regions";
import { INSTITUTION_COPY, isVertical } from "@/lib/institutions";
import { VERTICALS } from "@/lib/constants";
import type { Vertical } from "@prisma/client";
import {
  addInstitutionContact,
  bulkImportInstitutionContacts,
  toggleInstitutionContactActive,
  toggleInstitutionContactUnsubscribed,
  deleteInstitutionContact,
} from "./actions";

export const metadata: Metadata = {
  title: "Centros · TuProfesorParticular",
};

export default async function AdminContactosPage({
  searchParams,
}: {
  searchParams: Promise<{ vertical?: string; region?: string }>;
}) {
  await requireRole("admin");
  const { vertical: verticalRaw, region: selectedRegionRaw } = await searchParams;
  const vertical: Vertical = verticalRaw && isVertical(verticalRaw) ? verticalRaw : "educacion";
  const selectedRegion =
    selectedRegionRaw && selectedRegionRaw in REGION_LABELS ? selectedRegionRaw : null;
  const copy = INSTITUTION_COPY[vertical];

  const [counts, contacts] = await Promise.all([
    prisma.institutionContact.groupBy({
      by: ["region"],
      where: { vertical, active: true, unsubscribed: false },
      _count: { _all: true },
    }),
    selectedRegion
      ? prisma.institutionContact.findMany({
          where: { vertical, region: selectedRegion as (typeof REGION_ORDER)[number] },
          orderBy: { createdAt: "desc" },
          take: 200,
        })
      : Promise.resolve([]),
  ]);

  const countByRegion = new Map(counts.map((c) => [c.region, c._count._all]));

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Centros</h1>
          <p className="mt-1 text-sm text-stone-500">
            Base de contactos para el envío de CV. Solo cuentan los activos y
            no dados de baja.
          </p>
        </div>
        <Link href="/admin" className="text-sm text-teal-600 hover:underline">
          ← Volver a administración
        </Link>
      </div>

      <div className="mt-6 flex gap-2">
        {VERTICALS.map((v) => (
          <Link
            key={v.slug}
            href={`/admin/contactos?vertical=${v.slug}`}
            className={`rounded-lg border px-3 py-2 text-sm font-medium ${
              vertical === v.slug
                ? "border-teal-600 bg-teal-600 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            {v.icon} {v.label}
          </Link>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {REGION_ORDER.map((region) => (
          <Link
            key={region}
            href={`/admin/contactos?vertical=${vertical}&region=${region}`}
            className={`rounded-lg border px-3 py-2 text-sm ${
              selectedRegion === region
                ? "border-teal-600 bg-teal-50 text-teal-700"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            {REGION_LABELS[region]}{" "}
            <span className="text-xs text-stone-400">
              ({countByRegion.get(region) ?? 0})
            </span>
          </Link>
        ))}
      </div>

      {selectedRegion && (
        <>
          <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-stone-900">
                Añadir un {copy.singularLower} — {REGION_LABELS[selectedRegion as (typeof REGION_ORDER)[number]]}
              </h2>
              <form action={addInstitutionContact} className="mt-3 space-y-2">
                <input type="hidden" name="vertical" value={vertical} />
                <input type="hidden" name="region" value={selectedRegion} />
                <input
                  name="name"
                  placeholder="Nombre del centro"
                  required
                  className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email de contacto"
                  required
                  className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
                />
                <div className="flex gap-2">
                  <input
                    name="province"
                    placeholder="Provincia (opcional)"
                    className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
                  />
                  <input
                    name="type"
                    placeholder={copy.typeOptions.join("/")}
                    className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
                >
                  Añadir
                </button>
              </form>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-stone-900">
                Importar varios de golpe
              </h2>
              <p className="mt-1 text-xs text-stone-500">
                Una línea por centro: <code>Nombre;email;provincia;tipo</code>{" "}
                (provincia y tipo opcionales)
              </p>
              <form action={bulkImportInstitutionContacts} className="mt-3 space-y-2">
                <input type="hidden" name="vertical" value={vertical} />
                <input type="hidden" name="region" value={selectedRegion} />
                <textarea
                  name="bulk"
                  rows={5}
                  required
                  placeholder={`Ejemplo;info@ejemplo.es;Madrid;${copy.typeOptions[0]}\nOtro;admisiones@otro.es;Madrid;${copy.typeOptions[1] ?? copy.typeOptions[0]}`}
                  className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-mono"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
                >
                  Importar
                </button>
              </form>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-sm font-semibold text-stone-900">
              {copy.pluralLower[0].toUpperCase()}
              {copy.pluralLower.slice(1)} en{" "}
              {REGION_LABELS[selectedRegion as (typeof REGION_ORDER)[number]]} (
              {contacts.length})
            </h2>
            {contacts.length === 0 ? (
              <p className="mt-3 text-sm text-stone-500">Ninguno todavía.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {contacts.map((contact) => (
                  <li
                    key={contact.id}
                    className="flex flex-col gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-900">
                        {contact.name}
                        {contact.unsubscribed && (
                          <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">
                            Baja
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-stone-500">
                        {contact.email}
                        {contact.province ? ` · ${contact.province}` : ""}
                        {contact.type ? ` · ${contact.type}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-3">
                      <form action={toggleInstitutionContactActive}>
                        <input type="hidden" name="id" value={contact.id} />
                        <button
                          type="submit"
                          className="text-xs font-medium text-teal-600 hover:underline"
                        >
                          {contact.active ? "Desactivar" : "Activar"}
                        </button>
                      </form>
                      <form action={toggleInstitutionContactUnsubscribed}>
                        <input type="hidden" name="id" value={contact.id} />
                        <button
                          type="submit"
                          className="text-xs font-medium text-amber-600 hover:underline"
                        >
                          {contact.unsubscribed ? "Quitar baja" : "Dar de baja"}
                        </button>
                      </form>
                      <form action={deleteInstitutionContact}>
                        <input type="hidden" name="id" value={contact.id} />
                        <button
                          type="submit"
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
