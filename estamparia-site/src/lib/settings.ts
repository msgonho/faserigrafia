import { db } from "./prisma";

export const PADROES: Record<string, string> = {
  nomeEmpresa: "F&A Serigrafia e Estamparia",
  whatsapp: "5514997001911",
  telefone: "(14) 99700-1911",
  email: "f.a_serigrafia@hotmail.com",
  endereco: "R. Cornélio Pires, 428 - Centro, Botucatu - SP, 18600-370",
  cidade: "Botucatu, SP",
  horario: "Segunda a sexta, 8h às 18h · Sábado, 8h às 12h",
  prazoPadrao: "5 a 7 dias úteis após aprovação da arte",
};

export async function getAjustes(): Promise<Record<string, string>> {
  try {
    const linhas = await db.setting.findMany();
    const mapa = { ...PADROES };
    for (const l of linhas) if (l.value) mapa[l.key] = l.value;
    return mapa;
  } catch {
    return { ...PADROES };
  }
}
