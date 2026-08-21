import Link from "next/link";
import { getAjustes } from "@/lib/settings";
import { Ilustra } from "@/components/Ilustra";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Como funciona — F&A Serigrafia",
  description: "Do pedido de orçamento à entrega: como a gente trabalha, prazos e formatos de arte.",
};

const etapas = [
  {
    n: "01",
    cor: "#29ABE2",
    titulo: "Você monta o pedido no site",
    texto:
      "Escolhe o produto, a quantidade e a grade de tamanhos. O site mostra uma estimativa na hora, com base na faixa de quantidade — quanto maior a tiragem, menor o preço por peça.",
    detalhe: "Leva uns dois minutos. Não precisa criar conta.",
  },
  {
    n: "02",
    cor: "#EC008C",
    titulo: "Conferimos o arquivo",
    texto:
      "Olhamos resolução, modo de cor e o tamanho que a estampa vai ter na peça. Também avaliamos o número de cores, que é o que define entre silk e DTF.",
    detalhe: "Se algo não fecha, avisamos com a solução junto — nunca só com o problema.",
  },
  {
    n: "03",
    cor: "#FFC20E",
    titulo: "Você recebe o valor fechado",
    texto:
      "Respondemos em até 1 dia útil com o preço final, o prazo de entrega e a forma de pagamento. Nada de valor que muda depois.",
    detalhe: "Chega no WhatsApp ou no e-mail, como você preferir.",
  },
  {
    n: "04",
    cor: "#1B75BC",
    titulo: "Aprovação da arte",
    texto:
      "Antes de rodar a tiragem, mandamos a prova: como a estampa fica posicionada, em que tamanho e em qual cor de peça. Só entra em produção com seu ok.",
    detalhe: "É aqui que o prazo começa a contar.",
  },
  {
    n: "05",
    cor: "#F58220",
    titulo: "Produção",
    texto:
      "Gravação da tela no silk ou impressão do rolo no DTF, prensa térmica com tempo e pressão controlados, e conferência peça por peça antes de embalar.",
    detalhe: "De 5 a 7 dias úteis na maioria dos pedidos.",
  },
  {
    n: "06",
    cor: "#17181C",
    titulo: "Entrega",
    texto:
      "Retirada aqui na loja em Botucatu ou envio para todo o Brasil. O frete entra no orçamento junto com o valor das peças, sem cobrança surpresa na entrega.",
    detalhe: "Peças conferidas e embaladas por tamanho.",
  },
];

const tecnicas = [
  {
    tipo: "camiseta-vestida" as const,
    nome: "Serigrafia (silk)",
    quando: "Tiragens médias e grandes com poucas cores",
    pontos: [
      "Melhor custo por peça a partir de 50 unidades",
      "Toque macio e durabilidade alta na lavagem",
      "Até 6 cores por lado, cada cor é uma tela",
    ],
  },
  {
    tipo: "dtf-rolo" as const,
    nome: "DTF",
    quando: "Poucas peças ou arte cheia de cores",
    pontos: [
      "Sem quantidade mínima alta — vale até 1 peça",
      "Degradês e fotos sem perder qualidade",
      "Funciona em algodão, poliéster e malhas escuras",
    ],
  },
  {
    tipo: "caneca" as const,
    nome: "Sublimação",
    quando: "Brindes e tecidos claros de poliéster",
    pontos: [
      "A tinta vira parte do material, não descasca",
      "Ideal para caneca, azulejo e dry fit branco",
      "Não funciona em algodão nem em peça escura",
    ],
  },
];

export default async function ComoFunciona() {
  const ajustes = await getAjustes();

  return (
    <div>
      <div className="malha text-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 md:py-16">
          <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#29ABE2]">
            Passo a passo
          </p>
          <h1 className="mt-3 max-w-2xl text-[clamp(1.9rem,5vw,3rem)] text-white">
            Como funciona um pedido, do começo ao fim
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/70">
            Sem etapa escondida e sem valor que aparece depois. Aqui está exatamente o que acontece
            entre o seu pedido e a peça na sua mão.
          </p>
        </div>
      </div>

      {/* Etapas */}
      <section className="mx-auto max-w-4xl px-5 py-14">
        <ol className="space-y-10">
          {etapas.map((e) => (
            <li key={e.n} className="flex gap-5 sm:gap-7">
              <div className="flex flex-col items-center">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[15px] font-extrabold"
                  style={{ background: e.cor, color: e.cor === "#FFC20E" || e.cor === "#29ABE2" ? "#17181C" : "#fff" }}
                >
                  {e.n}
                </span>
                <span className="mt-2 w-px flex-1 bg-linha" />
              </div>
              <div className="pb-2">
                <h2 className="text-[20px]">{e.titulo}</h2>
                <p className="mt-2 text-[16px] leading-relaxed text-grafite">{e.texto}</p>
                <p className="mt-2 text-[14px] font-medium text-azul">{e.detalhe}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Técnicas */}
      <section className="bg-fundo py-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="rotulo">Qual técnica usar</p>
          <h2 className="mt-3 text-[clamp(1.7rem,4vw,2.3rem)]">Cada trabalho pede um caminho</h2>
          <div className="barra-cmyk mt-5 w-28" />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {tecnicas.map((t) => (
              <div key={t.nome} className="overflow-hidden rounded-2xl bg-white shadow-cartao">
                <Ilustra tipo={t.tipo} className="aspect-[4/3] w-full" />
                <div className="p-6">
                  <h3 className="text-[19px]">{t.nome}</h3>
                  <p className="mt-1.5 text-[14px] font-medium text-azul">{t.quando}</p>
                  <ul className="mt-4 space-y-2.5">
                    {t.pontos.map((p) => (
                      <li key={p} className="flex gap-2.5 text-[15px] leading-relaxed text-grafite">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-magenta" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-grafite">
            Não sabe qual escolher? Manda a arte e a quantidade no orçamento que a gente indica a
            técnica com melhor custo para o seu caso — e explica o porquê.
          </p>
        </div>
      </section>

      {/* Arquivo */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <p className="rotulo">Preparando a arte</p>
        <h2 className="mt-3 text-[clamp(1.7rem,4vw,2.3rem)]">Como mandar o arquivo</h2>
        <div className="barra-cmyk mt-5 w-28" />

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {[
            ["Melhor formato", "Vetor em AI, PDF, EPS ou SVG. Escala para qualquer tamanho sem perder nitidez."],
            ["Também funciona", "PNG com fundo transparente em 300 dpi, no tamanho real da estampa."],
            ["Evite", "Imagem salva de rede social ou printscreen. Fica serrilhada na prensa."],
            ["Não tem arte?", "Descreva a ideia no pedido. A gente orienta e, se precisar, indica quem cria."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-linha p-6">
              <h3 className="text-[17px]">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-grafite">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-linha bg-fundo p-6 sm:p-8">
          <h3 className="text-[19px]">Vai fazer DTF? Calcule antes</h3>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-grafite">
            Nossa calculadora mostra quantas artes cabem em cada metro do rolo, testa a melhor
            posição e já dá o valor. Serve para você decidir o tamanho da estampa sabendo o custo.
          </p>
          <Link href="/calculadora-dtf" className="botao mt-6">
            Abrir a calculadora
          </Link>
        </div>
      </section>

      {/* Chamada */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 pb-20">
        <div className="faixa-cmyk overflow-hidden rounded-3xl p-1">
          <div className="rounded-[1.35rem] bg-[#0E0F13] px-8 py-12 text-center">
            <h2 className="text-[clamp(1.6rem,4vw,2.3rem)] text-white">Pronto para começar?</h2>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/catalogo"
                className="rounded-xl bg-white px-8 py-3.5 text-[15px] font-bold text-tinta"
              >
                Montar meu orçamento
              </Link>
              {ajustes.whatsapp && (
                <a
                  href={`https://wa.me/${ajustes.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vidro rounded-xl px-8 py-3.5 text-[15px] font-semibold text-white"
                >
                  Tirar uma dúvida
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
