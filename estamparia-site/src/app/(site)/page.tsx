import Link from "next/link";
import { db } from "@/lib/prisma";
import { getAjustes } from "@/lib/settings";
import { CartaoProduto } from "@/components/CartaoProduto";
import { Ilustra } from "@/components/Ilustra";
import { FOTO_CAPA } from "@/lib/fotos";

export const dynamic = "force-dynamic";

const etapas = [
  { titulo: "Você monta o pedido", texto: "Escolhe produto, quantidade, tamanhos e anexa a arte. A estimativa aparece na hora.", cor: "#29ABE2" },
  { titulo: "Conferimos a arte", texto: "Resolução, cores e tamanho da estampa. Se algo não fecha, avisamos com a solução junto.", cor: "#EC008C" },
  { titulo: "Você aprova o valor", texto: "Orçamento fechado com prazo e forma de pagamento. Sem valor surpresa depois.", cor: "#FFC20E" },
  { titulo: "Entra em produção", texto: "Gravação da tela ou impressão do DTF, prensa, conferência peça por peça e entrega.", cor: "#1B75BC" },
];

const paraQuem = [
  { titulo: "Empresas e uniformes", texto: "Camisa de trabalho, polo bordada e boné com a identidade da empresa." },
  { titulo: "Eventos e formaturas", texto: "Tiragens rápidas com nomes, turmas e datas. Grade sortida sem dor de cabeça." },
  { titulo: "Marcas e lojistas", texto: "Do piloto à tiragem, com etiqueta e acabamento pronto para vender." },
  { titulo: "Times e igrejas", texto: "Uniformes com numeração, dry fit e cores fiéis do primeiro ao último." },
];

const duvidas = [
  { p: "Qual a quantidade mínima?", r: "Em malha, 10 peças. No DTF por metro, a partir de 1 metro — e na folha A3, uma unidade." },
  { p: "Em que formato mando a arte?", r: "O ideal é vetor (AI, PDF ou SVG). PNG com fundo transparente em 300 dpi também funciona bem. Se tiver só uma ideia, descreva no pedido que a gente orienta." },
  { p: "Qual o prazo de produção?", r: "De 5 a 7 dias úteis contados da aprovação da arte. Urgência a gente avalia caso a caso." },
  { p: "Vocês entregam em outras cidades?", r: "Sim, enviamos para todo o Brasil. O frete entra no orçamento junto com o valor das peças." },
  { p: "Posso misturar tamanhos no mesmo pedido?", r: "Pode. Escolha “grade sortida” no produto e informe a divisão na observação, por exemplo 10 P, 15 M e 5 G." },
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
      <section className="relative overflow-hidden bg-[#0E0F13] text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={FOTO_CAPA}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0F13] via-[#0E0F13]/85 to-transparent" />
        <div className="malha absolute inset-0 opacity-70 mix-blend-screen" />
        <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 px-5 py-16 md:py-24 lg:grid-cols-[1.05fr_.95fr]">
          <div className="surge">
            <span className="vidro inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium text-white/90">
              <span className="h-2 w-2 rounded-full bg-[#29ABE2]" />
              Serigrafia · DTF · Sublimação · Brindes
            </span>

            <h1 className="mt-6 text-[clamp(2.2rem,5.6vw,3.9rem)] text-white">
              Sua marca estampada
              <br />
              <span className="bg-gradient-to-r from-[#29ABE2] via-[#EC008C] to-[#FFC20E] bg-clip-text text-transparent">
                do jeito profissional
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/70">
              Camisetas, uniformes, DTF por metro e brindes personalizados. Monte o pedido aqui no
              site e receba o orçamento fechado, com prazo e valor certos.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-[15px] font-bold text-tinta transition-transform hover:-translate-y-0.5"
              >
                Pedir orçamento →
              </Link>
              {ajustes.whatsapp && (
                <a
                  href={`https://wa.me/${ajustes.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vidro inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/15"
                >
                  Chamar no WhatsApp
                </a>
              )}
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-7">
              {[
                ["10 peças", "mínimo em malha"],
                ["1 metro", "mínimo no DTF"],
                ["5 a 7 dias", "prazo de produção"],
              ].map(([v, k]) => (
                <div key={k}>
                  <dt className="text-[22px] font-extrabold text-white">{v}</dt>
                  <dd className="mt-1 text-[13px] leading-snug text-white/55">{k}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Mosaico de produtos */}
          <div className="surge grid grid-cols-2 gap-4 [animation-delay:.12s]">
            {[
              { tipo: "camiseta" as const, rot: "-rotate-2" },
              { tipo: "camiseta-vestida" as const, rot: "rotate-2 translate-y-5" },
              { tipo: "moletom" as const, rot: "rotate-1 -translate-y-2" },
              { tipo: "camiseta-cabide" as const, rot: "-rotate-1 translate-y-3" },
            ].map((c) => (
              <div
                key={c.tipo}
                className={`overflow-hidden rounded-2xl bg-white shadow-alto transition-transform duration-500 hover:rotate-0 hover:scale-[1.03] ${c.rot}`}
              >
                <Ilustra tipo={c.tipo} className="aspect-[4/5] h-full w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selos de confiança */}
      <section className="border-b border-linha bg-white">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-10 sm:grid-cols-3">
          {[
            ["Cor fiel do começo ao fim", "Prova impressa antes de rodar a tiragem inteira."],
            ["Resposta em 1 dia útil", "Pedido enviado pelo site não fica esperando."],
            ["Do piloto à tiragem grande", "Mesma qualidade em 10 ou em 1.000 peças."],
          ].map(([t, s], i) => (
            <div key={t} className="flex gap-3">
              <span className="mt-1.5 h-8 w-1.5 shrink-0 rounded-full" style={{ background: cores[i] }} />
              <div>
                <p className="text-[16px] font-bold">{t}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-grafite">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias */}
      <section className="bg-fundo py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="rotulo">Catálogo</p>
          <h2 className="mt-3 text-[clamp(1.7rem,4vw,2.5rem)]">O que a gente produz</h2>
          <div className="barra-cmyk mt-5 w-28" />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categorias.map((c, i) => (
              <Link
                key={c.id}
                href={`/catalogo?cat=${c.slug}`}
                className="group overflow-hidden rounded-2xl border border-linha bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-alto"
              >
                <div className="h-1.5 w-full" style={{ background: cores[i % 4] }} />
                <div className="p-6">
                  <h3 className="text-[19px]">{c.name}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-grafite">{c.description}</p>
                  <p className="mt-5 text-[14px] font-bold text-azul">
                    {c._count.products} {c._count.products === 1 ? "produto" : "produtos"} →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destaques */}
      {destaques.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="rotulo">Mais pedidos</p>
              <h2 className="mt-3 text-[clamp(1.7rem,4vw,2.5rem)]">Sai todo dia da nossa mesa</h2>
              <div className="barra-cmyk mt-5 w-28" />
            </div>
            <Link href="/catalogo" className="text-[15px] font-bold text-azul">
              Ver catálogo completo →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((p) => (
              <CartaoProduto key={p.id} produto={p} />
            ))}
          </div>
        </section>
      )}

      {/* Para quem */}
      <section className="bg-fundo py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="rotulo">Para quem produzimos</p>
          <h2 className="mt-3 text-[clamp(1.7rem,4vw,2.5rem)]">Cada pedido tem sua exigência</h2>
          <div className="barra-cmyk mt-5 w-28" />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {paraQuem.map((q, i) => (
              <div key={q.titulo} className="rounded-2xl bg-white p-6 shadow-cartao">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-[18px] font-extrabold text-white"
                  style={{ background: cores[i % 4], color: cores[i % 4] === "#FFC20E" ? "#17181C" : "#fff" }}
                >
                  {q.titulo.charAt(0)}
                </span>
                <h3 className="mt-4 text-[17px]">{q.titulo}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-grafite">{q.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="malha py-16 text-white md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#29ABE2]">
            Passo a passo
          </p>
          <h2 className="mt-3 text-[clamp(1.7rem,4vw,2.5rem)] text-white">Como funciona o pedido</h2>

          <ol className="mt-12 grid gap-8 md:grid-cols-4">
            {etapas.map((e, i) => (
              <li key={e.titulo} className="vidro rounded-2xl p-6">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-[17px] font-extrabold"
                  style={{ background: e.cor, color: e.cor === "#FFC20E" || e.cor === "#29ABE2" ? "#17181C" : "#fff" }}
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 text-[17px] text-white">{e.titulo}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/65">{e.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Calculadora */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 pb-4">
        <div className="overflow-hidden rounded-3xl border border-linha bg-white">
          <div className="grid gap-8 p-8 md:grid-cols-[1.1fr_.9fr] md:items-center md:p-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-magenta/10 px-3 py-1 text-[13px] font-bold text-magenta">
                Só aqui
              </span>
              <h2 className="mt-4 text-[clamp(1.6rem,3.6vw,2.3rem)]">
                Descubra quanto da sua arte cabe em 1 metro de DTF
              </h2>
              <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-grafite">
                Suba o arquivo, informe o tamanho da estampa e veja o encaixe real no rolo de 58 cm.
                A calculadora testa as duas posições, mostra o aproveitamento e já dá o valor.
              </p>
              <Link href="/calculadora-dtf" className="botao mt-7">
                Abrir a calculadora
              </Link>
            </div>
            <div className="rounded-2xl border border-linha bg-fundo p-6">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] rounded-md border-2"
                    style={{
                      borderColor: cores[i % 4],
                      background: `${cores[i % 4]}22`,
                    }}
                  />
                ))}
              </div>
              <p className="mt-4 text-center text-[13px] font-medium text-grafite">
                9 artes de 18 × 24 cm = 1 metro de rolo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dúvidas */}
      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <p className="rotulo">Dúvidas frequentes</p>
        <h2 className="mt-3 text-[clamp(1.7rem,4vw,2.5rem)]">Antes de você perguntar</h2>
        <div className="barra-cmyk mt-5 w-28" />

        <div className="mt-10 divide-y divide-linha border-y border-linha">
          {duvidas.map((d) => (
            <details key={d.p} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-bold">
                {d.p}
                <span className="shrink-0 text-azul transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-grafite">{d.r}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Chamada final */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 pb-20">
        <div className="faixa-cmyk overflow-hidden rounded-3xl p-1">
          <div className="rounded-[1.35rem] bg-[#0E0F13] px-8 py-14 text-center md:px-16">
            <h2 className="mx-auto max-w-2xl text-[clamp(1.7rem,4.5vw,2.7rem)] text-white">
              Já sabe o que quer estampar?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[17px] leading-relaxed text-white/65">
              Monte o pedido em dois minutos. A resposta chega no seu WhatsApp com o valor fechado.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/catalogo"
                className="rounded-xl bg-white px-8 py-3.5 text-[15px] font-bold text-tinta transition-transform hover:-translate-y-0.5"
              >
                Começar meu orçamento
              </Link>
              {ajustes.whatsapp && (
                <a
                  href={`https://wa.me/${ajustes.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vidro rounded-xl px-8 py-3.5 text-[15px] font-semibold text-white"
                >
                  Falar com a gente
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
