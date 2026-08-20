import "../styles/globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mercáu | Directorio Digital de Nechí",
  description:
    "Mercáu es el directorio digital de Nechí para encontrar negocios locales, contactar por WhatsApp e inscribir comercios.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://bajo-cauca-conecta.vercel.app"
  )
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
          <div className="container flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-3 font-black text-xl tracking-tight">
              <img
                src="/logo-mercau.png"
                alt="Mercáu"
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span>Mercáu</span>
            </Link>
            <nav className="flex gap-4 text-sm font-bold text-slate-600">
              <Link href="/#directorio" className="hover:text-emerald-700">
                Directorio
              </Link>
              <Link href="/#inscripcion" className="hover:text-emerald-700">
                Inscribir
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t bg-white">
          <div className="container flex flex-wrap justify-between gap-3 py-8 text-sm text-slate-600">
            <strong className="text-slate-900">Mercáu</strong>
            <span>Directorio Digital de Nechí. MVP para validar visibilidad, inscripciones y contacto local.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
