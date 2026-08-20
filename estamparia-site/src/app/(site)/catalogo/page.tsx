import Link from "next/link";
import { db } from "@/lib/prisma";
import { CartaoProduto } from "@/components/CartaoProduto";

export const dynamic = "force-dynamic";

export default async function Catalogo({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { cat, q } = await searchParams;

  const categorias = await db.category.findMany({ orderBy: { position: "asc" } });

  const produtos = await db.product.findMany({
    where: {
      active: true,
      ...(cat ? { category: { slug: cat } } : {}),
      ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
    },
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: { tiers: true, category: { select: { name: true } } },
  });

  const atual = categorias.find((c) => c.slug === cat);

  return (
    <div>
      <div className="malha text-white">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#29ABE2]">Catálogo</p>
          <h1 className="mt-3 text-[clamp(1.9rem,5vw,3rem)] text-white">
            {atual ? atual.name : "Tudo que a gente estampa"}
          </h1>
          {atual?.description && (
            <p className="mt-3 max-w-xl text-[16px] text-white/65">{atual.description}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10">

      <nav className="flex flex-wrap gap-2 border-b border-linha pb-6">
        <Link
          href="/catalogo"
          className={`px-4 py-2 text-[14px] font-semibold transition-colors ${
            !cat ? "bg-tinta text-white" : "border border-linha text-grafite hover:border-tinta"
          } rounded-full`}
        >
          Todos
        </Link>
        {categorias.map((c) => (
          <Link
            key={c.id}
            href={`/catalogo?cat=${c.slug}`}
            className={`px-4 py-2 text-[14px] font-semibold transition-colors ${
              cat === c.slug
                ? "bg-tinta text-white"
                : "border border-linha text-grafite hover:border-tinta"
            } rounded-full`}
          >
            {c.name}
          </Link>
        ))}
      </nav>

      {produtos.length === 0 ? (
        <div className="mt-16 border border-dashed border-linha p-12 text-center">
          <h2 className="text-xl">Nada por aqui ainda</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-grafite">
            Essa categoria está sem produtos publicados. Escolha outra na lista acima ou peça direto
            no WhatsApp.
          </p>
          <Link href="/catalogo" className="botao-vazado mt-6">
            Ver todos os produtos
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {produtos.map((p) => (
            <CartaoProduto key={p.id} produto={p} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}