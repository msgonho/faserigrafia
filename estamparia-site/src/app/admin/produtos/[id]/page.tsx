import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { FormProduto } from "@/components/FormProduto";

export const dynamic = "force-dynamic";

export default async function EditarProduto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const novo = id === "novo";

  const categorias = await db.category.findMany({ orderBy: { position: "asc" } });
  if (categorias.length === 0) redirect("/admin/categorias");

  const produto = novo
    ? null
    : await db.product.findUnique({
        where: { id },
        include: { tiers: { orderBy: { minQty: "asc" } }, options: { orderBy: { position: "asc" } } },
      });

  if (!novo && !produto) notFound();

  return (
    <>
      <Link
        href="/admin/produtos"
        className="font-mono text-[11px] uppercase tracking-[0.14em] text-grafite hover:text-magenta"
      >
        ← produtos
      </Link>
      <h1 className="mt-4 text-3xl">{novo ? "Novo produto" : produto!.name}</h1>

      <FormProduto
        categorias={categorias.map((c) => ({ id: c.id, name: c.name }))}
        produto={
          produto
            ? {
                id: produto.id,
                name: produto.name,
                slug: produto.slug,
                description: produto.description ?? "",
                imageUrl: produto.imageUrl ?? "",
                categoryId: produto.categoryId,
                unit: produto.unit,
                basePrice: produto.basePrice,
                minQty: produto.minQty,
                active: produto.active,
                askPrintSides: produto.askPrintSides,
                askDimensions: produto.askDimensions,
                position: produto.position,
                tiers: produto.tiers.map((t) => ({ minQty: t.minQty, price: t.price })),
                tamanhos: produto.options
                  .filter((o) => o.type === "TAMANHO")
                  .map((o) => (o.extraPrice ? `${o.label}+${o.extraPrice}` : o.label))
                  .join(", "),
                cores: produto.options
                  .filter((o) => o.type === "COR")
                  .map((o) => (o.extraPrice ? `${o.label}+${o.extraPrice}` : o.label))
                  .join(", "),
              }
            : null
        }
      />
    </>
  );
}
