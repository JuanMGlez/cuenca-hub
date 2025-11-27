import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import QueryProvider from "@/components/QueryProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cuenca Hub - Plataforma de Saneamiento Lerma-Chapala-Santiago",
  description: "Plataforma digital para la visualización, monitoreo y coordinación del saneamiento y restauración de la cuenca Lerma-Chapala-Santiago",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
