import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Aviso Legal · TuProfesorParticular",
};

export default function AvisoLegalPage() {
  return (
    <LegalLayout title="Aviso Legal" updated="24 de agosto de 2026">
      <LegalSection title="1. Identificación del titular">
        <p>
          En cumplimiento del deber de información recogido en el artículo 10
          de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
          Información y del Comercio Electrónico (LSSICE), se informa de los
          siguientes datos:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Titular: Carlos Salazar Guzmán</li>
          <li>NIF: 74388626W</li>
          <li>Domicilio: Calle Andrés Perpiñán, nº 15, 3ºD, 03203 Elche (Alicante), España</li>
          <li>
            Correo de contacto:{" "}
            <a href="mailto:contacto@tuprofesorparticular.es" className="text-teal-600 hover:underline">
              contacto@tuprofesorparticular.es
            </a>
          </li>
          <li>Nombre del sitio: TuProfesorParticular</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Objeto">
        <p>
          TuProfesorParticular es una plataforma que pone en contacto a
          alumnos con profesores particulares, entrenadores y profesionales
          de la salud mental (en adelante, &ldquo;profesionales&rdquo;), permitiendo la
          búsqueda, el contacto directo y, en algunos casos, la reserva y el
          pago de la primera clase a través del sitio.
        </p>
        <p>
          El acceso y uso del sitio atribuye la condición de usuario y
          supone la aceptación, desde ese mismo momento, de las condiciones
          recogidas en este Aviso Legal, en los{" "}
          <a href="/terminos" className="text-teal-600 hover:underline">
            Términos y Condiciones
          </a>{" "}
          y en la{" "}
          <a href="/privacidad" className="text-teal-600 hover:underline">
            Política de Privacidad
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="3. Condiciones de acceso y uso">
        <p>
          El uso del sitio es gratuito para navegar y para registrarse. El
          detalle de las condiciones de uso, los planes de pago y las
          obligaciones de cada tipo de usuario se recogen en los{" "}
          <a href="/terminos" className="text-teal-600 hover:underline">
            Términos y Condiciones
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="4. Propiedad intelectual e industrial">
        <p>
          El diseño del sitio, el código fuente, los logotipos, las marcas y
          los demás elementos gráficos son titularidad de
          TuProfesorParticular o de sus licenciantes, salvo el contenido
          subido por los propios usuarios (materiales, presentaciones,
          fotos de perfil), sobre el que cada usuario conserva sus derechos
          en los términos descritos en los Términos y Condiciones.
        </p>
      </LegalSection>

      <LegalSection title="5. Legislación aplicable">
        <p>
          Este Aviso Legal se rige por la legislación española. Para
          cualquier controversia derivada del acceso o uso del sitio, las
          partes se someten a los juzgados y tribunales que correspondan
          conforme a la normativa de protección de personas consumidoras
          aplicable.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
