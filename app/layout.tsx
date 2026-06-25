import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gama Studio | Fotografía y video",
  description:
    "Fotografía y video profesional para sesiones personales, bodas, cumpleaños, eventos sociales y negocios.",
  keywords: [
    "Gama Studio",
    "fotografía",
    "video",
    "fotografía de eventos",
    "sesiones personales",
    "bodas",
    "cumpleaños",
    "fotografía para negocios",
  ],
  openGraph: {
    title: "Gama Studio | Fotografía y video",
    description:
      "Capturamos tus momentos especiales con fotografía y video profesional.",
    url: "https://www.gamastudiomx.com",
    siteName: "Gama Studio",
    images: [
      {
        url: "/images/og-gama-studio.png",
        width: 1200,
        height: 630,
        alt: "Gama Studio Fotografía y Video",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gama Studio | Fotografía y video",
    description:
      "Fotografía y video profesional para sesiones, eventos, bodas y negocios.",
    images: ["/images/og-gama-studio.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}