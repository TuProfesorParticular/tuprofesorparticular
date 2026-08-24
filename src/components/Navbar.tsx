import Link from "next/link";
import { auth } from "@/lib/auth";
import { logout } from "@/app/actions";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";

export default async function Navbar() {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);

  return (
    <header className="relative border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/">
          <Logo />
        </Link>

        <div className="hidden items-center gap-4 text-sm font-medium sm:flex">
          <Link href="/" className="text-stone-600 hover:text-stone-900">
            Buscar profesores
          </Link>
          <Link href="/materiales" className="text-stone-600 hover:text-stone-900">
            Materiales
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/panel" className="text-stone-600 hover:text-stone-900">
                Mi panel
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-lg border border-stone-300 px-4 py-2 text-stone-700 hover:bg-stone-50"
                >
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/iniciar-sesion" className="text-stone-600 hover:text-stone-900">
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        <MobileMenu isLoggedIn={isLoggedIn} />
      </nav>
    </header>
  );
}
