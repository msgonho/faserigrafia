import { db } from "@/lib/prisma";
import { salvarCategoria, excluirCategoria } from "../acoes";

export const dynamic = "force-dynamic";

export default async function Categorias() {
  const categorias = await db.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <p className="rotulo">Organização do catálogo</p>
      <h1 className="mt-3 text-3xl">Categorias</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <div className="border border-linha bg-white">
          {categorias.length === 0 ? (
            <p className="p-8 text-center text-sm text-grafite">
              Nenhuma categoria ainda. Crie a primeira ao lado.
            </p>
          ) : (
            <ul className="divide-y divide-linha">
              {categorias.map((c) => (
                <li key={c.id} className="p-5">
                  <form action={salvarCategoria} className="space-y-3">
                    <input type="hidden" name="id" value={c.id} />
                    <div className="flex flex-wrap items-center gap-3">
                      <input name="name" defaultValue={c.name} className="campo flex-1" />
                      <input
                        name="position"
                        defaultValue={c.position}
                        inputMode="numeric"
                        className="campo w-16 text-center font-mono"
                        aria-label="Ordem"
                      />
                      <span className="text-[13px] font-medium text-grafite">
                        {c._count.products} prod.
                      </span>
                    </div>
                    <input
                      name="description"
                      defaultValue={c.description ?? ""}
                      placeholder="Descrição curta que aparece no site"
                      className="campo"
                    />
                    <input type="hidden" name="slug" value={c.slug} />
                    <div className="flex gap-3">
                      <button className="botao-mini border-tinta text-tinta">Salvar</button>
                    </div>
                  </form>

                  <form action={excluirCategoria} className="mt-2">
                    <input type="hidden" name="id" value={c.id} />
                    <button className="text-[13px] font-medium text-grafite hover:text-azul">
                      excluir categoria
                      {c._count.products > 0 ? ` e ${c._count.products} produto(s)` : ""}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form action={salvarCategoria} className="border border-linha bg-white">
          <p className="rotulo border-b border-linha px-5 py-3">Nova categoria</p>
          <div className="space-y-4 p-5">
            <div>
              <label className="rotulo-campo" htmlFor="nova-name">
                Nome
              </label>
              <input id="nova-name" name="name" placeholder="Brindes personalizados" className="campo" required />
            </div>
            <div>
              <label className="rotulo-campo" htmlFor="nova-desc">
                Descrição
              </label>
              <input id="nova-desc" name="description" placeholder="Caneca, ecobag, squeeze" className="campo" />
            </div>
            <div>
              <label className="rotulo-campo" htmlFor="nova-pos">
                Ordem
              </label>
              <input id="nova-pos" name="position" defaultValue={categorias.length + 1} inputMode="numeric" className="campo w-24 font-mono" />
            </div>
            <button className="botao w-full">Criar categoria</button>
          </div>
        </form>
      </div>
    </>
  );
}
