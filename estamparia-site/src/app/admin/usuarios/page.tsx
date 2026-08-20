import { db } from "@/lib/prisma";
import { data } from "@/lib/format";
import { lerSessao } from "@/lib/auth";
import { salvarUsuario, alternarUsuario, excluirUsuario } from "../acoes";

export const dynamic = "force-dynamic";

export default async function Usuarios() {
  const [usuarios, sessao] = await Promise.all([
    db.user.findMany({ orderBy: { createdAt: "asc" } }),
    lerSessao(),
  ]);

  return (
    <>
      <p className="rotulo">Quem entra no painel</p>
      <h1 className="mt-3 text-3xl">Usuários</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <div className="overflow-x-auto border border-linha bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-linha bg-papel">
              <tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-grafite">
                <th className="px-4 py-3">Pessoa</th>
                <th className="px-4 py-3">Acesso</th>
                <th className="px-4 py-3">Desde</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-linha">
              {usuarios.map((u) => {
                const ehVoce = u.id === sessao?.id;
                return (
                  <tr key={u.id}>
                    <td className="px-4 py-3">
                      <span className="font-medium">{u.name}</span>
                      {ehVoce && (
                        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.12em] text-magenta">
                          você
                        </span>
                      )}
                      <span className="block text-[12px] text-grafite">{u.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-grafite">
                        {u.role === "ADMIN" ? "administrador" : "produção"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-grafite">{data(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        {!ehVoce && (
                          <>
                            <form action={alternarUsuario}>
                              <input type="hidden" name="id" value={u.id} />
                              <button
                                className={`px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${
                                  u.active ? "bg-tinta text-papel" : "border border-linha text-grafite"
                                }`}
                              >
                                {u.active ? "ativo" : "bloqueado"}
                              </button>
                            </form>
                            <form action={excluirUsuario}>
                              <input type="hidden" name="id" value={u.id} />
                              <button className="font-mono text-[10px] uppercase tracking-[0.12em] text-grafite hover:text-magenta">
                                excluir
                              </button>
                            </form>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <form action={salvarUsuario} className="border border-tinta bg-white">
          <p className="rotulo border-b border-linha px-5 py-3">Dar acesso a alguém</p>
          <div className="space-y-4 p-5">
            <div>
              <label className="rotulo-campo" htmlFor="u-name">
                Nome
              </label>
              <input id="u-name" name="name" className="campo" required />
            </div>
            <div>
              <label className="rotulo-campo" htmlFor="u-email">
                E-mail
              </label>
              <input id="u-email" name="email" type="email" className="campo" required />
            </div>
            <div>
              <label className="rotulo-campo" htmlFor="u-senha">
                Senha provisória
              </label>
              <input id="u-senha" name="senha" type="text" className="campo font-mono" required />
              <p className="mt-1.5 text-[12px] text-grafite">
                Combine a troca com a pessoa — dá para editar depois.
              </p>
            </div>
            <div>
              <label className="rotulo-campo" htmlFor="u-role">
                Nível de acesso
              </label>
              <select id="u-role" name="role" className="campo" defaultValue="STAFF">
                <option value="STAFF">Produção — vê e responde pedidos</option>
                <option value="ADMIN">Administrador — mexe em tudo</option>
              </select>
            </div>
            <button className="botao w-full">Criar acesso</button>
          </div>
        </form>
      </div>
    </>
  );
}
