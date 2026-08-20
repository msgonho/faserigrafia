import Link from "next/link";
import { FormLogin } from "@/components/FormLogin";
import { Logo } from "@/components/Registro";

export const metadata = { title: "Entrar no painel — F&A Serigrafia" };
export const dynamic = "force-dynamic";

export default async function Entrar({ searchParams }: { searchParams: Promise<{ de?: string }> }) {
  const { de } = await searchParams;

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden flex-1 flex-col justify-between bg-tinta p-12 text-white lg:flex">
        <div className="inline-block w-fit rounded-xl bg-white p-3">
          <Logo className="h-12 w-auto" />
        </div>
        <div>
          <div className="barra-cmyk w-32" />
          <p className="mt-6 max-w-sm text-[26px] font-bold leading-snug">
            Todo orçamento pedido no site chega aqui.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="lg:hidden">
            <Logo className="h-12 w-auto" />
          </Link>
          <h1 className="mt-8 text-2xl">Entrar no painel</h1>
          <p className="mt-2 text-[15px] text-grafite">Acesso para a equipe da produção.</p>
          <FormLogin de={de} />
          <Link href="/" className="mt-8 inline-block text-[14px] font-medium text-azul">
            ← Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
}
