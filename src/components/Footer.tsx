import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-stone-500 sm:flex-row">
        <p>© {new Date().getFullYear()} TuProfesorParticular</p>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <Link href="/materiales" className="hover:text-stone-700">
            Materiales
          </Link>
          <Link href="/canal-etico" className="hover:text-stone-700">
            Canal ético
          </Link>
          <Link href="/aviso-legal" className="hover:text-stone-700">
            Aviso legal
          </Link>
          <Link href="/terminos" className="hover:text-stone-700">
            Términos
          </Link>
          <Link href="/privacidad" className="hover:text-stone-700">
            Privacidad
          </Link>
          <Link href="/cookies" className="hover:text-stone-700">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}
