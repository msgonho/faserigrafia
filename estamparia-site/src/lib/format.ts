export const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

export const data = (d: Date | string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(d)
  );

export const dataHora = (d: Date | string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));

export const unidade = (u: string, qtd = 1) => {
  if (u === "METRO") return qtd === 1 ? "metro" : "metros";
  if (u === "PECA") return qtd === 1 ? "peça" : "peças";
  return qtd === 1 ? "unidade" : "unidades";
};

export const abrevUnidade = (u: string) => (u === "METRO" ? "m" : u === "PECA" ? "pç" : "un");

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const STATUS: Record<string, { rotulo: string; cor: string }> = {
  NOVO: { rotulo: "Novo", cor: "bg-magenta text-white" },
  ORCADO: { rotulo: "Orçado", cor: "bg-ciano text-white" },
  APROVADO: { rotulo: "Aprovado", cor: "bg-amarelo text-tinta" },
  PRODUCAO: { rotulo: "Em produção", cor: "bg-tinta text-white" },
  ENTREGUE: { rotulo: "Entregue", cor: "bg-emerald-600 text-white" },
  CANCELADO: { rotulo: "Cancelado", cor: "bg-grafite text-white" },
};
