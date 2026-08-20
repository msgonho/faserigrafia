"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCarrinho } from "./CarrinhoProvider";

const links = [
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/catalogo?cat=dtf", texto: "DTF por metro" },
  { href: "/catalogo?cat=brindes", texto: "Brindes" },
  { href: "/#como-funciona", texto: "Como funciona" },
];

export function Cabecalho() {
  const { quantidade, pronto } = useCarrinho();
  const [aberto, setAberto] = useState(false);
  const caminho = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-tinta bg-papel/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setAberto(false)}>
          <span className="flex h-7 w-7 items-center justify-center bg-tinta">
            <span className="block h-2.5 w-2.5 rounded-full bg-magenta" />
          </span>
          <span className="font-display text-[15px] uppercase leading-none tracking-tight">
            Registro
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.texto}
              href={l.href}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-grafite transition-colors hover:text-magenta"
            >
              {l.texto}
            </Link>
          ))}
        </nav>

        <Link
          href="/orcamento"
          className={`ml-auto flex items-center gap-2 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors md:ml-0 ${
            caminho === "/orcamento"
              ? "border-magenta bg-magenta text-white"
              : "border-tinta text-tinta hover:bg-tinta hover:text-papel"
          }`}
        >
          Meu orçamento
          <span className="flex h-5 min-w-5 items-center justify-center bg-magenta px-1 text-white">
            {pronto ? quantidade : 0}
          </span>
        </Link>

        <button
          onClick={() => setAberto((a) => !a)}
          className="md:hidden"
          aria-label="Abrir menu"
          aria-expanded={aberto}
        >
          <span className="block h-[2px] w-6 bg-tinta" />
          <span className="mt-1.5 block h-[2px] w-6 bg-tinta" />
          <span className="mt-1.5 block h-[2px] w-4 bg-tinta" />
        </button>
      </div>

      {aberto && (
        <nav className="border-t border-linha bg-papel px-5 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.texto}
              href={l.href}
              onClick={() => setAberto(false)}
              className="block py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-grafite"
            >
              {l.texto}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
