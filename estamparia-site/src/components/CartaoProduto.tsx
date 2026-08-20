import Link from "next/link";
import { brl, abrevUnidade } from "@/lib/format";
import { menorPreco } from "@/lib/pricing";

type Props = {
  produto: {
    slug: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    unit: string;
    minQty: number;
    basePrice: number;
    tiers: { minQty: number; price: number }[];
    category?: { name: string } | null;
  };
};

export function CartaoProduto({ produto }: Props) {
  const desde = menorPreco(produto);

  return (
    <Link
      href={`/produto/${produto.slug}`}
      className="group flex flex-col border border-linha bg-white transition-colors hover:border-tinta"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-linha bg-papel">
        {produto.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={produto.imageUrl}
            alt={produto.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="reticula absolute inset-0 text-grafite/50" />
        )}
        <span className="absolute left-0 top-0 bg-tinta px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-papel">
          mín. {produto.minQty} {abrevUnidade(produto.unit)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[17px] leading-tight">{produto.name}</h3>
        {produto.description && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-grafite">
            {produto.description}
          </p>
        )}
        <p className="mt-4 flex items-baseline gap-1.5 border-t border-linha pt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-grafite">
          a partir de
          <span className="font-sans text-base font-semibold tracking-normal text-tinta">
            {brl(desde)}
          </span>
          /{abrevUnidade(produto.unit)}
        </p>
      </div>
    </Link>
  );
}
