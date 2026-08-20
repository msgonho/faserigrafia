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
      className="group flex flex-col overflow-hidden rounded-xl border border-linha bg-white shadow-cartao transition-shadow hover:shadow-alto"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-fundo">
        {produto.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={produto.imageUrl}
            alt={produto.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-redondo.png" alt="" className="h-20 w-20 opacity-15" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[12px] font-semibold text-tinta shadow-sm">
          mínimo {produto.minQty} {abrevUnidade(produto.unit)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[18px]">{produto.name}</h3>
        {produto.description && (
          <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-grafite">
            {produto.description}
          </p>
        )}
        <div className="mt-5 flex items-baseline gap-1.5 border-t border-linha pt-4">
          <span className="text-[13px] text-cinza">a partir de</span>
          <span className="text-[20px] font-bold text-tinta">{brl(desde)}</span>
          <span className="text-[13px] text-cinza">/{abrevUnidade(produto.unit)}</span>
        </div>
      </div>
    </Link>
  );
}
