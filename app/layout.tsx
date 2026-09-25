import "../styles/globals.css";
import type { Metadata } from "next";

const siteUrl = "https://www.mercau.co";

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
        <main>{children}</main>
      </body>
    </html>
  );
}
