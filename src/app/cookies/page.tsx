import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Política de Cookies · TuProfesorParticular",
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Política de Cookies" updated="17 de septiembre de 2026">
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
          plataforma funcione; una analítica propia y anónima (ver sección
          3); y, solo si nos das tu consentimiento, cookies de publicidad de
          Google AdSense (ver sección 4).
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

      <LegalSection title="4. Cookies de publicidad (Google AdSense)">
        <p>
          Cuando aceptas cookies no esenciales en el aviso de la web,
          activamos Google AdSense para mostrar anuncios, en algunas
          secciones (como Noticias). AdSense puede instalar sus propias
          cookies para mostrar anuncios personalizados según tu actividad de
          navegación, y compartir información con Google para ese fin.
        </p>
        <p>
          Si rechazas las cookies no esenciales, o no respondes al aviso,
          AdSense no se activa: no se solicita su script ni se instala
          ninguna cookie de publicidad. Puedes cambiar tu decisión en
          cualquier momento desde &ldquo;Preferencias de cookies&rdquo;, al
          final de cualquier página.
        </p>
        <p>
          Más información sobre cómo Google usa los datos de los sitios que
          usan sus servicios:{" "}
          <a
            href="https://www.google.com/policies/technologies/partner-sites/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:underline"
          >
            política de Google para partners
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="5. Cómo gestionar las cookies">
        <p>
          Puedes cambiar tu decisión sobre las cookies no esenciales en
          cualquier momento desde &ldquo;Preferencias de cookies&rdquo;, al
          final de cualquier página. También puedes eliminar o bloquear
          cookies desde la configuración de tu navegador — ten en cuenta que,
          si bloqueas la cookie de sesión, no podrás mantener la sesión
          iniciada en la plataforma.
        </p>
      </LegalSection>

      <LegalSection title="6. Cambios futuros">
        <p>
          Si en el futuro incorporamos nuevas cookies no esenciales o
          cedemos datos de analítica a un tercero, actualizaremos esta
          política y pediremos tu consentimiento antes de activarlas.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
