import Link from "next/link";
import { exigirSessao } from "@/lib/auth";
import { sair } from "./acoes";
import { NavAdmin } from "@/components/NavAdmin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sessao = await exigirSessao();

  return (
    <div className="min-h-screen bg-papel">
      <header className="sticky top-0 z-40 border-b border-tinta bg-tinta text-papel">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-3">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center bg-papel">
              <span className="block h-2 w-2 rounded-full bg-magenta" />
            </span>
            <span className="font-display text-[13px] uppercase leading-none">Painel</span>
          </Link>

          <NavAdmin />

          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-papel/50 hover:text-amarelo sm:block"
            >
              ver site ↗
            </Link>
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-papel/50 md:block">
              {sessao.nome}
            </span>
            <form action={sair}>
              <button className="font-mono text-[11px] uppercase tracking-[0.14em] text-papel/50 hover:text-magenta">
                sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">{children}</div>
    </div>
  );
}
