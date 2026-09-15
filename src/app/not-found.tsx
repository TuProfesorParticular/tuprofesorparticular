import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <LogoMark className="h-16 w-16" />
      <h1 className="mt-6 text-3xl font-bold text-stone-900">
        Esta página no existe
      </h1>
      <p className="mt-2 text-stone-500">
        Puede que el enlace esté roto o que la página se haya movido.
        Prueba a volver al inicio.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-200 transition hover:from-teal-700 hover:to-emerald-600"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
