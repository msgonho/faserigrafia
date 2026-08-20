"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const itens = [
  { href: "/admin", texto: "Início" },
  { href: "/admin/orcamentos", texto: "Orçamentos" },
  { href: "/admin/produtos", texto: "Produtos" },
  { href: "/admin/categorias", texto: "Categorias" },
  { href: "/admin/usuarios", texto: "Usuários" },
  { href: "/admin/config", texto: "Ajustes" },
];

export function NavAdmin() {
  const caminho = usePathname();

  return (
    <nav className="flex flex-1 gap-1 overflow-x-auto">
      {itens.map((i) => {
        const ativo = i.href === "/admin" ? caminho === "/admin" : caminho.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            className={`whitespace-nowrap px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
              ativo ? "bg-papel text-tinta" : "text-papel/60 hover:text-amarelo"
            }`}
          >
            {i.texto}
          </Link>
        );
      })}
    </nav>
  );
}
