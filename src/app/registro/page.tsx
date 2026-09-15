import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta · TuProfesorParticular",
};

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; role?: string }>;
}) {
  const { ref, role } = await searchParams;
  const defaultRole = role === "teacher" ? "teacher" : "student";

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-stone-900">Crear cuenta</h1>
      <p className="mt-1 text-sm text-stone-500">
        Regístrate como alumno para buscar y contactar profesores, o como
        profesor para publicar tu anuncio.
      </p>

      <RegisterForm referralId={ref} defaultRole={defaultRole} />
    </main>
  );
}
