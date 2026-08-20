import Link from "next/link";
import { db } from "@/lib/prisma";
import { brl, abrevUnidade } from "@/lib/format";
import { alternarProduto } from "../acoes";

export const dynamic = "force-dynamic";

export default async function ListaProdutos() {
  const produtos = await db.product.findMany({
    orderBy: [{ category: { position: "asc" } }, { position: "asc" }, { name: "asc" }],
    include: { category: true, _count: { select: { tiers: true, options: true } } },
  });

  const categorias = await db.category.count();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="rotulo">Catálogo</p>
          <h1 className="mt-3 text-3xl">Produtos</h1>
        </div>
        {categorias > 0 ? (
          <Link href="/admin/produtos/novo" className="botao">
            Cadastrar produto
          </Link>
        ) : (
          <Link href="/admin/categorias" className="botao">
            Criar a primeira categoria
          </Link>
        )}
      </div>

      {produtos.length === 0 ? (
        <div className="mt-8 border border-dashed border-linha p-12 text-center">
          <h2 className="text-lg">Catálogo vazio</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-grafite">
            {categorias === 0
              ? "Crie uma categoria primeiro — camisetas, DTF, brindes — e depois cadastre os produtos."
              : "Cadastre o primeiro produto para ele aparecer no site."}
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-linha bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-linha bg-fundo">
              <tr className="text-[12px] font-semibold text-grafite">
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3 text-right">Preço base</th>
                <th className="px-4 py-3 text-right">Mínimo</th>
                <th className="px-4 py-3 text-center">Faixas</th>
                <th className="px-4 py-3">No site</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-linha">
              {produtos.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-fundo">
                  <td className="px-4 py-3">
                    <Link href={`/admin/produtos/${p.id}`} className="font-medium hover:text-azul">
                      {p.name}
                    </Link>
                    <span className="block font-mono text-[11px] text-grafite">/{p.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-grafite">{p.category.name}</td>
                  <td className="px-4 py-3 text-right">
                    {brl(p.basePrice)}
                    <span className="font-mono text-[11px] text-grafite">/{abrevUnidade(p.unit)}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-grafite">
                    {p.minQty} {abrevUnidade(p.unit)}
                  </td>
                  <td className="px-4 py-3 text-center text-grafite">{p._count.tiers}</td>
                  <td className="px-4 py-3">
                    <form action={alternarProduto}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        className={`px-2 py-1 text-[12px] font-semibold ${
                          p.active ? "bg-tinta text-white" : "border border-linha text-grafite"
                        }`}
                      >
                        {p.active ? "publicado" : "oculto"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="text-[13px] font-medium text-grafite hover:text-azul"
                    >
                      editar
                    </Link>
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
