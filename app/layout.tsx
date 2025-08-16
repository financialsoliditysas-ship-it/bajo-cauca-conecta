import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bajo Cauca Conecta",
  description: "Marketplace local para conectar productos y servicios del Bajo Cauca Antioqueño.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <header className="border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/80 sticky top-0 z-50">
          <div className="container flex items-center justify-between py-3">
            <Link href="/" className="font-bold text-xl tracking-tight">
              Bajo Cauca <span className="text-sky-600">Conecta</span>
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/listings" className="hover:text-sky-700">Listados</Link>
              <Link href="/contacto" className="hover:text-sky-700">Contacto</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t mt-10">
          <div className="container py-8 text-sm text-slate-600">
            © {new Date().getFullYear()} Bajo Cauca Conecta — Hecho con Next.js
          </div>
        </footer>
      </body>
    </html>
  );
}
