import { db } from "./prisma";

export const PADROES: Record<string, string> = {
  nomeEmpresa: "Estamparia Registro",
  whatsapp: "",
  email: "",
  cidade: "",
  prazoPadrao: "5 a 7 dias úteis após aprovação da arte",
  chamada: "Tira da cabeça. Coloca na camiseta.",
};

export async function getAjustes(): Promise<Record<string, string>> {
  try {
    const linhas = await db.setting.findMany();
    const mapa = { ...PADROES };
    for (const l of linhas) mapa[l.key] = l.value;
    return mapa;
  } catch {
    return { ...PADROES };
  }
}
