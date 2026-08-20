import Link from "next/link";
import { Logo } from "@/components/Registro";

export default function NaoEncontrado() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Logo className="h-14 w-auto" />
      <div className="barra-cmyk mt-8 w-24" />
      <h1 className="mt-6 text-[clamp(1.6rem,5vw,2.4rem)]">Página não encontrada</h1>
      <p className="mt-4 max-w-md text-[16px] leading-relaxed text-grafite">
        O endereço não existe ou o produto saiu do catálogo. Volte para a lista e escolha outro.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/catalogo" className="botao">
          Ver o catálogo
        </Link>
        <Link href="/" className="botao-vazado">
          Página inicial
        </Link>
      </div>
    </div>
  );
}
