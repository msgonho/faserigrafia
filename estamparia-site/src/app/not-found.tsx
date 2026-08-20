import Link from "next/link";
import { Registro } from "@/components/Registro";

export default function NaoEncontrado() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="rotulo">Erro 404</p>
      <h1 className="mt-5 text-[clamp(2rem,7vw,4rem)]">
        <Registro>Fora de registro.</Registro>
      </h1>
      <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-grafite">
        Essa página não existe — ou o produto saiu do catálogo. Volte para a lista e escolha outro.
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
