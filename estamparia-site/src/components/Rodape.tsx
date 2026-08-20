import Link from "next/link";

export function Rodape({ ajustes }: { ajustes: Record<string, string> }) {
  return (
    <footer className="mt-24 border-t border-tinta bg-tinta text-papel">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl uppercase leading-none">
            {ajustes.nomeEmpresa || "Estamparia"}
          </p>
          <p className="mt-3 max-w-xs text-sm text-papel/70">
            Silk, DTF e sublimação. Peça pequena ou tiragem grande, sai com a mesma cor.
          </p>
        </div>

        <div>
          <p className="rotulo text-papel/50">Falar com a gente</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {ajustes.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${ajustes.whatsapp}`}
                  className="hover:text-amarelo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            )}
            {ajustes.email && (
              <li>
                <a href={`mailto:${ajustes.email}`} className="hover:text-amarelo">
                  {ajustes.email}
                </a>
              </li>
            )}
            {ajustes.cidade && <li className="text-papel/70">{ajustes.cidade}</li>}
          </ul>
        </div>

        <div>
          <p className="rotulo text-papel/50">Atalhos</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <Link href="/catalogo" className="hover:text-amarelo">
                Catálogo completo
              </Link>
            </li>
            <li>
              <Link href="/orcamento" className="hover:text-amarelo">
                Meu orçamento
              </Link>
            </li>
            <li>
              <Link href="/entrar" className="text-papel/50 hover:text-amarelo">
                Painel da equipe
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-papel/15">
        <p className="mx-auto max-w-6xl px-5 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-papel/40">
          {ajustes.prazoPadrao ? `Prazo padrão: ${ajustes.prazoPadrao}` : "Prazo combinado por pedido"}
        </p>
      </div>
    </footer>
  );
}
