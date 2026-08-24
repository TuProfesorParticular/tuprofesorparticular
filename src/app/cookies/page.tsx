import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Política de Cookies · TuProfesorParticular",
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Política de Cookies" updated="24 de agosto de 2026">
      <LegalSection title="1. Qué son las cookies">
        <p>
          Las cookies son pequeños archivos que un sitio web guarda en tu
          navegador para recordar información, como que has iniciado
          sesión.
        </p>
      </LegalSection>

      <LegalSection title="2. Qué cookies usa TuProfesorParticular">
        <p>
          Ahora mismo solo usamos cookies técnicas, estrictamente necesarias
          para que la plataforma funcione. No usamos cookies de analítica ni
          de publicidad.
        </p>
        <div className="overflow-x-auto rounded-lg border border-stone-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th className="px-3 py-2 font-medium">Cookie</th>
                <th className="px-3 py-2 font-medium">Finalidad</th>
                <th className="px-3 py-2 font-medium">Duración</th>
                <th className="px-3 py-2 font-medium">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="px-3 py-2 font-mono text-xs">
                  authjs.session-token
                </td>
                <td className="px-3 py-2">
                  Mantiene tu sesión iniciada.
                </td>
                <td className="px-3 py-2">Hasta cerrar sesión o caducar</td>
                <td className="px-3 py-2">Técnica / esencial</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-xs">
                  authjs.csrf-token
                </td>
                <td className="px-3 py-2">
                  Protege los formularios frente a ataques.
                </td>
                <td className="px-3 py-2">Sesión</td>
                <td className="px-3 py-2">Técnica / esencial</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Al ser cookies estrictamente necesarias, no requieren tu
          consentimiento previo, pero te informamos igualmente de que
          existen.
        </p>
      </LegalSection>

      <LegalSection title="3. Cómo gestionar las cookies">
        <p>
          Puedes eliminar o bloquear las cookies desde la configuración de
          tu navegador. Ten en cuenta que, si bloqueas la cookie de sesión,
          no podrás mantener la sesión iniciada en la plataforma.
        </p>
      </LegalSection>

      <LegalSection title="4. Cambios futuros">
        <p>
          Si en el futuro incorporamos cookies de analítica o de marketing,
          actualizaremos esta política y pediremos tu consentimiento antes
          de activarlas.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
