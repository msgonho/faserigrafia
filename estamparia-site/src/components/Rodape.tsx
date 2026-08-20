import Link from "next/link";
import { Logo } from "./Registro";

export function Rodape({ ajustes }: { ajustes: Record<string, string> }) {
  return (
    <footer className="mt-20 bg-tinta text-white">
      <div className="barra-cmyk rounded-none" style={{ height: 4 }} />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="inline-block rounded-xl bg-white p-3">
            <Logo className="h-12 w-auto" />
          </div>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/70">
            Serigrafia, DTF e sublimação em Botucatu. Peça pequena ou tiragem grande, a cor sai
            igual em todas.
          </p>
          {ajustes.endereco && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ajustes.endereco)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block max-w-xs text-[15px] leading-relaxed text-white/70 hover:text-ciano"
            >
              {ajustes.endereco}
            </a>
          )}
        </div>

        <div>
          <p className="text-[15px] font-bold">Contato</p>
          <ul className="mt-3 space-y-2 text-[15px] text-white/70">
            {ajustes.telefone && (
              <li>
                <a
                  href={`https://wa.me/${ajustes.whatsapp}`}
                  className="hover:text-ciano"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ajustes.telefone}
                </a>
              </li>
            )}
            {ajustes.email && (
              <li>
                <a href={`mailto:${ajustes.email}`} className="break-all hover:text-ciano">
                  {ajustes.email}
                </a>
              </li>
            )}
            {ajustes.horario && <li className="text-white/50">{ajustes.horario}</li>}
          </ul>
        </div>

        <div>
          <p className="text-[15px] font-bold">Navegar</p>
          <ul className="mt-3 space-y-2 text-[15px] text-white/70">
            <li>
              <Link href="/catalogo" className="hover:text-ciano">
                Catálogo
              </Link>
            </li>
            <li>
              <Link href="/calculadora-dtf" className="hover:text-ciano">
                Calculadora de DTF
              </Link>
            </li>
            <li>
              <Link href="/como-funciona" className="hover:text-ciano">
                Como funciona
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-ciano">
                Contato
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
        <p className="mx-auto max-w-6xl px-5 py-5 text-[14px] text-white/40">
          {ajustes.nomeEmpresa || "F&A Serigrafia"} · Botucatu, São Paulo
        </p>
      </div>
    </footer>
  );
}
