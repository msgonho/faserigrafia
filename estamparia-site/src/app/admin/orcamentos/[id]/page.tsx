import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { brl, dataHora, abrevUnidade, STATUS } from "@/lib/format";
import { Selo } from "@/components/Selo";
import { atualizarOrcamento, excluirOrcamento } from "../../acoes";

export const dynamic = "force-dynamic";

export default async function DetalheOrcamento({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = await db.quote.findUnique({ where: { id }, include: { items: true } });
  if (!o) notFound();

  const zap = o.phone.replace(/\D/g, "");
  const linkZap = `https://wa.me/${zap.length > 11 ? zap : "55" + zap}?text=${encodeURIComponent(
    `Olá ${o.customerName.split(" ")[0]}! Aqui é da estamparia, sobre o orçamento ${o.code}.`
  )}`;

  return (
    <>
      <Link
        href="/admin/orcamentos"
        className="font-mono text-[11px] uppercase tracking-[0.14em] text-grafite hover:text-magenta"
      >
        ← todos os orçamentos
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <h1 className="text-3xl">{o.code}</h1>
        <Selo status={o.status} />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-grafite">
          recebido em {dataHora(o.createdAt)}
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        {/* Ordem de serviço */}
        <div className="ficha">
          <div className="flex items-center justify-between border-b border-linha px-5 py-3">
            <p className="rotulo">Ordem de serviço</p>
            <span className="font-mono text-[11px] tracking-[0.14em] text-grafite">
              {o.items.length} {o.items.length === 1 ? "item" : "itens"}
            </span>
          </div>

          <ul className="divide-y divide-linha">
            {o.items.map((i) => (
              <li key={i.id} className="p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="font-display text-[16px] uppercase leading-tight">{i.productName}</p>
                  <p className="font-semibold">
                    {brl(i.subtotal)}
                    <span className="ml-2 font-mono text-[11px] font-normal text-grafite">
                      {i.qtd} {abrevUnidade(i.unit)} × {brl(i.unitPrice)}
                    </span>
                  </p>
                </div>

                <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-[13px] sm:grid-cols-2">
                  {i.size && (
                    <div className="flex gap-2">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-grafite">Tamanho</dt>
                      <dd>{i.size}</dd>
                    </div>
                  )}
                  {i.color && (
                    <div className="flex gap-2">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-grafite">Cor</dt>
                      <dd>{i.color}</dd>
                    </div>
                  )}
                  {i.sides && (
                    <div className="flex gap-2">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-grafite">Estampa</dt>
                      <dd>{i.sides}</dd>
                    </div>
                  )}
                  {i.widthCm && i.heightCm && (
                    <div className="flex gap-2">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-grafite">Medida</dt>
                      <dd>
                        {i.widthCm} × {i.heightCm} cm
                      </dd>
                    </div>
                  )}
                </dl>

                {i.notes && (
                  <p className="mt-3 border-l-2 border-amarelo bg-amarelo/10 px-3 py-2 text-[13px]">
                    {i.notes}
                  </p>
                )}

                {i.artUrl && (
                  <a
                    href={i.artUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block break-all font-mono text-[11px] text-ciano underline"
                  >
                    abrir arquivo da arte ↗
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-baseline justify-between border-t border-tinta bg-papel px-5 py-4">
            <span className="rotulo">Estimativa do site</span>
            <span className="font-display text-2xl">{brl(o.estimatedTotal)}</span>
          </div>
        </div>

        {/* Cliente + tratativa */}
        <div className="space-y-6">
          <div className="border border-tinta bg-white">
            <p className="rotulo border-b border-linha px-5 py-3">Cliente</p>
            <dl className="divide-y divide-linha px-5">
              {[
                ["Nome", o.customerName],
                ["Telefone", o.phone],
                ["E-mail", o.email],
                ["Empresa", o.company],
                ["Cidade", o.city],
                ["Prazo pedido", o.deadline],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k as string} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-grafite">{k}</dt>
                    <dd className="text-right text-[13px] font-medium">{v}</dd>
                  </div>
                ))}
            </dl>
            {o.notes && (
              <p className="border-t border-linha px-5 py-4 text-[13px] leading-relaxed text-grafite">
                “{o.notes}”
              </p>
            )}
            <div className="flex gap-2 border-t border-linha p-4">
              <a href={linkZap} target="_blank" rel="noopener noreferrer" className="botao-mini border-tinta text-tinta">
                Responder no WhatsApp
              </a>
              {o.email && (
                <a href={`mailto:${o.email}?subject=Orçamento ${o.code}`} className="botao-mini">
                  E-mail
                </a>
              )}
            </div>
          </div>

          <form action={atualizarOrcamento} className="border border-tinta bg-white">
            <p className="rotulo border-b border-linha px-5 py-3">Tratativa</p>
            <input type="hidden" name="id" value={o.id} />
            <div className="space-y-4 p-5">
              <div>
                <label className="rotulo-campo" htmlFor="status">
                  Status
                </label>
                <select id="status" name="status" defaultValue={o.status} className="campo">
                  {Object.entries(STATUS).map(([chave, s]) => (
                    <option key={chave} value={chave}>
                      {s.rotulo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="rotulo-campo" htmlFor="quotedTotal">
                  Valor fechado (R$)
                </label>
                <input
                  id="quotedTotal"
                  name="quotedTotal"
                  inputMode="decimal"
                  defaultValue={o.quotedTotal ?? ""}
                  placeholder={String(o.estimatedTotal)}
                  className="campo"
                />
                <p className="mt-1.5 text-[12px] text-grafite">
                  Deixe em branco para continuar usando a estimativa do site.
                </p>
              </div>

              <div>
                <label className="rotulo-campo" htmlFor="internalNotes">
                  Anotação interna
                </label>
                <textarea
                  id="internalNotes"
                  name="internalNotes"
                  rows={4}
                  defaultValue={o.internalNotes ?? ""}
                  placeholder="Ex.: tela 1 cor já gravada, falta confirmar tom do azul"
                  className="campo resize-y"
                />
              </div>

              <button className="botao w-full">Salvar tratativa</button>
            </div>
          </form>

          <form action={excluirOrcamento} className="text-right">
            <input type="hidden" name="id" value={o.id} />
            <button className="font-mono text-[11px] uppercase tracking-[0.12em] text-grafite hover:text-magenta">
              excluir este orçamento
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
