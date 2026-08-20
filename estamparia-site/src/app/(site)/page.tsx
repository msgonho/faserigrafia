import Link from "next/link";
import { db } from "@/lib/prisma";
import { getAjustes } from "@/lib/settings";
import { Registro } from "@/components/Registro";
import { CartaoProduto } from "@/components/CartaoProduto";

export const dynamic = "force-dynamic";

const etapas = [
  {
    titulo: "Você monta o pedido",
    texto:
      "Escolhe o produto, a grade de tamanhos, a quantidade e anexa o link da arte. O site já mostra uma estimativa na hora.",
  },
  {
    titulo: "A gente confere a arte",
    texto:
      "Olhamos resolução, cor e tamanho de estampa. Se algo não fecha, avisamos com a solução — não só com o problema.",
  },
  {
    titulo: "Você aprova o preço",
    texto: "Devolvemos o orçamento fechado, com prazo e forma de pagamento. Sem valor surpresa depois.",
  },
  {
    titulo: "Entra na produção",
    texto: "Gravação de tela ou impressão do rolo, prensa, conferência peça por peça e envio.",
  },
];

export default async function Home() {
  const ajustes = await getAjustes();

  const [categorias, destaques] = await Promise.all([
    db.category.findMany({
      orderBy: { position: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    db.product.findMany({
      where: { active: true },
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
      take: 6,
      include: { tiers: true, category: { select: { name: true } } },
    }),
  ]);

  const [chamada1, chamada2] = (ajustes.chamada || "Tira da cabeça. Coloca na camiseta.").split(
    /\.\s+/
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-tinta">
        <div className="reticula pointer-events-none absolute inset-0 text-grafite/25" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.35fr_1fr] md:py-24">
          <div>
            <p className="rotulo">Serigrafia · DTF · Brindes</p>
            <h1 className="mt-5 text-[clamp(2.4rem,7.5vw,4.6rem)]">
              <Registro>{chamada1 ? `${chamada1}.` : "Tira da cabeça."}</Registro>
              <br />
              <span className="text-grafite">{chamada2 || "Coloca na camiseta."}</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-grafite">
              Monte o pedido do jeito que você precisa e receba o orçamento fechado. Uma camiseta ou
              quinhentas, um metro de DTF ou o rolo inteiro.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalogo" className="botao">
                Montar meu orçamento
              </Link>
              {ajustes.whatsapp && (
                <a
                  href={`https://wa.me/${ajustes.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="botao-vazado"
                >
                  Falar no WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Ficha técnica: o cartão que fica preso na tela na hora de gravar. */}
          <aside className="ficha self-start p-6">
            <p className="rotulo border-b border-linha pb-3">Ficha técnica da casa</p>
            <dl className="divide-y divide-linha">
              {[
                ["Tiragem mínima", "10 peças em malha"],
                ["DTF", "a partir de 1 metro"],
                ["Cores no silk", "até 6 por lado"],
                ["Prazo", ajustes.prazoPadrao || "combinado por pedido"],
                ["Arte", "vetor, PNG 300dpi ou PDF"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-grafite">
                    {k}
                  </dt>
                  <dd className="text-right text-[13px] font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* Categorias */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="rotulo">O que a gente faz</p>
        <div className="mt-6 grid gap-px border border-tinta bg-tinta sm:grid-cols-2 lg:grid-cols-4">
          {categorias.map((c, i) => (
            <Link
              key={c.id}
              href={`/catalogo?cat=${c.slug}`}
              className="group relative bg-papel p-6 transition-colors hover:bg-white"
            >
              <span
                className="block h-3 w-3"
                style={{ background: ["#E5007E", "#00A3E0", "#FFD200", "#12131A"][i % 4] }}
              />
              <h3 className="mt-5 text-[19px] leading-tight">{c.name}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-grafite">{c.description}</p>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-grafite transition-colors group-hover:text-magenta">
                {c._count.products} {c._count.products === 1 ? "produto" : "produtos"} →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Destaques */}
      {destaques.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-16">
          <div className="flex items-end justify-between gap-4 border-b border-tinta pb-4">
            <h2 className="text-3xl">Sai mais da mesa</h2>
            <Link
              href="/catalogo"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-grafite hover:text-magenta"
            >
              ver tudo →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((p) => (
              <CartaoProduto key={p.id} produto={p} />
            ))}
          </div>
        </section>
      )}

      {/* Como funciona — aqui a ordem importa de verdade, então vai numerado. */}
      <section id="como-funciona" className="border-y border-tinta bg-tinta text-papel">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="rotulo text-papel/50">Do pedido à entrega</p>
          <h2 className="mt-4 max-w-lg text-3xl md:text-4xl">Quatro passos, nenhuma surpresa</h2>
          <ol className="mt-10 grid gap-px bg-papel/20 md:grid-cols-4">
            {etapas.map((e, i) => (
              <li key={e.titulo} className="bg-tinta p-6">
                <span className="font-mono text-[11px] tracking-[0.2em] text-amarelo">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-[17px] leading-tight">{e.titulo}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-papel/65">{e.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Chamada final */}
      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <h2 className="mx-auto max-w-2xl text-[clamp(1.8rem,5vw,3rem)]">
          Já sabe o que quer estampar?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-grafite">
          Monte o pedido em dois minutos. Você recebe o orçamento fechado no WhatsApp ou no e-mail.
        </p>
        <Link href="/catalogo" className="botao mt-8">
          Começar agora
        </Link>
      </section>
    </>
  );
}
