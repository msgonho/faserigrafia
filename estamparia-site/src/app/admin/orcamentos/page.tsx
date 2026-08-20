import Link from "next/link";
import { db } from "@/lib/prisma";
import { brl, dataHora, STATUS } from "@/lib/format";
import { Selo } from "@/components/Selo";

export const dynamic = "force-dynamic";

export default async function ListaOrcamentos({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;

  const orcamentos = await db.quote.findMany({
    where: {
      ...(status && STATUS[status] ? { status: status as never } : {}),
      ...(q
        ? {
            OR: [
              { customerName: { contains: q, mode: "insensitive" as const } },
              { code: { contains: q, mode: "insensitive" as const } },
              { company: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <>
      <p className="rotulo">Pedidos recebidos</p>
      <h1 className="mt-3 text-3xl">Orçamentos</h1>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link
          href="/admin/orcamentos"
          className={`px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] ${
            !status ? "bg-tinta text-papel" : "border border-linha text-grafite hover:border-tinta"
          }`}
        >
          Todos
        </Link>
        {Object.entries(STATUS).map(([chave, s]) => (
          <Link
            key={chave}
            href={`/admin/orcamentos?status=${chave}`}
            className={`px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] ${
              status === chave
                ? "bg-tinta text-papel"
                : "border border-linha text-grafite hover:border-tinta"
            }`}
          >
            {s.rotulo}
          </Link>
        ))}

        <form className="ml-auto flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por nome ou código"
            className="campo w-56"
          />
          <button className="botao-mini">Buscar</button>
        </form>
      </div>

      {orcamentos.length === 0 ? (
        <div className="mt-8 border border-dashed border-linha p-12 text-center">
          <h2 className="text-lg">Nada nesse filtro</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-grafite">
            Troque o filtro acima ou limpe a busca para ver todos os pedidos.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-linha bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-linha bg-papel">
              <tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-grafite">
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Itens</th>
                <th className="px-4 py-3">Recebido</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linha">
              {orcamentos.map((o) => (
                <tr key={o.id} className="transition-colors hover:bg-papel">
                  <td className="px-4 py-3 font-mono text-[12px]">
                    <Link href={`/admin/orcamentos/${o.id}`} className="hover:text-magenta">
                      {o.code}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orcamentos/${o.id}`} className="font-medium hover:text-magenta">
                      {o.customerName}
                    </Link>
                    {o.company && <span className="block text-[12px] text-grafite">{o.company}</span>}
                  </td>
                  <td className="px-4 py-3 text-grafite">{o._count.items}</td>
                  <td className="px-4 py-3 text-grafite">{dataHora(o.createdAt)}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {brl(o.quotedTotal ?? o.estimatedTotal)}
                    {o.quotedTotal == null && (
                      <span className="block font-mono text-[10px] font-normal uppercase tracking-[0.1em] text-grafite">
                        estimado
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Selo status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
