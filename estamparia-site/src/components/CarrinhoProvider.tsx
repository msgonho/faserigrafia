"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ItemCarrinho = {
  uid: string;
  productId: string;
  slug: string;
  nome: string;
  unit: "UNIDADE" | "METRO" | "PECA";
  qtd: number;
  tamanho?: string;
  cor?: string;
  lados?: string;
  larguraCm?: number;
  alturaCm?: number;
  artUrl?: string;
  obs?: string;
  precoUnit: number;
  subtotal: number;
};

type Ctx = {
  itens: ItemCarrinho[];
  pronto: boolean;
  adicionar: (item: Omit<ItemCarrinho, "uid">) => void;
  remover: (uid: string) => void;
  limpar: () => void;
  total: number;
  quantidade: number;
};

const CarrinhoCtx = createContext<Ctx | null>(null);
const CHAVE = "orcamento-itens";

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try {
      const salvo = window.localStorage.getItem(CHAVE);
      if (salvo) setItens(JSON.parse(salvo));
    } catch {
      /* começa vazio */
    }
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    try {
      window.localStorage.setItem(CHAVE, JSON.stringify(itens));
    } catch {
      /* sem espaço, segue sem salvar */
    }
  }, [itens, pronto]);

  const adicionar = (item: Omit<ItemCarrinho, "uid">) =>
    setItens((atual) => [...atual, { ...item, uid: Math.random().toString(36).slice(2, 10) }]);

  const remover = (uid: string) => setItens((atual) => atual.filter((i) => i.uid !== uid));
  const limpar = () => setItens([]);

  const total = itens.reduce((s, i) => s + i.subtotal, 0);

  return (
    <CarrinhoCtx.Provider
      value={{ itens, pronto, adicionar, remover, limpar, total, quantidade: itens.length }}
    >
      {children}
    </CarrinhoCtx.Provider>
  );
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoCtx);
  if (!ctx) throw new Error("useCarrinho precisa estar dentro do CarrinhoProvider");
  return ctx;
}
