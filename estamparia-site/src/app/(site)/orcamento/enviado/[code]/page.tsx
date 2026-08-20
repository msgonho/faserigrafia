import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { getAjustes } from "@/lib/settings";
import { brl, abrevUnidade } from "@/lib/format";
import { Registro } from "@/components/Registro";

export const dynamic = "force-dynamic";

export default async function Enviado({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const orcamento = await db.quote.findUnique({ where: { code }, include: { items: true } });
  if (!orcamento) notFound();

  const ajustes = await getAjustes();

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="rotulo">Pedido registrado</p>
      <h1 className="mt-5 text-[clamp(2rem,6vw,3.4rem)]">
        <Registro>Recebemos.</Registro>
      </h1>
      <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-grafite">
        Seu pedido entrou na fila com o número <strong className="font-mono text-tinta">{orcamento.code}</strong>.
        Guarde esse número — é por ele que a gente localiza tudo. Respondemos no WhatsApp{" "}
        <strong className="text-tinta">{orcamento.phone}</strong>
        {ajustes.prazoPadrao ? " em até 1 dia útil." : "."}
      </p>

      <div className="ficha mt-10">
        <div className="flex items-center justify-between border-b border-linha px-5 py-3">
          <p className="rotulo">Resumo do que você pediu</p>
          <span className="font-mono text-[11px] tracking-[0.14em]">{orcamento.code}</span>
        </div>
        <ul className="divide-y divide-linha">
          {orcamento.items.map((i) => (
            <li key={i.id} className="flex items-baseline justify-between gap-4 px-5 py-4">
              <div>
                <p className="font-display text-[15px] uppercase leading-tight">{i.productName}</p>
                <p className="mt-1 text-[13px] font-medium text-grafite">
                  {i.qtd} {abrevUnidade(i.unit)}
                  {i.size ? ` · ${i.size}` : ""}
                  {i.color ? ` · ${i.color}` : ""}
                </p>
              </div>
              <span className="font-semibold">{brl(i.subtotal)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between border-t border-tinta bg-fundo px-5 py-4">
          <span className="rotulo">Estimativa</span>
          <span className="font-display text-2xl">{brl(orcamento.estimatedTotal)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {ajustes.whatsapp && (
          <a
            href={`https://wa.me/${ajustes.whatsapp}?text=${encodeURIComponent(
              `Olá! Enviei o orçamento ${orcamento.code} pelo site.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="botao"
          >
            Adiantar pelo WhatsApp
          </a>
        )}
        <Link href="/catalogo" className="botao-vazado">
          Voltar ao catálogo
        </Link>
      </div>
    </div>
  );
}
