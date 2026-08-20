import Link from "next/link";
import { db } from "@/lib/prisma";
import { getAjustes } from "@/lib/settings";
import { Logo } from "@/components/Registro";
import { CartaoProduto } from "@/components/CartaoProduto";

export const dynamic = "force-dynamic";

const etapas = [
  {
    titulo: "Você monta o pedido",
    texto:
      "Escolhe o produto, a quantidade, os tamanhos e anexa a arte. O site já mostra uma estimativa de valor na hora.",
    cor: "#29ABE2",
  },
  {
    titulo: "Conferimos a arte",
    texto:
      "Verificamos resolução, cores e tamanho da estampa. Se algo não fecha, avisamos junto com a solução.",
    cor: "#EC008C",
  },
  {
    titulo: "Você aprova o valor",
    texto: "Enviamos o orçamento fechado, com prazo e forma de pagamento. Sem surpresa depois.",
    cor: "#FFC20E",
  },
  {
    titulo: "Entra em produção",
    texto: "Gravação da tela ou impressão do DTF, prensa, conferência peça por peça e entrega.",
    cor: "#17181C",
  },
];

const diferenciais = [
  { titulo: "Tiragem a partir de 1 peça", texto: "No DTF você imprime só o que precisa, sem lote mínimo alto." },
  { titulo: "Cor fiel do primeiro ao último", texto: "Padronização de tinta e prova antes de rodar a tiragem." },
  { titulo: "Orçamento no mesmo dia", texto: "Pedido enviado pelo site é respondido em até 1 dia útil." },
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

  const cores = ["#29ABE2", "#EC008C", "#FFC20E", "#1B75BC"];

  return (
    <>
      {/* Topo */}
      <section className="border-b border-linha bg-fundo">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 md:grid-cols-[1.1fr_.9fr] md:py-20">
          <div>
            <p className="rotulo">Serigrafia · DTF · Brindes personalizados</p>
            <h1 className="mt-4 text-[clamp(2rem,5vw,3.2rem)]">
              Sua marca estampada com acabamento profissional
            </h1>
            <div className="barra-cmyk mt-6 w-40" />
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-grafite">
              Camisetas, uniformes, DTF por metro e brindes. Monte seu pedido aqui no site e receba
              o orçamento fechado, com prazo e valor certos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalogo" className="botao">
                Pedir orçamento
              </Link>
              {ajustes.whatsapp && (
                <a
                  href={`https://wa.me/${ajustes.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="botao-vazado"
                >
                  Chamar no WhatsApp
                </a>
              )}
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-linha pt-6">
              {[
                ["Mínimo", "10 peças"],
                ["DTF", "a partir de 1 m"],
                ["Prazo", "5 a 7 dias"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[13px] font-medium text-cinza">{k}</dt>
                  <dd className="mt-0.5 text-[17px] font-bold text-tinta">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex justify-center">
            <div className="rounded-2xl bg-white p-8 shadow-alto">
              <Logo variante="redondo" className="mx-auto h-56 w-56 md:h-64 md:w-64" />
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {diferenciais.map((d, i) => (
            <div key={d.titulo} className="flex gap-4">
              <span
                className="mt-1 h-10 w-1.5 shrink-0 rounded-full"
                style={{ background: cores[i] }}
              />
              <div>
                <h3 className="text-[17px]">{d.titulo}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-grafite">{d.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias */}
      <section className="bg-fundo py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-[clamp(1.6rem,3.5vw,2.2rem)]">O que a gente produz</h2>
          <div className="barra-cmyk mt-4 w-28" />

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categorias.map((c, i) => (
              <Link
                key={c.id}
                href={`/catalogo?cat=${c.slug}`}
                className="group rounded-xl border border-linha bg-white p-6 shadow-cartao transition-shadow hover:shadow-alto"
              >
                <span
                  className="block h-2.5 w-10 rounded-full"
                  style={{ background: cores[i % 4] }}
                />
                <h3 className="mt-4 text-[18px]">{c.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-grafite">{c.description}</p>
                <p className="mt-5 text-[14px] font-semibold text-azul">
                  Ver {c._count.products} {c._count.products === 1 ? "produto" : "produtos"} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destaques */}
      {destaques.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[clamp(1.6rem,3.5vw,2.2rem)]">Mais pedidos</h2>
              <div className="barra-cmyk mt-4 w-28" />
            </div>
            <Link href="/catalogo" className="text-[15px] font-semibold text-azul">
              Ver catálogo completo →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((p) => (
              <CartaoProduto key={p.id} produto={p} />
            ))}
          </div>
        </section>
      )}

      {/* Como funciona */}
      <section id="como-funciona" className="bg-tinta py-16 text-white">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-[clamp(1.6rem,3.5vw,2.2rem)] text-white">Como funciona o pedido</h2>
          <div className="barra-cmyk mt-4 w-28" />
          <ol className="mt-10 grid gap-8 md:grid-cols-4">
            {etapas.map((e, i) => (
              <li key={e.titulo}>
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[16px] font-bold"
                  style={{
                    background: e.cor,
                    color: e.cor === "#FFC20E" || e.cor === "#29ABE2" ? "#17181C" : "#fff",
                    boxShadow: e.cor === "#17181C" ? "0 0 0 2px rgba(255,255,255,.35)" : undefined,
                  }}
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 text-[17px] text-white">{e.titulo}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/70">{e.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Chamada final */}
      <section className="mx-auto max-w-6xl px-5 py-16 text-center">
        <h2 className="mx-auto max-w-2xl text-[clamp(1.6rem,4vw,2.4rem)]">
          Já sabe o que quer estampar?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[17px] leading-relaxed text-grafite">
          Monte o pedido em dois minutos. Você recebe o orçamento no WhatsApp ou no e-mail.
        </p>
        <Link href="/catalogo" className="botao mt-8">
          Começar meu orçamento
        </Link>
      </section>
    </>
  );
}
