import type { Metadata } from "next";
import { Archivo_Black, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CarrinhoProvider } from "@/components/CarrinhoProvider";

const display = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Estamparia Registro — camisetas, DTF e brindes",
  description:
    "Monte seu pedido e receba o orçamento com preço fechado: camisetas em silk e DTF, DTF por metro e brindes personalizados.",
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
