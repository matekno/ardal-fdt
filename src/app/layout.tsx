import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Providers } from "./providers";
import { TestModeBanner } from "@/components/ui/TestModeBanner";
import "./globals.css";

const isTestMode = process.env.NODE_ENV === "development";

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
    <html lang="es" className={outfit.variable} data-testmode={isTestMode ? "" : undefined}>
      <body className="antialiased min-h-[100dvh]">
        {isTestMode && <TestModeBanner />}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
