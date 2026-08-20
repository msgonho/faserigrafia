"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useCarrinho } from "./CarrinhoProvider";
import { precoUnitario } from "@/lib/pricing";
import { brl } from "@/lib/format";

const LARGURA_ROLO = 58; // cm

type Produto = {
  id: string;
  slug: string;
  name: string;
  minQty: number;
  basePrice: number;
  tiers: { minQty: number; price: number }[];
};

type Encaixe = {
  girada: boolean;
  larguraPeca: number;
  alturaPeca: number;
  porFileira: number;
  fileiras: number;
  comprimentoCm: number;
  metros: number;
};

function calcular(w: number, h: number, qtd: number, folga: number, girada: boolean): Encaixe | null {
  const lp = girada ? h : w;
  const ap = girada ? w : h;
  if (lp <= 0 || ap <= 0 || qtd <= 0) return null;
  if (lp + folga > LARGURA_ROLO) return null;

  const porFileira = Math.max(1, Math.floor((LARGURA_ROLO + folga) / (lp + folga)));
  const fileiras = Math.ceil(qtd / porFileira);
  const comprimentoCm = fileiras * (ap + folga) + folga;
  return {
    girada,
    larguraPeca: lp,
    alturaPeca: ap,
    porFileira,
    fileiras,
    comprimentoCm,
    metros: Math.max(0.5, Math.ceil((comprimentoCm / 100) * 2) / 2),
  };
}

export function CalculadoraDTF({ produto }: { produto: Produto | null }) {
  const [imagem, setImagem] = useState<string | null>(null);
  const [proporcao, setProporcao] = useState<number | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [largura, setLargura] = useState("20");
  const [altura, setAltura] = useState("25");
  const [qtd, setQtd] = useState("30");
  const [travar, setTravar] = useState(true);
  const [folga, setFolga] = useState("0.5");
  const [adicionado, setAdicionado] = useState(false);
  const entrada = useRef<HTMLInputElement>(null);

  const { adicionar } = useCarrinho();

  const n = (v: string) => {
    const x = parseFloat(String(v).replace(",", "."));
    return Number.isFinite(x) && x > 0 ? x : 0;
  };

  const w = n(largura);
  const h = n(altura);
  const quantidade = Math.max(1, Math.round(n(qtd)) || 1);
  const g = Math.max(0, n(folga));

  function carregarImagem(arquivo?: File) {
    if (!arquivo) return;
    setNomeArquivo(arquivo.name);
    const leitor = new FileReader();
    leitor.onload = () => {
      const url = String(leitor.result);
      setImagem(url);
      const img = new Image();
      img.onload = () => {
        const p = img.width / img.height;
        setProporcao(p);
        if (travar && n(largura) > 0) {
          setAltura((n(largura) / p).toFixed(1));
        }
      };
      img.src = url;
    };
    leitor.readAsDataURL(arquivo);
  }

  function mudarLargura(v: string) {
    setLargura(v);
    setAdicionado(false);
    if (travar && proporcao) {
      const x = n(v);
      if (x > 0) setAltura((x / proporcao).toFixed(1));
    }
  }

  function mudarAltura(v: string) {
    setAltura(v);
    setAdicionado(false);
    if (travar && proporcao) {
      const x = n(v);
      if (x > 0) setLargura((x * proporcao).toFixed(1));
    }
  }

  const { melhor, alternativa, cabe } = useMemo(() => {
    const a = calcular(w, h, quantidade, g, false);
    const b = calcular(w, h, quantidade, g, true);
    const opcoes = [a, b].filter(Boolean) as Encaixe[];
    if (opcoes.length === 0) return { melhor: null, alternativa: null, cabe: false };
    opcoes.sort((x, y) => x.comprimentoCm - y.comprimentoCm);
    return { melhor: opcoes[0], alternativa: opcoes[1] ?? null, cabe: true };
  }, [w, h, quantidade, g]);

  const metros = melhor?.metros ?? 0;
  const precoMetro = produto ? precoUnitario(produto, metros || 1) : 0;
  const total = precoMetro * metros;
  const aproveitamento = melhor
    ? Math.min(100, ((quantidade * w * h) / (LARGURA_ROLO * melhor.comprimentoCm)) * 100)
    : 0;
  const sobra = melhor ? melhor.porFileira * melhor.fileiras - quantidade : 0;

  // Desenho do rolo
  const alturaDesenho = melhor ? Math.min(melhor.comprimentoCm, 320) : 100;
  const escala = 8;

  function enviarParaOrcamento() {
    if (!produto || !melhor) return;
    adicionar({
      productId: produto.id,
      slug: produto.slug,
      nome: produto.name,
      unit: "METRO",
      qtd: metros,
      larguraCm: w,
      alturaCm: h,
      artUrl: undefined,
      obs: `${quantidade} artes de ${w} × ${h} cm${melhor.girada ? " (giradas 90°)" : ""} — ${melhor.porFileira} por fileira, ${melhor.fileiras} fileiras${nomeArquivo ? ` · arquivo: ${nomeArquivo}` : ""}`,
      precoUnit: precoMetro,
      subtotal: total,
    });
    setAdicionado(true);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
      {/* Controles */}
      <div className="rounded-2xl border border-linha bg-white p-6">
        <h2 className="text-[20px]">Sua arte</h2>

        <button
          type="button"
          onClick={() => entrada.current?.click()}
          className="mt-4 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-linha bg-fundo px-6 py-8 text-center transition-colors hover:border-azul hover:bg-white"
        >
          {imagem ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagem} alt="Prévia da arte" className="max-h-28 w-auto object-contain" />
              <span className="mt-3 max-w-full truncate text-[13px] font-medium text-grafite">
                {nomeArquivo}
              </span>
              <span className="mt-1 text-[13px] font-semibold text-azul">Trocar imagem</span>
            </>
          ) : (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[22px] text-azul shadow-cartao">
                ↑
              </span>
              <span className="mt-3 text-[15px] font-bold">Escolher a imagem da arte</span>
              <span className="mt-1 text-[13px] text-grafite">
                PNG, JPG ou SVG. A imagem fica só no seu navegador.
              </span>
            </>
          )}
        </button>
        <input
          ref={entrada}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => carregarImagem(e.target.files?.[0])}
        />

        <h2 className="mt-8 text-[20px]">Tamanho da estampa</h2>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="rotulo-campo" htmlFor="larg">
              Largura (cm)
            </label>
            <input
              id="larg"
              inputMode="decimal"
              value={largura}
              onChange={(e) => mudarLargura(e.target.value)}
              className="campo"
            />
          </div>
          <div>
            <label className="rotulo-campo" htmlFor="alt">
              Altura (cm)
            </label>
            <input
              id="alt"
              inputMode="decimal"
              value={altura}
              onChange={(e) => mudarAltura(e.target.value)}
              className="campo"
            />
          </div>
        </div>

        {proporcao && (
          <label className="mt-3 flex items-center gap-2.5 text-[14px] text-grafite">
            <input
              type="checkbox"
              checked={travar}
              onChange={(e) => setTravar(e.target.checked)}
              className="h-4 w-4 accent-azul"
            />
            Manter a proporção da imagem ({proporcao.toFixed(2)} : 1)
          </label>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {[
            ["Bolso", 8, 8],
            ["Peito", 25, 20],
            ["Costas A4", 21, 29.7],
            ["Costas grande", 32, 40],
          ].map(([rot, lw, lh]) => (
            <button
              key={rot as string}
              type="button"
              onClick={() => {
                setTravar(false);
                setLargura(String(lw));
                setAltura(String(lh));
                setAdicionado(false);
              }}
              className="botao-mini rounded-full"
            >
              {rot}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div>
            <label className="rotulo-campo" htmlFor="qtd">
              Quantas artes
            </label>
            <input
              id="qtd"
              inputMode="numeric"
              value={qtd}
              onChange={(e) => {
                setQtd(e.target.value);
                setAdicionado(false);
              }}
              className="campo"
            />
          </div>
          <div>
            <label className="rotulo-campo" htmlFor="folga">
              Folga entre artes (cm)
            </label>
            <input
              id="folga"
              inputMode="decimal"
              value={folga}
              onChange={(e) => setFolga(e.target.value)}
              className="campo"
            />
          </div>
        </div>
      </div>

      {/* Resultado */}
      <div className="rounded-2xl border border-linha bg-white p-6">
        <h2 className="text-[20px]">Como fica no rolo</h2>
        <p className="mt-1.5 text-[14px] text-grafite">
          Rolo de {LARGURA_ROLO} cm de largura — o padrão que usamos aqui.
        </p>

        {!cabe ? (
          <div className="mt-6 rounded-xl border border-linha bg-fundo p-8 text-center">
            <p className="text-[16px] font-bold">Essa arte não cabe no rolo</p>
            <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-grafite">
              O menor lado precisa ficar abaixo de {LARGURA_ROLO} cm. Reduza a medida ou fale com a
              gente sobre dividir a arte em partes.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-5 overflow-hidden rounded-xl border border-linha bg-fundo p-4">
              <svg
                viewBox={`0 0 ${LARGURA_ROLO * escala} ${alturaDesenho * escala}`}
                className="mx-auto h-[300px] w-auto"
                role="img"
                aria-label="Prévia do encaixe das artes no rolo"
              >
                <rect
                  width={LARGURA_ROLO * escala}
                  height={alturaDesenho * escala}
                  fill="#fff"
                  stroke="#DDE2EA"
                  strokeWidth="3"
                />
                {Array.from({ length: Math.min(melhor!.fileiras, 40) }).map((_, fila) =>
                  Array.from({ length: melhor!.porFileira }).map((_, col) => {
                    const indice = fila * melhor!.porFileira + col;
                    if (indice >= quantidade) return null;
                    const x = (g + col * (melhor!.larguraPeca + g)) * escala;
                    const y = (g + fila * (melhor!.alturaPeca + g)) * escala;
                    const lw = melhor!.larguraPeca * escala;
                    const lh = melhor!.alturaPeca * escala;
                    if (y > alturaDesenho * escala) return null;
                    return imagem ? (
                      <image
                        key={indice}
                        href={imagem}
                        x={x}
                        y={y}
                        width={lw}
                        height={lh}
                        preserveAspectRatio="none"
                        transform={melhor!.girada ? `rotate(90 ${x + lw / 2} ${y + lh / 2})` : undefined}
                      />
                    ) : (
                      <rect
                        key={indice}
                        x={x}
                        y={y}
                        width={lw}
                        height={lh}
                        rx="4"
                        fill="#29ABE2"
                        opacity="0.25"
                        stroke="#1B75BC"
                        strokeWidth="2"
                      />
                    );
                  })
                )}
              </svg>
              {melhor!.comprimentoCm > 320 && (
                <p className="mt-3 text-center text-[13px] text-cinza">
                  Mostrando os primeiros 3,2 m do encaixe.
                </p>
              )}
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4">
              {[
                ["Cabem por fileira", `${melhor!.porFileira}`],
                ["Fileiras", `${melhor!.fileiras}`],
                ["Comprimento usado", `${(melhor!.comprimentoCm / 100).toFixed(2)} m`],
                ["Aproveitamento do rolo", `${aproveitamento.toFixed(0)}%`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-fundo p-4">
                  <dt className="text-[13px] text-grafite">{k}</dt>
                  <dd className="mt-1 text-[20px] font-extrabold">{v}</dd>
                </div>
              ))}
            </dl>

            {melhor!.girada && (
              <p className="mt-4 rounded-lg border-l-4 border-amarelo bg-amarelo/10 px-4 py-3 text-[14px]">
                Girando a arte 90° o encaixe fica mais econômico. Já calculamos assim.
              </p>
            )}

            {sobra > 0 && (
              <p className="mt-3 text-[14px] leading-relaxed text-grafite">
                Sobra espaço para mais {sobra} {sobra === 1 ? "arte" : "artes"} sem pagar nada a
                mais. Vale aproveitar.
              </p>
            )}

            {produto && (
              <div className="mt-6 rounded-xl border border-linha bg-fundo p-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-[13px] text-grafite">
                      Você vai precisar de <strong className="text-tinta">{metros} m</strong> a{" "}
                      {brl(precoMetro)} o metro
                    </p>
                    <p className="mt-1 text-[30px] font-extrabold leading-none">{brl(total)}</p>
                    <p className="mt-1 text-[13px] text-grafite">
                      {brl(total / quantidade)} por arte
                    </p>
                  </div>
                  <button type="button" onClick={enviarParaOrcamento} className="botao">
                    Adicionar ao orçamento
                  </button>
                </div>

                {adicionado && (
                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-linha pt-4">
                    <p className="text-[14px]">Adicionado ao seu orçamento.</p>
                    <Link href="/orcamento" className="botao-mini">
                      Revisar e enviar
                    </Link>
                  </div>
                )}

                <p className="mt-4 text-[13px] leading-relaxed text-grafite">
                  Estimativa para você se planejar. Ao enviar o pedido, conferimos o arquivo e
                  devolvemos o valor fechado com o prazo.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
