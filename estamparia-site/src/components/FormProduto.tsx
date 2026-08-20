"use client";

import { useState } from "react";
import { salvarProduto, excluirProduto } from "@/app/admin/acoes";

type Faixa = { minQty: number | string; price: number | string };

type ProdutoForm = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  unit: string;
  basePrice: number;
  minQty: number;
  active: boolean;
  askPrintSides: boolean;
  askDimensions: boolean;
  position: number;
  tiers: Faixa[];
  tamanhos: string;
  cores: string;
};

export function FormProduto({
  produto,
  categorias,
}: {
  produto: ProdutoForm | null;
  categorias: { id: string; name: string }[];
}) {
  const [faixas, setFaixas] = useState<Faixa[]>(
    produto?.tiers?.length ? produto.tiers : [{ minQty: "", price: "" }]
  );

  const alterarFaixa = (i: number, campo: keyof Faixa, valor: string) =>
    setFaixas((f) => f.map((linha, idx) => (idx === i ? { ...linha, [campo]: valor } : linha)));

  return (
    <>
      <form action={salvarProduto} className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <input type="hidden" name="id" value={produto?.id ?? ""} />

        {/* Identificação */}
        <div className="space-y-6">
          <fieldset className="border border-tinta bg-white">
            <legend className="rotulo px-5">O que é</legend>
            <div className="space-y-4 p-5 pt-2">
              <div>
                <label className="rotulo-campo" htmlFor="name">
                  Nome do produto
                </label>
                <input id="name" name="name" defaultValue={produto?.name} required className="campo" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="rotulo-campo" htmlFor="slug">
                    Endereço no site
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    defaultValue={produto?.slug}
                    placeholder="camiseta-algodao"
                    className="campo font-mono text-[13px]"
                  />
                  <p className="mt-1.5 text-[12px] text-grafite">
                    Deixe em branco para gerar a partir do nome.
                  </p>
                </div>
                <div>
                  <label className="rotulo-campo" htmlFor="categoryId">
                    Categoria
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    defaultValue={produto?.categoryId}
                    className="campo"
                  >
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="rotulo-campo" htmlFor="description">
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={produto?.description}
                  placeholder="Malha, gramatura, tipo de estampa..."
                  className="campo resize-y"
                />
              </div>

              <div>
                <label className="rotulo-campo" htmlFor="imageUrl">
                  Link da foto
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={produto?.imageUrl}
                  placeholder="https://..."
                  className="campo font-mono text-[13px]"
                />
              </div>
            </div>
          </fieldset>

          {/* Faixas de preço */}
          <fieldset className="border border-tinta bg-white">
            <legend className="rotulo px-5">Preço por quantidade</legend>
            <div className="space-y-3 p-5 pt-2">
              <p className="text-[13px] leading-relaxed text-grafite">
                A partir de quantas peças vale cada preço. Quem pedir menos que a menor faixa paga o
                preço base.
              </p>

              {faixas.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-grafite">
                    a partir de
                  </span>
                  <input
                    name="tierQty"
                    inputMode="numeric"
                    value={f.minQty}
                    onChange={(e) => alterarFaixa(i, "minQty", e.target.value)}
                    className="campo w-20 text-center font-mono"
                  />
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-grafite">
                    sai a R$
                  </span>
                  <input
                    name="tierPrice"
                    inputMode="decimal"
                    value={f.price}
                    onChange={(e) => alterarFaixa(i, "price", e.target.value)}
                    className="campo w-28 text-center font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setFaixas((atual) => atual.filter((_, idx) => idx !== i))}
                    className="ml-auto font-mono text-[11px] uppercase tracking-[0.1em] text-grafite hover:text-magenta"
                  >
                    remover
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setFaixas((f) => [...f, { minQty: "", price: "" }])}
                className="botao-mini"
              >
                + adicionar faixa
              </button>
            </div>
          </fieldset>

          {/* Opções */}
          <fieldset className="border border-tinta bg-white">
            <legend className="rotulo px-5">Opções que o cliente escolhe</legend>
            <div className="space-y-4 p-5 pt-2">
              <div>
                <label className="rotulo-campo" htmlFor="tamanhos">
                  Tamanhos
                </label>
                <input
                  id="tamanhos"
                  name="tamanhos"
                  defaultValue={produto?.tamanhos}
                  placeholder="P, M, G, GG, XG+3"
                  className="campo"
                />
              </div>
              <div>
                <label className="rotulo-campo" htmlFor="cores">
                  Cores
                </label>
                <input
                  id="cores"
                  name="cores"
                  defaultValue={produto?.cores}
                  placeholder="Branca, Preta+2, Cinza mescla+1"
                  className="campo"
                />
              </div>
              <p className="text-[12px] leading-relaxed text-grafite">
                Separe por vírgula. Para cobrar a mais por uma opção, escreva o acréscimo junto:{" "}
                <span className="font-mono text-tinta">XG+3</span> soma R$ 3,00 por peça. Deixe em
                branco para não perguntar.
              </p>
            </div>
          </fieldset>
        </div>

        {/* Regras e publicação */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <fieldset className="border border-tinta bg-white">
            <legend className="rotulo px-5">Como é vendido</legend>
            <div className="space-y-4 p-5 pt-2">
              <div>
                <label className="rotulo-campo" htmlFor="unit">
                  Unidade de venda
                </label>
                <select id="unit" name="unit" defaultValue={produto?.unit ?? "UNIDADE"} className="campo">
                  <option value="UNIDADE">Por unidade</option>
                  <option value="METRO">Por metro</option>
                  <option value="PECA">Por peça avulsa</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="rotulo-campo" htmlFor="basePrice">
                    Preço base (R$)
                  </label>
                  <input
                    id="basePrice"
                    name="basePrice"
                    inputMode="decimal"
                    defaultValue={produto?.basePrice ?? ""}
                    className="campo font-mono"
                  />
                </div>
                <div>
                  <label className="rotulo-campo" htmlFor="minQty">
                    Quantidade mínima
                  </label>
                  <input
                    id="minQty"
                    name="minQty"
                    inputMode="numeric"
                    defaultValue={produto?.minQty ?? 1}
                    className="campo font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="rotulo-campo" htmlFor="position">
                  Ordem na listagem
                </label>
                <input
                  id="position"
                  name="position"
                  inputMode="numeric"
                  defaultValue={produto?.position ?? 0}
                  className="campo font-mono"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-tinta bg-white">
            <legend className="rotulo px-5">O que perguntar no pedido</legend>
            <div className="space-y-3 p-5 pt-2">
              {[
                ["askPrintSides", "Onde vai a estampa (frente, costas, manga)", produto?.askPrintSides],
                ["askDimensions", "Medida da arte em centímetros", produto?.askDimensions],
                ["active", "Publicar no site", produto ? produto.active : true],
              ].map(([nome, texto, marcado]) => (
                <label key={nome as string} className="flex items-start gap-3 text-[13px]">
                  <input
                    type="checkbox"
                    name={nome as string}
                    defaultChecked={Boolean(marcado)}
                    className="mt-0.5 h-4 w-4 accent-magenta"
                  />
                  <span>{texto}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button className="botao w-full">
            {produto ? "Salvar alterações" : "Cadastrar produto"}
          </button>
        </div>
      </form>

      {produto && (
        <form action={excluirProduto} className="mt-6 text-right">
          <input type="hidden" name="id" value={produto.id} />
          <button className="font-mono text-[11px] uppercase tracking-[0.12em] text-grafite hover:text-magenta">
            excluir produto
          </button>
        </form>
      )}
    </>
  );
}
