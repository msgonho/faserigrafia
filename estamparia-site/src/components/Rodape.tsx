import Link from "next/link";
import { Logo } from "./Registro";

export function Rodape({ ajustes }: { ajustes: Record<string, string> }) {
  return (
    <footer className="mt-20 bg-tinta text-white">
      <div className="barra-cmyk rounded-none" style={{ height: 4 }} />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <div className="inline-block rounded-xl bg-white p-3">
            <Logo className="h-12 w-auto" />
          </div>
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/70">
            Serigrafia, DTF e sublimação. Peça pequena ou tiragem grande, a cor sai igual em todas.
          </p>
        </div>

        <div>
          <p className="text-[15px] font-semibold">Fale com a gente</p>
          <ul className="mt-3 space-y-2 text-[15px] text-white/70">
            {ajustes.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${ajustes.whatsapp}`}
                  className="hover:text-ciano"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            )}
            {ajustes.email && (
              <li>
                <a href={`mailto:${ajustes.email}`} className="hover:text-ciano">
                  {ajustes.email}
                </a>
              </li>
            )}
            {ajustes.cidade && <li>{ajustes.cidade}</li>}
          </ul>
        </div>

        <div>
          <p className="text-[15px] font-semibold">Atalhos</p>
          <ul className="mt-3 space-y-2 text-[15px] text-white/70">
            <li>
              <Link href="/catalogo" className="hover:text-ciano">
                Catálogo completo
              </Link>
            </li>
            <li>
              <Link href="/orcamento" className="hover:text-ciano">
                Meu orçamento
              </Link>
            </li>
            <li>
              <Link href="/entrar" className="hover:text-ciano">
                Painel da equipe
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-[14px] text-white/50">
          {ajustes.prazoPadrao
            ? `Prazo de produção: ${ajustes.prazoPadrao}`
            : "Prazo combinado a cada pedido"}
        </p>
      </div>
    </footer>
  );
}
