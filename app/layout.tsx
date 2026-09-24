import "../styles/globals.css";
import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://mercau.co";

export const metadata: Metadata = {
  applicationName: "Mercáu",
  title: "Mercáu | Directorio Digital del Bajo Cauca",
  description:
    "Mercáu es el directorio digital del Bajo Cauca para encontrar negocios locales, contactar por WhatsApp e inscribir comercios.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Mercáu",
    title: "Mercáu | Directorio Digital del Bajo Cauca",
    description:
      "Encuentra negocios del Bajo Cauca, contacta por WhatsApp o inscribe tu negocio en el directorio digital.",
    url: "/",
    images: [
      {
        url: "/og-mercau.jpg",
        width: 1200,
        height: 630,
        alt: "Mercáu, Directorio Digital del Bajo Cauca"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mercáu | Directorio Digital del Bajo Cauca",
    description:
      "Encuentra negocios del Bajo Cauca, contacta por WhatsApp o inscribe tu negocio en el directorio digital.",
    images: ["/og-mercau.jpg"]
  }
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
            <span>Directorio Digital del Bajo Cauca. MVP para validar visibilidad, inscripciones y contacto local.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
