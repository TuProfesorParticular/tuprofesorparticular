import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { REGION_LABELS } from "@/lib/regions";
import { INSTITUTION_COPY } from "@/lib/institutions";
import { VERTICAL_THEME } from "@/lib/constants";
import InstitutionPicker from "../InstitutionPicker";
import { confirmCvCampaignAndSend } from "../actions";

export const metadata: Metadata = {
  title: "Completar envío · TuProfesorParticular",
};

// El envío de verdad (confirmCvCampaignAndSend → dispatchCvCampaign) manda
// los emails en lotes de 100 de forma secuencial: para comunidades grandes
// (Madrid, Andalucía) o "toda España" puede tardar más que el límite por
// defecto de una función serverless. Le damos más margen aquí.
export const maxDuration = 60;

const ERROR_LABELS: Record<string, string> = {
  archivo: "Tienes que adjuntar tu CV (PDF o Word).",
  tamano: "El archivo pesa demasiado (máximo 5MB).",
  formato: "Formato no válido. Solo se aceptan archivos PDF o Word (.pdf, .doc, .docx).",
  "recomendacion-tamano": "La carta de recomendación pesa demasiado (máximo 5MB).",
  "recomendacion-formato":
    "La carta de recomendación tiene un formato no válido. Solo se aceptan PDF o Word (.pdf, .doc, .docx).",
};

export default async function CompletarEnvioPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireRole("teacher");
  const { id } = await params;
  const { error } = await searchParams;

  const campaign = await prisma.cvCampaign.findUnique({ where: { id } });

  if (!campaign || campaign.userId !== session.user.id) notFound();
  if (campaign.status !== "paid") redirect("/tu-cv");

  const copy = INSTITUTION_COPY[campaign.vertical];
  const theme = VERTICAL_THEME[campaign.vertical];

  const institutionRows = await prisma.institutionContact.findMany({
    where: {
      vertical: campaign.vertical,
      active: true,
      unsubscribed: false,
      ...(campaign.nationwide ? {} : { region: campaign.region ?? undefined }),
    },
    select: { id: true, name: true, province: true },
    orderBy: { name: "asc" },
  });
  const institutions = institutionRows.map((s) => ({
    id: s.id,
    name: s.name,
    province: s.province ?? "",
  }));

  const label = campaign.nationwide ? "toda España" : REGION_LABELS[campaign.region!];

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/tu-cv" className={`text-sm hover:underline ${theme.accentText}`}>
        ← Volver a Tu CV
      </Link>

      <div className="mt-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          ✓ Pago confirmado
        </span>
        <h1 className="mt-3 text-2xl font-bold text-stone-900 sm:text-3xl">
          Completa tu envío — {label}
        </h1>
        <p className="mt-2 text-stone-500">
          Sube tu CV y, si quieres, añade un mensaje de presentación, una carta
          de recomendación y tus referencias. También puedes quitar de la lista
          los {copy.pluralLower} a los que no te interese que se lo enviemos:
          los {institutions.length}+ centros vienen todos marcados por defecto.
        </p>

        {error && ERROR_LABELS[error] && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {ERROR_LABELS[error]}
          </p>
        )}

        <form action={confirmCvCampaignAndSend} className="mt-6 space-y-5">
          <input type="hidden" name="campaignId" value={campaign.id} />

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-stone-700">
              Tu CV (PDF o Word, máx. 5MB)
            </label>
            <input
              id="file"
              name="file"
              type="file"
              required
              accept=".pdf,.doc,.docx"
              className="mt-1 block w-full text-sm text-stone-600 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teal-700 hover:file:bg-teal-100"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-stone-700">
              Mensaje de presentación (opcional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              maxLength={1000}
              placeholder="Cuéntales brevemente tu especialidad, experiencia y disponibilidad..."
              className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label
              htmlFor="recommendationFile"
              className="block text-sm font-medium text-stone-700"
            >
              Carta de recomendación (opcional, PDF o Word)
            </label>
            <input
              id="recommendationFile"
              name="recommendationFile"
              type="file"
              accept=".pdf,.doc,.docx"
              className="mt-1 block w-full text-sm text-stone-600 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teal-700 hover:file:bg-teal-100"
            />
            <p className="mt-1 text-xs text-stone-400">
              Si tienes una carta de un centro o de un antiguo responsable, se
              enviará junto con tu CV.
            </p>
          </div>

          <div>
            <label
              htmlFor="references"
              className="block text-sm font-medium text-stone-700"
            >
              Referencias (opcional)
            </label>
            <textarea
              id="references"
              name="references"
              rows={3}
              maxLength={2000}
              placeholder="Personas que pueden dar referencias tuyas: nombre, cargo o relación y cómo contactarlas (teléfono o email)."
              className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <p className="mt-1 text-xs text-stone-400">
              Se incluyen tal cual en el correo a los centros. Asegúrate de
              tener el permiso de esas personas para compartir sus datos.
            </p>
          </div>

          <div>
            <p className="block text-sm font-medium text-stone-700">
              {copy.pluralLower[0].toUpperCase()}
              {copy.pluralLower.slice(1)} a los que lo enviamos
            </p>
            <InstitutionPicker institutions={institutions} pluralLower={copy.pluralLower} />
          </div>

          <button
            type="submit"
            className={`w-full rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg sm:w-auto ${theme.ctaGradient}`}
          >
            Confirmar y enviar mi CV
          </button>
          <p className="text-xs text-stone-400">
            Este paso solo se puede hacer una vez: en cuanto confirmes, el
            envío se pone en marcha automáticamente.
          </p>
        </form>
      </div>
    </div>
  );
}
