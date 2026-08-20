import { FormularioOrcamento } from "@/components/FormularioOrcamento";

export const metadata = { title: "Meu orçamento — Estamparia Registro" };

export default function PaginaOrcamento() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <p className="rotulo">Fechando o pedido</p>
      <h1 className="mt-4 text-[clamp(2rem,5vw,3rem)]">Meu orçamento</h1>
      <p className="mt-3 max-w-lg text-[15px] text-grafite">
        Confira os itens, deixe seu contato e envie. A gente responde com o preço fechado e o prazo.
      </p>
      <FormularioOrcamento />
    </div>
  );
}
