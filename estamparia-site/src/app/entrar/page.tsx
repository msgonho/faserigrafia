import Link from "next/link";
import { FormLogin } from "@/components/FormLogin";
import { Registro } from "@/components/Registro";

export const metadata = { title: "Entrar no painel" };
export const dynamic = "force-dynamic";

export default async function Entrar({ searchParams }: { searchParams: Promise<{ de?: string }> }) {
  const { de } = await searchParams;

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden flex-1 items-end overflow-hidden border-r border-tinta bg-tinta p-12 text-papel lg:flex">
        <div className="reticula pointer-events-none absolute inset-0 text-papel/25" />
        <div className="relative">
          <p className="rotulo text-papel/50">Painel da equipe</p>
          <p className="mt-4 max-w-sm font-display text-4xl uppercase leading-[0.95]">
            Todo pedido que entra pelo site cai aqui.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="font-display text-2xl uppercase">
            <Registro>Registro</Registro>
          </Link>
          <h1 className="mt-8 text-2xl">Entrar</h1>
          <p className="mt-2 text-sm text-grafite">Acesso para quem trabalha na produção.</p>
          <FormLogin de={de} />
          <Link
            href="/"
            className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-grafite hover:text-magenta"
          >
            ← voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
}
