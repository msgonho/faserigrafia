import type { Metadata } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CarrinhoProvider } from "@/components/CarrinhoProvider";

const display = Archivo({ subsets: ["latin"], variable: "--font-display" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "F&A Serigrafia — camisetas, DTF e brindes personalizados",
  description:
    "Peça seu orçamento online: camisetas em silk e DTF, DTF por metro, uniformes e brindes personalizados.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans">
        <CarrinhoProvider>{children}</CarrinhoProvider>
      </body>
    </html>
  );
}
