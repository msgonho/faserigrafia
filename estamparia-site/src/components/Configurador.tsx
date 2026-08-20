"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCarrinho } from "./CarrinhoProvider";
import { precoUnitario, metrosLineares } from "@/lib/pricing";
import { brl, abrevUnidade, unidade } from "@/lib/format";

type Opcao = { label: string; extraPrice: number };

export type ProdutoConfig = {
  id: string;
  slug: string;
  name: string;
  unit: "UNIDADE" | "METRO" | "PECA";
  basePrice: number;
  minQty: number;
  askPrintSides: boolean;
  askDimensions: boolean;
  tiers: { minQty: number; price: number }[];
  tamanhos: Opcao[];
  cores: Opcao[];
};

const LADOS = ["Só frente", "Frente e costas", "Frente, costas e manga"];

export function Configurador({ produto }: { produto: ProdutoConfig }) {
  const emMetro = produto.unit === "METRO";
  const passo = emMetro ? 0.5 : 1;

  const [qtdTexto, setQtdTexto] = useState(String(produto.minQty));
  const [tamanho, setTamanho] = useState(produto.tamanhos[0]?.label ?? "");
  const [cor, setCor] = useState(produto.cores[0]?.label ?? "");
  const [lados, setLados] = useState(LADOS[0]);
  const [largura, setLargura] = useState("");
  const [altura, setAltura] = useState("");
  const [repeticoes, setRepeticoes] = useState("");
  const [artUrl, setArtUrl] = useState("");
  const [obs, setObs] = useState("");
  const [adicionado, setAdicionado] = useState(false);

  const { adicionar } = useCarrinho();

  const qtd = useMemo(() => {
    const n = parseFloat(qtdTexto.replace(",", "."));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [qtdTexto]);

  const extraTamanho = produto.tamanhos.find((t) => t.label === tamanho)?.extraPrice ?? 0;
  const extraCor = produto.cores.find((c) => c.label === cor)?.extraPrice ?? 0;
  const precoUnit = precoUnitario(produto, qtd || produto.minQty) + extraTamanho + extraCor;
  const subtotal = precoUnit * qtd;

  const metrosCalculados = metrosLineares(
    parseFloat(largura.replace(",", ".")) || 0,
    parseFloat(altura.replace(",", ".")) || 0,
    parseInt(repeticoes) || 0
  );

  const abaixoDoMinimo = qtd > 0 && qtd < produto.minQty;
  const podeAdicionar = qtd >= produto.minQty;

  function ajustar(delta: number) {
    const novo = Math.max(produto.minQty, (qtd || produto.minQty) + delta);
    setQtdTexto(emMetro ? novo.toFixed(1) : String(Math.round(novo)));
  }

  function enviar() {
    if (!podeAdicionar) return;
    adicionar({
      productId: produto.id,
      slug: produto.slug,
      nome: produto.name,
      unit: produto.unit,
      qtd,
      tamanho: tamanho || undefined,
      cor: cor || undefined,
      lados: produto.askPrintSides ? lados : undefined,
      larguraCm: parseFloat(largura.replace(",", ".")) || undefined,
      alturaCm: parseFloat(altura.replace(",", ".")) || undefined,
      artUrl: artUrl.trim() || undefined,
      obs: obs.trim() || undefined,
      precoUnit,
      subtotal,
    });
    setAdicionado(true);
  }

  return (
    <div className="mt-8 border border-linha bg-white">
      <div className="border-b border-linha px-5 py-3">
        <p className="rotulo">Monte seu pedido</p>
      </div>

      <div className="space-y-5 p-5">
        {/* Quantidade */}
        <div>
          <label className="rotulo-campo" htmlFor="qtd">
            Quantidade em {unidade(produto.unit, 2)} — mínimo {produto.minQty}
          </label>
          <div className="flex items-stretch">
            <button
              type="button"
              onClick={() => ajustar(-passo)}
              className="border border-r-0 border-linha px-4 text-lg text-grafite hover:bg-fundo"
              aria-label="Diminuir quantidade"
            >
              −
            </button>
            <input
              id="qtd"
              inputMode="decimal"
              value={qtdTexto}
              onChange={(e) => {
                setQtdTexto(e.target.value);
                setAdicionado(false);
              }}
              className="campo w-24 text-center font-mono text-base"
            />
            <button
              type="button"
              onClick={() => ajustar(passo)}
              className="border border-l-0 border-linha px-4 text-lg text-grafite hover:bg-fundo"
              aria-label="Aumentar quantidade"
            >
              +
            </button>
            <span className="ml-3 self-center text-[13px] font-medium text-grafite">
              {abrevUnidade(produto.unit)}
            </span>
          </div>
          {abaixoDoMinimo && (
            <p className="mt-2 text-[13px] font-medium text-magenta">
              O mínimo é {produto.minQty} {abrevUnidade(produto.unit)}. Ajuste para continuar.
            </p>
          )}
        </div>

        {/* Grade e cor */}
        <div className="grid gap-4 sm:grid-cols-2">
          {produto.tamanhos.length > 0 && (
            <div>
              <label className="rotulo-campo" htmlFor="tamanho">
                Tamanho
              </label>
              <select
                id="tamanho"
                value={tamanho}
                onChange={(e) => setTamanho(e.target.value)}
                className="campo"
              >
                {produto.tamanhos.map((t) => (
                  <option key={t.label} value={t.label}>
                    {t.label}
                    {t.extraPrice > 0 ? ` (+${brl(t.extraPrice)})` : ""}
                  </option>
                ))}
                <option value="Grade sortida">Grade sortida (informo abaixo)</option>
              </select>
            </div>
          )}

          {produto.cores.length > 0 && (
            <div>
              <label className="rotulo-campo" htmlFor="cor">
                Cor da peça
              </label>
              <select id="cor" value={cor} onChange={(e) => setCor(e.target.value)} className="campo">
                {produto.cores.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.label}
                    {c.extraPrice > 0 ? ` (+${brl(c.extraPrice)})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {produto.askPrintSides && (
          <div>
            <label className="rotulo-campo">Onde vai a estampa</label>
            <div className="flex flex-wrap gap-2">
              {LADOS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLados(l)}
                  aria-pressed={lados === l}
                  className={`border px-3 py-2 text-[13px] transition-colors ${
                    lados === l
                      ? "border-tinta bg-tinta text-white"
                      : "border-linha text-grafite hover:border-tinta"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[12px] text-grafite">
              O custo do segundo lado entra no orçamento final, junto com o número de cores.
            </p>
          </div>
        )}

        {/* Medidas da arte */}
        {produto.askDimensions && (
          <div className="border border-dashed border-linha p-4">
            <p className="rotulo-campo">Medida da arte</p>
            <div className="grid grid-cols-3 gap-3">
              <input
                inputMode="decimal"
                placeholder="Largura cm"
                value={largura}
                onChange={(e) => setLargura(e.target.value)}
                className="campo"
              />
              <input
                inputMode="decimal"
                placeholder="Altura cm"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                className="campo"
              />
              <input
                inputMode="numeric"
                placeholder="Qtd. de artes"
                value={repeticoes}
                onChange={(e) => setRepeticoes(e.target.value)}
                className="campo"
              />
            </div>
            {emMetro && metrosCalculados > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <p className="font-mono text-[12px] text-grafite">
                  Cabe em <strong className="text-tinta">{metrosCalculados.toFixed(1)} m</strong> de
                  rolo (58 cm de largura).
                </p>
                <button
                  type="button"
                  onClick={() => setQtdTexto(metrosCalculados.toFixed(1))}
                  className="botao-mini"
                >
                  Usar essa metragem
                </button>
              </div>
            )}
          </div>
        )}

        {/* Arte */}
        <div>
          <label className="rotulo-campo" htmlFor="arte">
            Link da arte (Drive, Dropbox, WeTransfer)
          </label>
          <input
            id="arte"
            value={artUrl}
            onChange={(e) => setArtUrl(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="campo"
          />
          <p className="mt-1.5 text-[12px] text-grafite">
            Sem arte pronta? Deixe em branco e descreva a ideia na observação.
          </p>
        </div>

        <div>
          <label className="rotulo-campo" htmlFor="obs">
            Observação deste item
          </label>
          <textarea
            id="obs"
            rows={3}
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder={
              tamanho === "Grade sortida"
                ? "Ex.: 10 P, 15 M, 5 G"
                : "Ex.: estampa de 25 cm no peito, 2 cores"
            }
            className="campo resize-y"
          />
        </div>
      </div>

      {/* Rodapé de preço */}
      <div className="border-t border-tinta bg-fundo px-5 py-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="rotulo">Estimativa deste item</p>
            <p className="mt-1 font-display text-3xl">{brl(subtotal)}</p>
            <p className="mt-1 text-[13px] font-medium text-grafite">
              {brl(precoUnit)} por {abrevUnidade(produto.unit)}
            </p>
          </div>
          <button type="button" onClick={enviar} disabled={!podeAdicionar} className="botao disabled:cursor-not-allowed disabled:border-linha disabled:bg-linha disabled:text-grafite">
            Adicionar ao orçamento
          </button>
        </div>

        {adicionado && (
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-linha pt-4">
            <p className="text-[13px]">Item adicionado ao seu orçamento.</p>
            <Link href="/orcamento" className="botao-mini border-tinta text-tinta">
              Revisar e enviar
            </Link>
            <Link href="/catalogo" className="botao-mini">
              Adicionar outro produto
            </Link>
          </div>
        )}

        <p className="mt-4 text-[12px] leading-relaxed text-grafite">
          Valor de referência para você se planejar. O preço fechado sai depois que a gente olha a
          arte — e chega junto com o prazo.
        </p>
      </div>
    </div>
  );
}
