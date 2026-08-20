import Link from "next/link";
import { brl, abrevUnidade } from "@/lib/format";
import { menorPreco } from "@/lib/pricing";
import { Ilustra, tipoPorNome } from "./Ilustra";

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
      className="group flex flex-col overflow-hidden rounded-2xl border border-linha bg-white transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-alto"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {produto.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={produto.imageUrl}
            alt={produto.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Ilustra
            tipo={tipoPorNome(`${produto.name} ${produto.slug}`)}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-tinta shadow-sm backdrop-blur">
          mín. {produto.minQty} {abrevUnidade(produto.unit)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[18px]">{produto.name}</h3>
        {produto.description && (
          <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-grafite">
            {produto.description}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <span className="block text-[13px] text-cinza">a partir de</span>
            <span className="text-[22px] font-bold text-tinta">{brl(desde)}</span>
            <span className="text-[13px] text-cinza">/{abrevUnidade(produto.unit)}</span>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-fundo text-azul transition-colors group-hover:bg-azul group-hover:text-white">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
