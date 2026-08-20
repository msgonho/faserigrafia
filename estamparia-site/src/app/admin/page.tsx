import Link from "next/link";
import { db } from "@/lib/prisma";
import { brl, dataHora } from "@/lib/format";
import { Selo } from "@/components/Selo";

export const dynamic = "force-dynamic";

export default async function Inicio() {
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const [novos, emProducao, doMes, produtosAtivos, recentes, aprovadosMes] = await Promise.all([
    db.quote.count({ where: { status: "NOVO" } }),
    db.quote.count({ where: { status: { in: ["APROVADO", "PRODUCAO"] } } }),
    db.quote.count({ where: { createdAt: { gte: inicioMes } } }),
    db.product.count({ where: { active: true } }),
    db.quote.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { _count: { select: { items: true } } },
    }),
    db.quote.aggregate({
      where: { status: { in: ["APROVADO", "PRODUCAO", "ENTREGUE"] }, createdAt: { gte: inicioMes } },
      _sum: { quotedTotal: true, estimatedTotal: true },
    }),
  ]);

  const fechadoMes = aprovadosMes._sum.quotedTotal || aprovadosMes._sum.estimatedTotal || 0;

  const cartoes = [
    { rotulo: "Esperando resposta", valor: String(novos), destaque: novos > 0, href: "/admin/orcamentos?status=NOVO" },
    { rotulo: "Em produção", valor: String(emProducao), href: "/admin/orcamentos?status=PRODUCAO" },
    { rotulo: "Pedidos no mês", valor: String(doMes), href: "/admin/orcamentos" },
    { rotulo: "Fechado no mês", valor: brl(fechadoMes), href: "/admin/orcamentos" },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="rotulo">Visão geral</p>
          <h1 className="mt-3 text-3xl">Como está a mesa hoje</h1>
        </div>
        <p className="text-[13px] font-medium text-grafite">
          {produtosAtivos} produtos publicados
        </p>
      </div>

      <div className="mt-8 grid gap-px border border-tinta bg-tinta sm:grid-cols-2 lg:grid-cols-4">
        {cartoes.map((c) => (
          <Link key={c.rotulo} href={c.href} className="bg-white p-5 transition-colors hover:bg-fundo">
            <p className="rotulo">{c.rotulo}</p>
            <p
              className={`mt-3 font-display text-4xl leading-none ${
                c.destaque ? "text-magenta" : "text-tinta"
              }`}
            >
              {c.valor}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex items-end justify-between border-b border-tinta pb-3">
        <h2 className="text-xl">Últimos pedidos</h2>
        <Link
          href="/admin/orcamentos"
          className="text-[13px] font-medium text-grafite hover:text-azul"
        >
          ver todos →
        </Link>
      </div>

      {recentes.length === 0 ? (
        <div className="mt-6 border border-dashed border-linha p-12 text-center">
          <h3 className="text-lg">Nenhum pedido ainda</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-grafite">
            Assim que alguém enviar um orçamento pelo site, ele aparece aqui.
          </p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-linha border border-linha bg-white">
          {recentes.map((q) => (
            <li key={q.id}>
              <Link
                href={`/admin/orcamentos/${q.id}`}
                className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-fundo"
              >
                <span className="font-mono text-[12px] tracking-[0.1em] text-grafite">{q.code}</span>
                <span className="font-medium">{q.customerName}</span>
                <span className="text-[13px] text-grafite">
                  {q._count.items} {q._count.items === 1 ? "item" : "itens"}
                </span>
                <span className="ml-auto text-[13px] text-grafite">{dataHora(q.createdAt)}</span>
                <span className="font-semibold">{brl(q.quotedTotal ?? q.estimatedTotal)}</span>
                <Selo status={q.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
