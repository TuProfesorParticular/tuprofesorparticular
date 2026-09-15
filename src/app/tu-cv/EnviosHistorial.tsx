import type { CvCampaign } from "@prisma/client";
import { REGION_LABELS } from "@/lib/regions";
import { INSTITUTION_COPY } from "@/lib/institutions";
import { VERTICAL_THEME } from "@/lib/constants";

const STATUS_LABELS: Record<CvCampaign["status"], string> = {
  pending: "Pendiente de pago",
  paid: "Pagado · preparando envío",
  sent: "Enviado",
  failed: "Envío fallido",
};

const STATUS_STYLES: Record<CvCampaign["status"], string> = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-sky-50 text-sky-700",
  sent: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-700",
};

function scopeLabel(campaign: CvCampaign): string {
  if (campaign.nationwide) return "Toda España";
  if (!campaign.region) return "—";
  if (campaign.provinces.length === 0) return `${REGION_LABELS[campaign.region]} completa`;
  if (campaign.provinces.length === 1) {
    return `${campaign.provinces[0]} (${REGION_LABELS[campaign.region]})`;
  }
  return `${campaign.provinces.length} provincias de ${REGION_LABELS[campaign.region]}`;
}

export default function EnviosHistorial({ campaigns }: { campaigns: CvCampaign[] }) {
  if (campaigns.length === 0) {
    return (
      <p className="mt-4 rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-400">
        Todavía no has enviado tu CV a ningún centro.
      </p>
    );
  }

  return (
    <ul className="mt-4 space-y-3">
      {campaigns.map((campaign) => {
        const copy = INSTITUTION_COPY[campaign.vertical];
        const theme = VERTICAL_THEME[campaign.vertical];
        return (
        <li key={campaign.id} className="rounded-2xl border border-stone-200 bg-white">
          <details className="group">
            <summary className="flex cursor-pointer list-none flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-stone-900">{scopeLabel(campaign)}</p>
                <p className="mt-0.5 text-xs text-stone-500">
                  Comprado el {campaign.createdAt.toLocaleDateString("es-ES")}
                  {campaign.sentAt
                    ? ` · Enviado el ${campaign.sentAt.toLocaleDateString("es-ES")}`
                    : ""}
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-3">
                {campaign.status === "sent" && (
                  <span className="text-sm font-semibold text-stone-900">
                    {campaign.sentCount} centros
                  </span>
                )}
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[campaign.status]}`}
                >
                  {STATUS_LABELS[campaign.status]}
                </span>
                <span className="text-stone-400 transition group-open:rotate-180">▾</span>
              </div>
            </summary>

            <div className="border-t border-stone-100 p-4 text-sm">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                    CV enviado
                  </p>
                  {campaign.cvFileUrl ? (
                    <a
                      href={campaign.cvFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-1 inline-block hover:underline ${theme.accentText}`}
                    >
                      {campaign.cvFileName}
                    </a>
                  ) : (
                    <p className="mt-1 text-stone-400">Sin subir todavía</p>
                  )}
                </div>
                {campaign.recommendationFileUrl && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                      Carta de recomendación
                    </p>
                    <a
                      href={campaign.recommendationFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-1 inline-block hover:underline ${theme.accentText}`}
                    >
                      {campaign.recommendationFileName}
                    </a>
                  </div>
                )}
                {campaign.excludedContactIds.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                      {copy.pluralLower[0].toUpperCase()}
                      {copy.pluralLower.slice(1)} excluidos
                    </p>
                    <p className="mt-1 text-stone-700">
                      {campaign.excludedContactIds.length} quitados a mano
                    </p>
                  </div>
                )}
                {campaign.provinces.length > 1 && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                      Provincias incluidas
                    </p>
                    <p className="mt-1 text-stone-700">{campaign.provinces.join(", ")}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                    Centros contactados
                  </p>
                  <p className="mt-1 text-stone-700">
                    {campaign.status === "sent"
                      ? `${campaign.sentCount} ${copy.pluralLower}${campaign.failedCount ? ` (${campaign.failedCount} no se pudieron contactar)` : ""}`
                      : campaign.status === "pending"
                        ? "Se calculará al confirmarse el pago"
                        : "En proceso"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                    Importe pagado
                  </p>
                  <p className="mt-1 text-stone-700">
                    {Number(campaign.amount).toFixed(2)}€
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                    ID del pedido
                  </p>
                  <p className="mt-1 font-mono text-xs text-stone-500">{campaign.id}</p>
                </div>
              </div>

              {campaign.message && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                    Mensaje de presentación enviado
                  </p>
                  <p className="mt-1 whitespace-pre-wrap rounded-lg bg-stone-50 p-3 text-stone-700">
                    {campaign.message}
                  </p>
                </div>
              )}

              {campaign.referencesText && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                    Referencias enviadas
                  </p>
                  <p className="mt-1 whitespace-pre-wrap rounded-lg bg-stone-50 p-3 text-stone-700">
                    {campaign.referencesText}
                  </p>
                </div>
              )}
            </div>
          </details>
        </li>
        );
      })}
    </ul>
  );
}
