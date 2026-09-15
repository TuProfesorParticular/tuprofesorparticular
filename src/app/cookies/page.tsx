import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Política de Cookies · TuProfesorParticular",
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Política de Cookies" updated="26 de agosto de 2026">
      <LegalSection title="1. Qué son las cookies">
        <p>
          Las cookies son pequeños archivos que un sitio web guarda en tu
          navegador para recordar información, como que has iniciado
          sesión.
        </p>
      </LegalSection>

      <LegalSection title="2. Qué cookies usa TuProfesorParticular">
        <p>
          Usamos cookies técnicas, estrictamente necesarias para que la
          plataforma funcione, y una analítica propia y anónima (ver sección
          3). No usamos cookies de publicidad ni compartimos datos con
          terceros con fines publicitarios.
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

      <LegalSection title="3. Analítica propia (medición de audiencia)">
        <p>
          Para saber cuánta gente visita la plataforma, qué páginas se
          consultan más y cuánto tiempo se pasa en ellas, usamos una
          herramienta de analítica propia (no de un tercero como Google
          Analytics). Funciona así:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            No usa cookies: guarda un identificador aleatorio en el
            almacenamiento local de tu navegador (localStorage), sin ningún
            dato que te identifique (ni nombre, ni email, ni IP asociada).
          </li>
          <li>
            Los datos solo los usamos nosotros, de forma agregada
            (visitas por día, páginas más vistas, tiempo medio en página).
            Nunca se ceden ni se venden a terceros, ni se usan con fines
            publicitarios.
          </li>
          <li>
            Al ser una medición de audiencia propia y anónima, no requiere tu
            consentimiento previo, según el criterio de la Agencia Española
            de Protección de Datos (AEPD) para este tipo de analítica.
          </li>
        </ul>
        <p>
          Si prefieres no participar, puedes borrar el almacenamiento local
          de tu navegador para este sitio, o navegar con las cookies/el
          almacenamiento de sitios bloqueado en la configuración de tu
          navegador.
        </p>
      </LegalSection>

      <LegalSection title="4. Cómo gestionar las cookies">
        <p>
          Puedes eliminar o bloquear las cookies desde la configuración de
          tu navegador. Ten en cuenta que, si bloqueas la cookie de sesión,
          no podrás mantener la sesión iniciada en la plataforma.
        </p>
      </LegalSection>

      <LegalSection title="5. Cambios futuros">
        <p>
          Si en el futuro incorporamos cookies de publicidad o cedemos datos
          de analítica a un tercero, actualizaremos esta política y
          pediremos tu consentimiento antes de activarlas.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
