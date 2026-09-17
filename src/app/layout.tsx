import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieNotice from "@/components/CookieNotice";
import AdSenseLoader from "@/components/AdSenseLoader";
import Analytics from "@/components/Analytics";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.APP_URL || "https://tuprofesorparticular.es";
// No configurado hasta que se apruebe la cuenta de Google AdSense — con la
// variable vacía, AdSlot no renderiza nada y este script ni se carga.
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "TuProfesorParticular — Encuentra tu profesor ideal",
  description:
    "Conecta con profesores particulares, entrenadores y profesionales de la salud mental por materia, ubicación y modalidad.",
};

// Ficha de la organización para buscadores (rich results / knowledge panel)
// — no afecta a lo que ve el usuario, solo a cómo interpretan la web Google
// y similares.
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TuProfesorParticular",
  url: APP_URL,
  sameAs: [] as string[],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        {ADSENSE_CLIENT_ID && <AdSenseLoader clientId={ADSENSE_CLIENT_ID} />}
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieNotice />
        <Analytics />
      </body>
    </html>
  );
}
