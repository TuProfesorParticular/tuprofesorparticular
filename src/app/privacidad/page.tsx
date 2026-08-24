import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Política de Privacidad · TuProfesorParticular",
};

export default function PrivacidadPage() {
  return (
    <LegalLayout title="Política de Privacidad" updated="24 de agosto de 2026">
      <LegalSection title="1. Responsable del tratamiento">
        <p>
          El responsable del tratamiento de los datos personales recogidos a
          través de TuProfesorParticular es el titular identificado en el{" "}
          <a href="/aviso-legal" className="text-teal-600 hover:underline">
            Aviso Legal
          </a>
          . Para cualquier cuestión sobre esta política puedes escribir a{" "}
          <a href="mailto:privacidad@tuprofesorparticular.com" className="text-teal-600 hover:underline">
            privacidad@tuprofesorparticular.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Qué datos recopilamos">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="font-medium text-stone-700">Cuenta:</span>{" "}
            nombre, email y contraseña (almacenada cifrada, nunca en texto
            plano).
          </li>
          <li>
            <span className="font-medium text-stone-700">
              Perfil de profesional:
            </span>{" "}
            presentación, materias o especialidades, precio por hora,
            ciudad, modalidad, disponibilidad semanal, titulación/experiencia
            y foto de perfil (opcional).
          </li>
          <li>
            <span className="font-medium text-stone-700">Materiales:</span>{" "}
            los archivos que subas a la sección Materiales.
          </li>
          <li>
            <span className="font-medium text-stone-700">Mensajes:</span> el
            contenido de las conversaciones entre alumnos y profesionales
            dentro de la plataforma.
          </li>
          <li>
            <span className="font-medium text-stone-700">Valoraciones:</span>{" "}
            puntuación y comentario que un alumno deja tras una clase pagada
            a través de la plataforma.
          </li>
          <li>
            <span className="font-medium text-stone-700">
              Reportes del canal ético:
            </span>{" "}
            el contenido de cualquier reporte confidencial que envíes.
          </li>
          <li>
            <span className="font-medium text-stone-700">Pagos:</span> los
            datos de tarjeta los gestiona directamente Stripe; nosotros no
            almacenamos números de tarjeta completos.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Con qué finalidad y base legal">
        <p>
          Tratamos estos datos para prestar el servicio (ejecución del
          contrato al aceptar estos términos), para gestionar los pagos y
          suscripciones, para poder contactarte por email sobre tu cuenta o
          mensajes nuevos, y para revisar los reportes del canal ético
          (interés legítimo en mantener una plataforma segura). Cuando el
          tratamiento no se ampara en el contrato, pedimos tu consentimiento
          expreso.
        </p>
      </LegalSection>

      <LegalSection title="4. Con quién compartimos tus datos">
        <p>
          No vendemos tus datos. Los compartimos únicamente con los
          proveedores necesarios para operar la plataforma, que actúan como
          encargados del tratamiento:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="font-medium text-stone-700">Stripe</span> —
            procesamiento de pagos y suscripciones.
          </li>
          <li>
            <span className="font-medium text-stone-700">Supabase</span> —
            base de datos y almacenamiento de archivos (materiales, fotos de
            perfil).
          </li>
          <li>
            <span className="font-medium text-stone-700">Resend</span> —
            envío de emails transaccionales (verificación de cuenta,
            recuperación de contraseña, avisos de mensajes nuevos).
          </li>
          <li>
            <span className="font-medium text-stone-700">Vercel</span> —
            alojamiento de la aplicación.
          </li>
        </ul>
        <p>
          Algunos de estos proveedores pueden procesar datos fuera del
          Espacio Económico Europeo; en ese caso, se apoyan en las
          garantías previstas por el RGPD (como las cláusulas contractuales
          tipo).
        </p>
      </LegalSection>

      <LegalSection title="5. Cuánto tiempo conservamos tus datos">
        <p>
          Conservamos tus datos mientras tu cuenta esté activa. Si te das de
          baja, los eliminamos o anonimizamos en un plazo razonable, salvo
          que debamos conservar algún dato por obligación legal (por
          ejemplo, facturación).
        </p>
      </LegalSection>

      <LegalSection title="6. Tus derechos">
        <p>
          Puedes ejercer en cualquier momento tus derechos de acceso,
          rectificación, supresión, oposición, limitación del tratamiento y
          portabilidad escribiendo a{" "}
          <a href="mailto:privacidad@tuprofesorparticular.com" className="text-teal-600 hover:underline">
            privacidad@tuprofesorparticular.com
          </a>
          . También puedes editar o eliminar directamente buena parte de tu
          información desde tu panel de usuario. Si consideras que no hemos
          atendido tu solicitud correctamente, puedes reclamar ante la
          Agencia Española de Protección de Datos (
          <a
            href="https://www.aepd.es"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:underline"
          >
            www.aepd.es
          </a>
          ).
        </p>
      </LegalSection>

      <LegalSection title="7. Seguridad">
        <p>
          Las contraseñas se almacenan cifradas, las conexiones al sitio
          usan HTTPS y el acceso a los datos está restringido a lo
          necesario para operar la plataforma.
        </p>
      </LegalSection>

      <LegalSection title="8. Menores de edad">
        <p>
          TuProfesorParticular no está dirigida a menores de 18 años sin
          supervisión de un adulto, dado que implica contacto entre
          personas desconocidas y, en algunos casos, pagos. Si detectamos una
          cuenta de un menor sin la supervisión adecuada, podemos suspenderla.
        </p>
      </LegalSection>

      <LegalSection title="9. Cambios en esta política">
        <p>
          Podemos actualizar esta política para reflejar cambios en el
          servicio o en la normativa. Si el cambio es relevante, lo
          anunciaremos en la plataforma antes de que entre en vigor.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
