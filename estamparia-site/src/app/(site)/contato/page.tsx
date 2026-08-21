import Link from "next/link";
import { getAjustes } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Contato — F&A Serigrafia, Botucatu SP",
  description: "Endereço, telefone e e-mail da F&A Serigrafia e Estamparia em Botucatu, São Paulo.",
};

export default async function Contato() {
  const a = await getAjustes();
  const mapa = `https://www.google.com/maps?q=${encodeURIComponent(a.endereco || "Botucatu SP")}&output=embed`;

  return (
    <div>
      <div className="malha text-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 md:py-16">
          <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#29ABE2]">
            Onde estamos
          </p>
          <h1 className="mt-3 text-[clamp(1.9rem,5vw,3rem)] text-white">Fale com a gente</h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/70">
            Atendemos Botucatu e região na loja, e enviamos para todo o Brasil.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div>
          <div className="space-y-6">
            {a.telefone && (
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-cinza">
                  Telefone e WhatsApp
                </p>
                <a
                  href={`https://wa.me/${a.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-[26px] font-extrabold text-tinta hover:text-azul"
                >
                  {a.telefone}
                </a>
              </div>
            )}

            {a.email && (
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-cinza">
                  E-mail
                </p>
                <a
                  href={`mailto:${a.email}`}
                  className="mt-1 block break-all text-[18px] font-bold text-tinta hover:text-azul"
                >
                  {a.email}
                </a>
              </div>
            )}

            {a.endereco && (
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-cinza">
                  Endereço
                </p>
                <p className="mt-1 text-[18px] font-medium leading-relaxed text-tinta">
                  {a.endereco}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.endereco)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-[15px] font-bold text-azul"
                >
                  Ver rota no Google Maps →
                </a>
              </div>
            )}

            {a.horario && (
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-cinza">
                  Atendimento
                </p>
                <p className="mt-1 text-[17px] font-medium text-tinta">{a.horario}</p>
              </div>
            )}
          </div>

          <div className="mt-10 rounded-2xl border border-linha bg-fundo p-6">
            <h2 className="text-[19px]">Quer um orçamento?</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-grafite">
              Pelo site sai mais rápido: você monta o pedido com quantidade e tamanhos, e a gente já
              responde com o valor fechado.
            </p>
            <Link href="/catalogo" className="botao mt-5">
              Montar meu orçamento
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-linha">
          <iframe
            src={mapa}
            title="Mapa da localização"
            className="h-[460px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
