import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FDT — Fin de Turno | Ardal / Retak",
  description: "Reporte de producción por turno",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={outfit.variable}>
      <body className="antialiased min-h-[100dvh]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
