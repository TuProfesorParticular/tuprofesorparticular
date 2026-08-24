import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";
import { PLATFORM_FEE_PERCENT, FOUNDER_LIMIT, FOUNDER_PRICES } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Términos y Condiciones · TuProfesorParticular",
};

export default function TerminosPage() {
  return (
    <LegalLayout title="Términos y Condiciones" updated="24 de agosto de 2026">
      <LegalSection title="1. Objeto y aceptación">
        <p>
          Estos Términos y Condiciones regulan el acceso y uso de
          TuProfesorParticular (en adelante, &ldquo;la plataforma&rdquo;), un
          servicio que conecta a alumnos con profesores particulares,
          entrenadores y profesionales de la salud mental. Al registrarte
          aceptas íntegramente estos términos, la{" "}
          <a href="/privacidad" className="text-teal-600 hover:underline">
            Política de Privacidad
          </a>{" "}
          y la{" "}
          <a href="/cookies" className="text-teal-600 hover:underline">
            Política de Cookies
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Qué es (y qué no es) la plataforma">
        <p>
          TuProfesorParticular es un intermediario tecnológico: pone en
          contacto a alumnos y profesionales, pero no es parte de las clases
          o sesiones que se acuerden entre ellos, no emplea a los
          profesionales y no garantiza la calidad, puntualidad ni resultado
          de ningún servicio prestado fuera de la plataforma.
        </p>
        <p className="font-medium text-stone-700">
          La plataforma no verifica titulaciones académicas, colegiación
          profesional ni antecedentes penales de los profesionales
          registrados. Es responsabilidad de cada usuario comprobar las
          credenciales de la persona con la que va a contactar, especialmente
          en el ámbito de Salud Mental, donde recomendamos comprobar la
          colegiación del profesional antes de iniciar cualquier
          tratamiento.
        </p>
      </LegalSection>

      <LegalSection title="3. Registro y cuenta">
        <p>
          Para usar determinadas funciones es necesario registrarse como
          alumno o como profesional, indicando datos veraces y manteniéndolos
          actualizados. Cada persona solo puede tener una cuenta y es
          responsable de la actividad realizada con ella y de la
          confidencialidad de su contraseña.
        </p>
        <p>
          Los anuncios de profesional quedan pendientes de aprobación por el
          equipo de administración antes de aparecer en las búsquedas
          públicas.
        </p>
      </LegalSection>

      <LegalSection title="4. Planes de pago para profesionales">
        <p>
          Publicar un anuncio y contactar con alumnos es gratuito (plan
          Gratis). Los planes Pro y Premium son suscripciones mensuales de
          pago, gestionadas a través de Stripe, que amplían el número de
          materias y la visibilidad del anuncio. Puedes cancelar la
          suscripción en cualquier momento desde tu panel; la cancelación
          surte efecto al final del periodo ya pagado.
        </p>
        <p>
          Cada material compartido en la sección Materiales durante el mes en
          curso reduce el precio de ese mes en los planes de pago. Es un
          descuento mes a mes: si un mes no se comparte ningún material, la
          cuota de ese mes vuelve al precio original del plan.
        </p>
      </LegalSection>

      <LegalSection title="5. Programa de profesor fundador">
        <p>
          Los primeros {FOUNDER_LIMIT} profesionales que se registran acceden
          al plan Pro gratis durante 3 meses. Pasado ese periodo, si
          continúan activos, su cuota queda fijada de forma permanente en{" "}
          {FOUNDER_PRICES.pro}€/mes en Pro o {FOUNDER_PRICES.premium}€/mes en
          Premium, en lugar del precio estándar. Este programa puede
          finalizar o modificarse en cualquier momento para los nuevos
          registros, sin afectar a quienes ya lo hayan obtenido.
        </p>
      </LegalSection>

      <LegalSection title="6. Comisión sobre la primera clase">
        <p>
          Cuando un alumno reserva y paga a través de la plataforma la
          primera clase con un profesional, TuProfesorParticular retiene un{" "}
          {PLATFORM_FEE_PERCENT}% del importe en concepto de gestión; el
          resto se transfiere al profesional a través de Stripe Connect. Las
          clases siguientes que se acuerden y cobren fuera de la plataforma
          no generan comisión.
        </p>
        <p>
          No está permitido usar la plataforma únicamente para encontrar
          contacto y después acordar sistemáticamente el pago fuera de ella
          con el fin de evitar esta comisión en la primera clase.
        </p>
      </LegalSection>

      <LegalSection title="7. Disponibilidad semanal">
        <p>
          La rejilla de disponibilidad que cada profesional puede rellenar en
          su perfil es orientativa: informa de los horarios habituales en los
          que suele dar clase, pero no constituye una reserva confirmada ni
          bloquea horarios. Cualquier cita debe confirmarse directamente con
          el profesional a través de la mensajería.
        </p>
      </LegalSection>

      <LegalSection title="8. Materiales y contenido subido por los usuarios">
        <p>
          Cada usuario es el único responsable del contenido que publica
          (materiales, presentación, foto de perfil, mensajes) y garantiza
          que dispone de los derechos necesarios para compartirlo. Al subir
          un material a la sección Materiales, el usuario concede a
          TuProfesorParticular una licencia no exclusiva para almacenarlo y
          mostrarlo dentro de la plataforma, sin ceder la propiedad del
          contenido.
        </p>
        <p>
          Nos reservamos el derecho a retirar cualquier contenido que
          infrinja derechos de terceros, sea ilícito o incumpla estos
          términos.
        </p>
      </LegalSection>

      <LegalSection title="9. Canal ético">
        <p>
          Cualquier usuario puede reportar de forma confidencial, a través
          del{" "}
          <a href="/canal-etico" className="text-teal-600 hover:underline">
            Canal ético
          </a>
          , un comportamiento inadecuado o un incumplimiento de estos
          términos por parte de un profesional. Los reportes falsos o
          hechos con mala fe pueden dar lugar a la suspensión de la cuenta
          del denunciante.
        </p>
      </LegalSection>

      <LegalSection title="10. Conducta prohibida">
        <ul className="list-disc space-y-1 pl-5">
          <li>Publicar información falsa sobre tu identidad o formación.</li>
          <li>Acosar, discriminar o amenazar a otros usuarios.</li>
          <li>
            Subir materiales que infrinjan derechos de propiedad intelectual
            de terceros.
          </li>
          <li>Usar la plataforma con fines fraudulentos.</li>
          <li>
            Intentar eludir las comisiones descritas en la sección 6 de
            forma sistemática.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="11. Suspensión y baja">
        <p>
          Podemos suspender o cancelar una cuenta que incumpla estos
          términos, sin perjuicio de otras acciones que correspondan. El
          usuario puede darse de baja en cualquier momento desde su panel o
          escribiendo al correo de contacto.
        </p>
      </LegalSection>

      <LegalSection title="12. Limitación de responsabilidad">
        <p>
          TuProfesorParticular no garantiza la disponibilidad ininterrumpida
          del servicio ni es responsable de los acuerdos, pagos o
          incidencias que se produzcan directamente entre alumnos y
          profesionales fuera del flujo de reserva de la plataforma.
        </p>
      </LegalSection>

      <LegalSection title="13. Modificaciones">
        <p>
          Podemos actualizar estos términos para reflejar cambios en el
          servicio o en la normativa aplicable. Los cambios relevantes se
          anunciarán en la plataforma antes de su entrada en vigor.
        </p>
      </LegalSection>

      <LegalSection title="14. Ley aplicable y contacto">
        <p>
          Estos términos se rigen por la legislación española. Para
          cualquier duda, puedes escribir a{" "}
          <a href="mailto:legal@tuprofesorparticular.com" className="text-teal-600 hover:underline">
            legal@tuprofesorparticular.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
