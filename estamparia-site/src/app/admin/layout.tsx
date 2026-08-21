import Link from "next/link";
import { exigirSessao } from "@/lib/auth";
import { sair } from "./acoes";
import { NavAdmin } from "@/components/NavAdmin";
import { Logo } from "@/components/Registro";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sessao = await exigirSessao();

  return (
    <div className="min-h-screen bg-fundo">
      <header className="sticky top-0 z-40 border-b border-tinta bg-tinta text-white">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-5 py-3">
          <Link href="/admin" className="flex shrink-0 items-center gap-3">
            <span className="rounded-md bg-white px-2 py-1">
              <Logo className="h-6 w-auto" />
            </span>
            <span className="hidden text-[14px] font-semibold sm:block">Painel</span>
          </Link>

          <NavAdmin />

          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden text-[14px] font-medium text-white/70 hover:text-ciano sm:block"
            >
              ver site ↗
            </Link>
            <span className="hidden text-[14px] font-medium text-white/70 md:block">
              {sessao.nome}
            </span>
            <form action={sair}>
              <button className="text-[14px] font-medium text-white/70 hover:text-azul">
                sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-8">{children}</div>
    </div>
  );
}
