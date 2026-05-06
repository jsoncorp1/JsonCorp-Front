import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JsonCorp | Automatiza tu empresa. Crece sin límites.",
  description:
    "Desarrollamos sistemas a medida, aplicaciones móviles, CRM, ERP e inteligencia artificial para empresas bolivianas. Reducimos costos y automatizamos procesos.",
  keywords:
    "desarrollo de software Bolivia, sistemas empresariales, CRM Bolivia, ERP Bolivia, inteligencia artificial, apps móviles",
  openGraph: {
    title: "JsonCorp | Software que transforma empresas",
    description:
      "Soluciones de software a medida para empresas bolivianas. CRM, ERP, Apps y AI.",
    url: "https://jsoncorp.com",
    siteName: "JsonCorp",
    locale: "es_BO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
