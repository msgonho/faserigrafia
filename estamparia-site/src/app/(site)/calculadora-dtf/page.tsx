import { db } from "@/lib/prisma";
import { CalculadoraDTF } from "@/components/CalculadoraDTF";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Calculadora de DTF — quanto da sua arte cabe em 1 metro",
  description:
    "Suba sua arte, informe o tamanho e veja quantas peças cabem no metro de DTF, com o valor estimado na hora.",
};

export default async function PaginaCalculadora() {
  const p = await db.product.findFirst({
    where: { unit: "METRO", active: true },
    include: { tiers: true },
    orderBy: { position: "asc" },
  });

  const produto = p
    ? {
        id: p.id,
        slug: p.slug,
        name: p.name,
        minQty: p.minQty,
        basePrice: p.basePrice,
        tiers: p.tiers.map((t) => ({ minQty: t.minQty, price: t.price })),
      }
    : null;

  return (
    <div>
      <div className="malha text-white">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#29ABE2]">
            Ferramenta exclusiva
          </p>
          <h1 className="mt-3 max-w-2xl text-[clamp(1.9rem,5vw,3rem)] text-white">
            Quanto da sua arte cabe em 1 metro de DTF
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/70">
            Suba o arquivo, diga o tamanho que a estampa vai ter na peça e veja o encaixe real no
            rolo de 58 cm — com a metragem e o valor calculados na hora.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-12">
        <CalculadoraDTF produto={produto} />

        <div className="mt-14 grid gap-6 border-t border-linha pt-10 md:grid-cols-3">
          {[
            [
              "Por que o encaixe importa",
              "O DTF é vendido por metro linear de um rolo de 58 cm. Quanto melhor as artes se encaixam lado a lado, menos metro você paga pela mesma quantidade de estampas.",
            ],
            [
              "Girar a arte economiza",
              "Uma arte de 20 × 25 cm cabe 2 vezes por fileira em pé, e 2 vezes deitada — mas o comprimento gasto muda. A calculadora testa as duas posições e mostra a mais barata.",
            ],
            [
              "Sua imagem não sai do navegador",
              "O arquivo que você escolhe aqui serve só para a prévia na sua tela. Nada é enviado para a gente até você mandar o pedido de orçamento.",
            ],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="text-[17px]">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-grafite">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
