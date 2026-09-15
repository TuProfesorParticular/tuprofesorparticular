import Link from "next/link";
import type { CvCampaign } from "@prisma/client";
import { REGION_LABELS } from "@/lib/regions";
import { VERTICAL_THEME } from "@/lib/constants";

export default function EnviosPendientes({ campaigns }: { campaigns: CvCampaign[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {campaigns.map((campaign) => {
        const theme = VERTICAL_THEME[campaign.vertical];
        return (
          <li
            key={campaign.id}
            className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-semibold text-stone-900">
                {campaign.nationwide ? "Toda España" : campaign.region ? REGION_LABELS[campaign.region] : "—"}
              </p>
              <p className="mt-0.5 text-sm text-stone-600">
                Pagado el {campaign.createdAt.toLocaleDateString("es-ES")} · Sube tu CV para
                iniciar el envío
              </p>
            </div>
            <Link
              href={`/tu-cv/envios/${campaign.id}`}
              className={`flex-shrink-0 rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:shadow-lg ${theme.ctaGradient}`}
            >
              Subir CV y enviar
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
