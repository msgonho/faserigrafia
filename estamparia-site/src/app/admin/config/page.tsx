import { getAjustes } from "@/lib/settings";
import { salvarAjustes } from "../acoes";

export const dynamic = "force-dynamic";

const campos = [
  { nome: "nomeEmpresa", rotulo: "Nome da estamparia", dica: "Aparece no rodapé e no título das páginas." },
  { nome: "chamada", rotulo: "Frase da página inicial", dica: "Duas frases curtas separadas por ponto — a primeira sai estampada em destaque." },
  { nome: "whatsapp", rotulo: "WhatsApp (só números)", dica: "Com código do país e DDD: 5514997001911." },
  { nome: "telefone", rotulo: "Telefone para exibir", dica: "Do jeito que você quer que apareça: (14) 99700-1911." },
  { nome: "email", rotulo: "E-mail de contato", dica: "" },
  { nome: "endereco", rotulo: "Endereço completo", dica: "Aparece no rodapé e monta o mapa da página de contato." },
  { nome: "cidade", rotulo: "Cidade", dica: "" },
  { nome: "horario", rotulo: "Horário de atendimento", dica: "" },
  { nome: "prazoPadrao", rotulo: "Prazo padrão", dica: "O que o cliente vê como expectativa antes de fechar." },
];

export default async function Config() {
  const ajustes = await getAjustes();

  return (
    <>
      <p className="rotulo">Dados do site</p>
      <h1 className="mt-3 text-3xl">Ajustes</h1>
      <p className="mt-3 max-w-lg text-[15px] text-grafite">
        O que você mudar aqui aparece no site na hora, sem precisar mexer em código.
      </p>

      <form action={salvarAjustes} className="mt-8 max-w-2xl border border-linha bg-white">
        <div className="space-y-5 p-6">
          {campos.map((c) => (
            <div key={c.nome}>
              <label className="rotulo-campo" htmlFor={c.nome}>
                {c.rotulo}
              </label>
              <input id={c.nome} name={c.nome} defaultValue={ajustes[c.nome] ?? ""} className="campo" />
              {c.dica && <p className="mt-1.5 text-[12px] text-grafite">{c.dica}</p>}
            </div>
          ))}
          <button className="botao">Salvar ajustes</button>
        </div>
      </form>
    </>
  );
}
