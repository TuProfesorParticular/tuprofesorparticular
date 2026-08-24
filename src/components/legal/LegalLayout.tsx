import type { ReactNode } from "react";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
      <p className="mt-1 text-xs text-stone-400">
        Última actualización: {updated}
      </p>
      <div className="mt-6 space-y-6">{children}</div>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-base font-semibold text-stone-900">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-stone-600">
        {children}
      </div>
    </section>
  );
}
