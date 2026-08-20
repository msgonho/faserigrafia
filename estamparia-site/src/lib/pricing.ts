export type Faixa = { minQty: number; price: number };

export type ProdutoPreco = {
  basePrice: number;
  minQty: number;
  tiers: Faixa[];
};

/** Preço unitário considerando a faixa de quantidade que a quantidade alcança. */
export function precoUnitario(produto: ProdutoPreco, qtd: number): number {
  const faixas = [...(produto.tiers || [])].sort((a, b) => b.minQty - a.minQty);
  const faixa = faixas.find((f) => qtd >= f.minQty);
  return faixa ? faixa.price : produto.basePrice;
}

/** Menor preço possível do produto, usado no "a partir de". */
export function menorPreco(produto: ProdutoPreco): number {
  const precos = [produto.basePrice, ...(produto.tiers || []).map((t) => t.price)].filter(
    (p) => p > 0
  );
  return precos.length ? Math.min(...precos) : 0;
}

/** Metros lineares de uma arte em rolo de 58 cm, arredondando pra cima em 0,5 m. */
export function metrosLineares(larguraCm: number, alturaCm: number, repeticoes: number) {
  const LARGURA_ROLO = 58;
  if (!larguraCm || !alturaCm || !repeticoes) return 0;
  const porFileira = Math.max(1, Math.floor(LARGURA_ROLO / larguraCm));
  const fileiras = Math.ceil(repeticoes / porFileira);
  const metros = (fileiras * alturaCm) / 100;
  return Math.max(0.5, Math.ceil(metros * 2) / 2);
}
