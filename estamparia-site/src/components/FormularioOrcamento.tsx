"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useCarrinho } from "./CarrinhoProvider";
import { criarOrcamento } from "@/app/actions";
import { brl, abrevUnidade } from "@/lib/format";

export function FormularioOrcamento() {
  const { itens, remover, limpar, total, pronto } = useCarrinho();
  const [enviando, iniciar] = useTransition();
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    empresa: "",
    cidade: "",
    prazo: "",
    observacoes: "",
  });
  const router = useRouter();

  const alterar = (campo: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  function enviar() {
    setErro("");
    iniciar(async () => {
      const resposta = await criarOrcamento(
        form,
        itens.map((i) => ({
          productId: i.productId,
          nome: i.nome,
          unit: i.unit,
          qtd: i.qtd,
          tamanho: i.tamanho,
          cor: i.cor,
          lados: i.lados,
          larguraCm: i.larguraCm,
          alturaCm: i.alturaCm,
          artUrl: i.artUrl,
          obs: i.obs,
        }))
      );

      if (!resposta.ok) {
        setErro(resposta.erro);
        return;
      }
      limpar();
      router.push(`/orcamento/enviado/${resposta.code}`);
    });
  }

  if (!pronto) {
    return <div className="mt-10 h-40 border border-dashed border-linha" />;
  }

  if (itens.length === 0) {
    return (
      <div className="mt-10 border border-dashed border-linha p-12 text-center">
        <h2 className="text-xl">Seu orçamento está vazio</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-grafite">
          Escolha um produto, ajuste a quantidade e a grade, e ele aparece aqui.
        </p>
        <Link href="/catalogo" className="botao mt-6">
          Ver o catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
      {/* Itens */}
      <div className="ficha">
        <div className="flex items-center justify-between border-b border-linha px-5 py-3">
          <p className="rotulo">
            {itens.length} {itens.length === 1 ? "item" : "itens"}
          </p>
          <button onClick={limpar} className="text-[13px] font-medium text-grafite hover:text-azul">
            limpar tudo
          </button>
        </div>

        <ul className="divide-y divide-linha">
          {itens.map((i) => (
            <li key={i.uid} className="flex gap-4 p-5">
              <div className="flex-1">
                <p className="font-display text-[15px] uppercase leading-tight">{i.nome}</p>
                <p className="mt-1.5 text-[13px] font-medium text-grafite">
                  {i.qtd} {abrevUnidade(i.unit)} × {brl(i.precoUnit)}
                </p>
                <dl className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-grafite">
                  {i.tamanho && <div>Tamanho: {i.tamanho}</div>}
                  {i.cor && <div>Cor: {i.cor}</div>}
                  {i.lados && <div>{i.lados}</div>}
                  {i.larguraCm && i.alturaCm && (
                    <div>
                      Arte: {i.larguraCm} × {i.alturaCm} cm
                    </div>
                  )}
                </dl>
                {i.obs && <p className="mt-2 text-[12px] italic text-grafite">“{i.obs}”</p>}
                {i.artUrl && (
                  <a
                    href={i.artUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block break-all font-mono text-[11px] text-ciano underline"
                  >
                    arquivo da arte
                  </a>
                )}
              </div>

              <div className="text-right">
                <p className="font-semibold">{brl(i.subtotal)}</p>
                <button
                  onClick={() => remover(i.uid)}
                  className="mt-2 text-[13px] font-medium text-grafite hover:text-azul"
                >
                  remover
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-baseline justify-between border-t border-tinta bg-fundo px-5 py-4">
          <span className="rotulo">Estimativa total</span>
          <span className="font-display text-2xl">{brl(total)}</span>
        </div>
      </div>

      {/* Contato */}
      <div className="border border-linha bg-white">
        <div className="border-b border-linha px-5 py-3">
          <p className="rotulo">Para onde mandamos a resposta</p>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="rotulo-campo" htmlFor="nome">
                Seu nome *
              </label>
              <input id="nome" value={form.nome} onChange={alterar("nome")} className="campo" />
            </div>
            <div>
              <label className="rotulo-campo" htmlFor="telefone">
                WhatsApp *
              </label>
              <input
                id="telefone"
                inputMode="tel"
                placeholder="(11) 99999-9999"
                value={form.telefone}
                onChange={alterar("telefone")}
                className="campo"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="rotulo-campo" htmlFor="email">
                E-mail
              </label>
              <input id="email" type="email" value={form.email} onChange={alterar("email")} className="campo" />
            </div>
            <div>
              <label className="rotulo-campo" htmlFor="empresa">
                Empresa ou evento
              </label>
              <input id="empresa" value={form.empresa} onChange={alterar("empresa")} className="campo" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="rotulo-campo" htmlFor="cidade">
                Cidade
              </label>
              <input id="cidade" value={form.cidade} onChange={alterar("cidade")} className="campo" />
            </div>
            <div>
              <label className="rotulo-campo" htmlFor="prazo">
                Precisa para quando
              </label>
              <input
                id="prazo"
                placeholder="Ex.: até dia 30"
                value={form.prazo}
                onChange={alterar("prazo")}
                className="campo"
              />
            </div>
          </div>

          <div>
            <label className="rotulo-campo" htmlFor="observacoes">
              Quer contar mais alguma coisa?
            </label>
            <textarea
              id="observacoes"
              rows={4}
              value={form.observacoes}
              onChange={alterar("observacoes")}
              placeholder="Cores da marca, referência de estampa, se precisa de etiqueta, forma de entrega..."
              className="campo resize-y"
            />
          </div>

          {erro && (
            <p className="border-l-2 border-magenta bg-magenta/5 px-3 py-2 text-[13px] text-tinta">
              {erro}
            </p>
          )}

          <button onClick={enviar} disabled={enviando} className="botao w-full disabled:bg-grafite disabled:border-grafite">
            {enviando ? "Enviando..." : "Enviar pedido de orçamento"}
          </button>

          <p className="text-[12px] leading-relaxed text-grafite">
            Usamos seus dados só para responder este orçamento. Nada de lista de disparo.
          </p>
        </div>
      </div>
    </div>
  );
}
