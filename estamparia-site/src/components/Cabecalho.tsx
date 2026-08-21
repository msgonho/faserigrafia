"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCarrinho } from "./CarrinhoProvider";
import { Logo } from "./Registro";

const links = [
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/calculadora-dtf", texto: "Calculadora de DTF", destaque: true },
  { href: "/como-funciona", texto: "Como funciona" },
  { href: "/contato", texto: "Contato" },
];

export function Cabecalho() {
  const { quantidade, pronto } = useCarrinho();
  const [aberto, setAberto] = useState(false);
  const caminho = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="barra-cmyk rounded-none" style={{ height: 4 }} />
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-5 py-3">
        <Link href="/" onClick={() => setAberto(false)} className="shrink-0">
          <Logo className="h-11 w-auto md:h-12" />
        </Link>

        <nav className="ml-auto hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.texto}
              href={l.href}
              className={`text-[15px] font-medium transition-colors hover:text-azul ${
                l.destaque ? "text-azul" : "text-grafite"
              }`}
            >
              {l.texto}
              {l.destaque && (
                <span className="ml-1.5 rounded-full bg-magenta px-1.5 py-0.5 align-middle text-[10px] font-bold text-white">
                  novo
                </span>
              )}
            </Link>
          ))}
        </nav>

        <Link
          href="/orcamento"
          className={`ml-auto flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-semibold transition-colors lg:ml-0 ${
            caminho === "/orcamento"
              ? "bg-tinta text-white"
              : "bg-azul text-white hover:bg-[#155e96]"
          }`}
        >
          <span className="hidden sm:inline">Meu orçamento</span>
          <span className="sm:hidden">Orçamento</span>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/25 px-1.5 text-[13px]">
            {pronto ? quantidade : 0}
          </span>
        </Link>

        <button
          onClick={() => setAberto((a) => !a)}
          className="shrink-0 lg:hidden"
          aria-label="Abrir menu"
          aria-expanded={aberto}
        >
          <span className="block h-[2px] w-6 rounded bg-tinta" />
          <span className="mt-1.5 block h-[2px] w-6 rounded bg-tinta" />
          <span className="mt-1.5 block h-[2px] w-6 rounded bg-tinta" />
        </button>
      </div>

      {aberto && (
        <nav className="border-t border-linha bg-white px-5 py-2 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.texto}
              href={l.href}
              onClick={() => setAberto(false)}
              className="block border-b border-linha py-3 text-[15px] font-medium text-grafite last:border-0"
            >
              {l.texto}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
