import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { brl, abrevUnidade, unidade } from "@/lib/format";
import { Configurador } from "@/components/Configurador";

export const dynamic = "force-dynamic";

export default async function PaginaProduto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const produto = await db.product.findUnique({
    where: { slug },
    include: {
      tiers: { orderBy: { minQty: "asc" } },
      options: { orderBy: { position: "asc" } },
      category: true,
    },
  });

  if (!produto || !produto.active) notFound();

  const tamanhos = produto.options.filter((o) => o.type === "TAMANHO");
  const cores = produto.options.filter((o) => o.type === "COR");

  const dados = {
    id: produto.id,
    slug: produto.slug,
    name: produto.name,
    unit: produto.unit as "UNIDADE" | "METRO" | "PECA",
    basePrice: produto.basePrice,
    minQty: produto.minQty,
    askPrintSides: produto.askPrintSides,
    askDimensions: produto.askDimensions,
    tiers: produto.tiers.map((t) => ({ minQty: t.minQty, price: t.price })),
    tamanhos: tamanhos.map((t) => ({ label: t.label, extraPrice: t.extraPrice })),
    cores: cores.map((c) => ({ label: c.label, extraPrice: c.extraPrice })),
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <nav className="text-[13px] font-medium text-grafite">
        <Link href="/catalogo" className="hover:text-azul">
          Catálogo
        </Link>
        <span className="px-2">/</span>
        <Link href={`/catalogo?cat=${produto.category.slug}`} className="hover:text-azul">
          {produto.category.name}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <div className="relative aspect-square overflow-hidden border border-linha bg-white">
            {produto.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={produto.imageUrl} alt={produto.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-redondo.png" alt="" className="h-28 w-28 opacity-15" />
              </div>
            )}
          </div>

          {produto.tiers.length > 0 && (
            <div className="ficha mt-6 p-5">
              <p className="rotulo border-b border-linha pb-3">
                Tabela de preço por {unidade(produto.unit, 2)}
              </p>
              <table className="mt-1 w-full text-left">
                <tbody className="divide-y divide-linha">
                  {produto.tiers.map((t, i) => {
                    const prox = produto.tiers[i + 1];
                    return (
                      <tr key={t.id}>
                        <td className="py-2.5 font-mono text-[12px] tracking-wide text-grafite">
                          {prox ? `${t.minQty} a ${prox.minQty - 1}` : `${t.minQty} ou mais`}{" "}
                          {abrevUnidade(produto.unit)}
                        </td>
                        <td className="py-2.5 text-right text-sm font-semibold">
                          {brl(t.price)}
                          <span className="font-mono text-[11px] font-normal text-grafite">
                            /{abrevUnidade(produto.unit)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-4 text-[12px] leading-relaxed text-grafite">
                Valores de referência para arte de até 4 cores. O orçamento final considera número de
                cores, tamanho da estampa e prazo.
              </p>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-[clamp(1.8rem,4.5vw,2.8rem)]">{produto.name}</h1>
          {produto.description && (
            <p className="mt-4 text-[15px] leading-relaxed text-grafite">{produto.description}</p>
          )}
          <Configurador produto={dados} />
        </div>
      </div>
    </div>
  );
}
