"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCarrinho } from "./CarrinhoProvider";
import { precoUnitario } from "@/lib/pricing";
import { brl } from "@/lib/format";

const ROLO = 58; // cm de largura útil
const CORES = ["#29ABE2", "#EC008C", "#FFC20E", "#1B75BC", "#F58220", "#17181C"];

type Produto = {
  id: string;
  slug: string;
  name: string;
  minQty: number;
  basePrice: number;
  tiers: { minQty: number; price: number }[];
};

type Arte = {
  id: string;
  nome: string;
  imagem: string | null;
  proporcao: number | null;
  largura: string;
  altura: string;
  qtd: string;
  girar: boolean;
  cor: string;
};

type Peca = { arte: Arte; w: number; h: number };
type Fileira = { y: number; altura: number; pecas: (Peca & { x: number })[] };

const num = (v: string) => {
  const x = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(x) && x > 0 ? x : 0;
};

let contador = 0;
const novaArte = (): Arte => {
  contador += 1;
  return {
    id: `a${contador}${Math.random().toString(36).slice(2, 6)}`,
    nome: "",
    imagem: null,
    proporcao: null,
    largura: "20",
    altura: "25",
    qtd: "10",
    girar: true,
    cor: CORES[(contador - 1) % CORES.length],
  };
};

/** Encaixe por prateleiras: agrupa as peças em fileiras, das mais altas para as mais baixas. */
function encaixar(artes: Arte[], folga: number) {
  const pecas: Peca[] = [];
  let invalida = false;

  for (const a of artes) {
    const w = num(a.largura);
    const h = num(a.altura);
    const q = Math.max(0, Math.round(num(a.qtd)));
    if (!w || !h || !q) continue;

    let pw = w;
    let ph = h;
    if (a.girar && h > w && h <= ROLO) {
      pw = h;
      ph = w;
    }
    if (pw > ROLO) {
      if (ph <= ROLO) {
        const t = pw;
        pw = ph;
        ph = t;
      } else {
        invalida = true;
        continue;
      }
    }
    const limite = Math.min(q, 600);
    for (let i = 0; i < limite; i++) pecas.push({ arte: a, w: pw, h: ph });
  }

  if (pecas.length === 0) {
    return { fileiras: [] as Fileira[], comprimento: 0, total: 0, area: 0, invalida };
  }

  pecas.sort((p, q) => q.h - p.h || q.w - p.w);

  const fileiras: Fileira[] = [];
  let y = folga;
  let atual: Fileira | null = null;
  let cursor = folga;

  for (const p of pecas) {
    if (!atual || cursor + p.w + folga > ROLO) {
      if (atual) y += atual.altura + folga;
      atual = { y, altura: p.h, pecas: [] };
      fileiras.push(atual);
      cursor = folga;
    }
    atual.pecas.push({ ...p, x: cursor });
    cursor += p.w + folga;
    if (p.h > atual.altura) atual.altura = p.h;
  }

  const comprimento = (atual ? atual.y + atual.altura : 0) + folga;
  const area = pecas.reduce((s, p) => s + p.w * p.h, 0);
  return { fileiras, comprimento, total: pecas.length, area, invalida };
}

export function CalculadoraDTF({ produto }: { produto: Produto | null }) {
  const [artes, setArtes] = useState<Arte[]>([novaArte()]);
  const [folga, setFolga] = useState("0.5");
  const [adicionado, setAdicionado] = useState(false);

  const { adicionar } = useCarrinho();
  const g = Math.max(0, num(folga));

  const atualizar = (id: string, campo: Partial<Arte>) => {
    setArtes((lista) => lista.map((a) => (a.id === id ? { ...a, ...campo } : a)));
    setAdicionado(false);
  };

  function carregar(id: string, arquivo?: File) {
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => {
      const url = String(leitor.result);
      const img = new Image();
      img.onload = () => {
        const p = img.width / img.height;
        setArtes((lista) =>
          lista.map((a) =>
            a.id === id
              ? {
                  ...a,
                  imagem: url,
                  proporcao: p,
                  nome: arquivo.name,
                  altura: num(a.largura) ? (num(a.largura) / p).toFixed(1) : a.altura,
                }
              : a
          )
        );
      };
      img.src = url;
    };
    leitor.readAsDataURL(arquivo);
    setAdicionado(false);
  }

  const plano = useMemo(() => encaixar(artes, g), [artes, g]);

  const metros = plano.comprimento ? Math.max(0.5, Math.ceil((plano.comprimento / 100) * 2) / 2) : 0;
  const precoMetro = produto ? precoUnitario(produto, metros || 1) : 0;
  const custo = precoMetro * metros;
  const aproveitamento = plano.comprimento ? (plano.area / (ROLO * plano.comprimento)) * 100 : 0;
  const sobraCm = metros * 100 - plano.comprimento;

  const escala = 7;
  const limiteDesenho = 340;
  const alturaDesenho = Math.min(Math.max(plano.comprimento, 40), limiteDesenho);

  function enviar() {
    if (!produto || !plano.total) return;
    const resumo = artes
      .filter((a) => num(a.largura) && num(a.altura) && num(a.qtd))
      .map(
        (a) =>
          `${Math.round(num(a.qtd))}× ${num(a.largura)}×${num(a.altura)}cm${a.nome ? ` (${a.nome})` : ""}`
      )
      .join(" · ");

    adicionar({
      productId: produto.id,
      slug: produto.slug,
      nome: produto.name,
      unit: "METRO",
      qtd: metros,
      obs: `${plano.total} artes encaixadas em ${metros} m · ${resumo}`,
      precoUnit: precoMetro,
      subtotal: custo,
    });
    setAdicionado(true);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
      {/* Artes */}
      <div className="space-y-4">
        {artes.map((a, i) => (
          <div key={a.id} className="overflow-hidden rounded-2xl border border-linha bg-white">
            <div className="flex items-center gap-3 border-b border-linha px-4 py-3">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: a.cor }} />
              <p className="min-w-0 flex-1 truncate text-[15px] font-bold">
                {a.nome || `Arte ${i + 1}`}
              </p>
              {artes.length > 1 && (
                <button
                  onClick={() => setArtes((l) => l.filter((x) => x.id !== a.id))}
                  className="shrink-0 text-[13px] font-medium text-grafite hover:text-magenta"
                >
                  remover
                </button>
              )}
            </div>

            <div className="flex gap-4 p-4">
              <label className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-linha bg-fundo transition-colors hover:border-azul">
                {a.imagem ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.imagem} alt="" className="h-full w-full object-contain p-1" />
                ) : (
                  <span className="px-2 text-center text-[12px] font-medium leading-tight text-grafite">
                    escolher
                    <br />
                    imagem
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => carregar(a.id, e.target.files?.[0])}
                />
              </label>

              <div className="min-w-0 flex-1">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-cinza">
                      Larg. cm
                    </label>
                    <input
                      inputMode="decimal"
                      value={a.largura}
                      onChange={(e) =>
                        atualizar(a.id, {
                          largura: e.target.value,
                          ...(a.proporcao && num(e.target.value)
                            ? { altura: (num(e.target.value) / a.proporcao).toFixed(1) }
                            : {}),
                        })
                      }
                      className="campo px-2 py-1.5 text-center text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-cinza">
                      Alt. cm
                    </label>
                    <input
                      inputMode="decimal"
                      value={a.altura}
                      onChange={(e) =>
                        atualizar(a.id, {
                          altura: e.target.value,
                          ...(a.proporcao && num(e.target.value)
                            ? { largura: (num(e.target.value) * a.proporcao).toFixed(1) }
                            : {}),
                        })
                      }
                      className="campo px-2 py-1.5 text-center text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-cinza">
                      Qtd.
                    </label>
                    <input
                      inputMode="numeric"
                      value={a.qtd}
                      onChange={(e) => atualizar(a.id, { qtd: e.target.value })}
                      className="campo px-2 py-1.5 text-center text-[14px]"
                    />
                  </div>
                </div>

                <label className="mt-3 flex items-center gap-2 text-[13px] text-grafite">
                  <input
                    type="checkbox"
                    checked={a.girar}
                    onChange={(e) => atualizar(a.id, { girar: e.target.checked })}
                    className="h-4 w-4 accent-azul"
                  />
                  Pode girar 90° para encaixar melhor
                </label>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setArtes((l) => [...l, novaArte()])}
            className="botao-vazado px-5 py-2.5 text-[14px]"
          >
            + Adicionar outra arte
          </button>
          <label className="flex items-center gap-2 text-[13px] text-grafite">
            Folga
            <input
              inputMode="decimal"
              value={folga}
              onChange={(e) => setFolga(e.target.value)}
              className="campo w-16 px-2 py-1.5 text-center text-[14px]"
            />
            cm
          </label>
        </div>
      </div>

      {/* Resultado */}
      <div className="overflow-hidden rounded-2xl border border-linha bg-white lg:sticky lg:top-24">
        <div className="faixa-cmyk h-1.5 w-full" />

        <div className="grid grid-cols-2 gap-px bg-linha sm:grid-cols-4">
          {[
            ["Metros", metros ? `${metros} m` : "—"],
            ["Artes", plano.total ? String(plano.total) : "—"],
            ["Fileiras", plano.fileiras.length ? String(plano.fileiras.length) : "—"],
            ["Aproveita.", plano.comprimento ? `${aproveitamento.toFixed(0)}%` : "—"],
          ].map(([k, v]) => (
            <div key={k} className="bg-white px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-cinza">{k}</p>
              <p className="mt-1 text-[22px] font-extrabold leading-none">{v}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-linha p-5">
          {plano.invalida && (
            <p className="mb-4 rounded-lg border-l-4 border-magenta bg-magenta/5 px-4 py-3 text-[14px] leading-relaxed">
              Uma das artes passa de {ROLO} cm nos dois lados e não cabe no rolo. Reduza a medida ou
              fale com a gente sobre dividir em partes.
            </p>
          )}

          {plano.total === 0 ? (
            <div className="rounded-xl bg-fundo px-6 py-14 text-center">
              <p className="text-[16px] font-bold">Preencha as medidas para ver o encaixe</p>
              <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-grafite">
                Largura, altura e quantidade de cada arte. Você pode somar quantas artes diferentes
                quiser na mesma tiragem.
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 rounded-xl bg-fundo p-4">
                <div className="relative w-10 shrink-0">
                  {Array.from({ length: Math.floor(alturaDesenho / 50) + 1 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute right-1 -translate-y-1/2 text-[10px] font-semibold text-cinza"
                      style={{ top: `${((i * 50) / alturaDesenho) * 100}%` }}
                    >
                      {(i * 0.5).toFixed(1)}m
                    </span>
                  ))}
                </div>

                <div className="min-w-0 flex-1 overflow-hidden rounded-lg border-2 border-tinta/10 bg-white">
                  <svg
                    viewBox={`0 0 ${ROLO * escala} ${alturaDesenho * escala}`}
                    className="w-full"
                    role="img"
                    aria-label="Prévia do encaixe das artes no rolo"
                  >
                    {plano.fileiras.map((f, fi) =>
                      f.pecas.map((p, idx) => {
                        if (f.y > alturaDesenho) return null;
                        const x = p.x * escala;
                        const y = f.y * escala;
                        const w = p.w * escala;
                        const h = p.h * escala;
                        return p.arte.imagem ? (
                          <image
                            key={`${fi}-${idx}`}
                            href={p.arte.imagem}
                            x={x}
                            y={y}
                            width={w}
                            height={h}
                            preserveAspectRatio="none"
                          />
                        ) : (
                          <rect
                            key={`${fi}-${idx}`}
                            x={x}
                            y={y}
                            width={w}
                            height={h}
                            rx="3"
                            fill={p.arte.cor}
                            fillOpacity="0.22"
                            stroke={p.arte.cor}
                            strokeWidth="1.5"
                          />
                        );
                      })
                    )}
                  </svg>
                </div>
              </div>

              {plano.comprimento > limiteDesenho && (
                <p className="mt-2 text-center text-[12px] text-cinza">
                  Mostrando os primeiros {(limiteDesenho / 100).toFixed(1)} m de{" "}
                  {(plano.comprimento / 100).toFixed(2)} m.
                </p>
              )}

              {sobraCm > 5 && (
                <p className="mt-4 rounded-lg border-l-4 border-amarelo bg-amarelo/10 px-4 py-3 text-[14px] leading-relaxed">
                  Sobram {sobraCm.toFixed(0)} cm de rolo já pagos. Dá para incluir mais artes sem
                  aumentar o valor.
                </p>
              )}

              {produto && (
                <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-linha pt-5">
                  <div>
                    <p className="text-[13px] text-grafite">
                      {metros} m × {brl(precoMetro)} o metro
                    </p>
                    <p className="mt-1 text-[32px] font-extrabold leading-none">{brl(custo)}</p>
                    <p className="mt-1 text-[13px] text-grafite">
                      {brl(custo / plano.total)} por arte
                    </p>
                  </div>
                  <button onClick={enviar} className="botao">
                    Adicionar ao orçamento
                  </button>
                </div>
              )}

              {adicionado && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <p className="text-[14px]">Adicionado ao seu orçamento.</p>
                  <Link href="/orcamento" className="botao-mini">
                    Revisar e enviar
                  </Link>
                </div>
              )}

              <p className="mt-4 text-[13px] leading-relaxed text-grafite">
                Estimativa para você se planejar. Ao enviar o pedido, conferimos os arquivos e
                devolvemos o valor fechado com o prazo.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
