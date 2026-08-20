export type ItemEnviado = {
  productId: string;
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
};

export type DadosCliente = {
  nome: string;
  telefone: string;
  email?: string;
  empresa?: string;
  cidade?: string;
  prazo?: string;
  observacoes?: string;
};
