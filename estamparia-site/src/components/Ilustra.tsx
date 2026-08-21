import { FOTOS } from "@/lib/fotos";

/** Foto real quando existe; senão, desenho vetorial. */

const C = { ciano: "#29ABE2", magenta: "#EC008C", amarelo: "#FFC20E", azul: "#1B75BC", tinta: "#17181C" };

export type TipoIlustra =
  | "camiseta"
  | "moletom"
  | "polo"
  | "bone"
  | "caneca"
  | "ecobag"
  | "squeeze"
  | "dtf-rolo"
  | "dtf-folha"
  | "camiseta-vestida"
  | "camiseta-preta"
  | "camiseta-cabide"
  | "camiseta-parede"
  | "dryfit"
  | "pilha"
  | "generico";

/** Descobre a ilustração certa a partir do nome/slug do produto. */
export function tipoPorNome(texto: string): TipoIlustra {
  const t = (texto || "").toLowerCase();
  if (t.includes("moletom") || t.includes("blusa")) return "moletom";
  if (t.includes("polo")) return "polo";
  if (t.includes("bone") || t.includes("boné") || t.includes("trucker")) return "bone";
  if (t.includes("caneca")) return "caneca";
  if (t.includes("ecobag") || t.includes("sacola") || t.includes("bolsa")) return "ecobag";
  if (t.includes("squeeze") || t.includes("garrafa") || t.includes("copo")) return "squeeze";
  if (t.includes("metro") || t.includes("rolo")) return "dtf-rolo";
  if (t.includes("dtf") || t.includes("folha") || t.includes("a3")) return "dtf-folha";
  if (t.includes("camisa") || t.includes("camiseta")) return "camiseta";
  return "generico";
}

function Camiseta({ cor = C.tinta, estampa = C.magenta }) {
  return (
    <>
      <path
        d="M70 42 L100 30 Q120 46 140 30 L170 42 L186 74 L162 86 L162 176 Q120 184 78 176 L78 86 L54 74 Z"
        fill={cor}
      />
      <path d="M100 30 Q120 46 140 30 L134 26 Q120 38 106 26 Z" fill="#fff" opacity=".35" />
      <circle cx="120" cy="108" r="22" fill={estampa} />
      <rect x="104" y="136" width="32" height="6" rx="3" fill={estampa} opacity=".6" />
    </>
  );
}

function Moletom({ cor = "#3A3F4B", estampa = C.ciano }) {
  return (
    <>
      <path
        d="M66 46 L98 32 L142 32 L174 46 L192 82 L166 94 L166 180 Q120 188 74 180 L74 94 L48 82 Z"
        fill={cor}
      />
      <path d="M98 32 Q120 58 142 32 L146 44 Q120 70 94 44 Z" fill="#fff" opacity=".18" />
      <rect x="96" y="140" width="48" height="26" rx="8" fill="#000" opacity=".18" />
      <circle cx="120" cy="106" r="20" fill={estampa} />
    </>
  );
}

function Polo({ cor = "#F2F4F7", estampa = C.azul }) {
  return (
    <>
      <path
        d="M70 42 L100 30 L140 30 L170 42 L186 74 L162 86 L162 176 Q120 184 78 176 L78 86 L54 74 Z"
        fill={cor}
        stroke="#DDE2EA"
        strokeWidth="2"
      />
      <path d="M100 30 L120 58 L140 30 L132 26 L120 44 L108 26 Z" fill="#DDE2EA" />
      <rect x="117" y="44" width="6" height="34" rx="3" fill="#DDE2EA" />
      <circle cx="150" cy="80" r="11" fill={estampa} />
    </>
  );
}

function Bone({ cor = C.tinta, estampa = C.amarelo }) {
  return (
    <>
      <path d="M60 128 Q60 56 120 56 Q180 56 180 128 Z" fill={cor} />
      <path d="M60 128 Q120 118 180 128 L196 144 Q120 158 44 144 Z" fill={cor} opacity=".82" />
      <circle cx="120" cy="60" r="7" fill={estampa} />
      <path d="M120 56 Q152 60 166 96" stroke="#fff" strokeWidth="2" opacity=".25" fill="none" />
      <circle cx="120" cy="98" r="16" fill={estampa} />
    </>
  );
}

function Caneca({ cor = "#FFFFFF", estampa = C.magenta }) {
  return (
    <>
      <rect x="62" y="66" width="92" height="108" rx="12" fill={cor} stroke="#DDE2EA" strokeWidth="2" />
      <path
        d="M154 92 h16 a24 24 0 0 1 0 48 h-16"
        fill="none"
        stroke="#DDE2EA"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="108" cy="120" r="22" fill={estampa} />
      <rect x="62" y="66" width="20" height="108" fill="#000" opacity=".04" />
    </>
  );
}

function Ecobag({ cor = "#EFE7D8", estampa = C.tinta }) {
  return (
    <>
      <path d="M64 82 h112 l10 96 H54 Z" fill={cor} stroke="#DDD3BF" strokeWidth="2" />
      <path d="M92 82 V64 a28 28 0 0 1 56 0 v18" fill="none" stroke="#DDD3BF" strokeWidth="8" />
      <rect x="96" y="118" width="48" height="8" rx="4" fill={estampa} />
      <rect x="88" y="134" width="64" height="8" rx="4" fill={C.magenta} />
      <rect x="102" y="150" width="36" height="8" rx="4" fill={C.ciano} />
    </>
  );
}

function Squeeze({ cor = "#B9C2CE", estampa = C.azul }) {
  return (
    <>
      <rect x="94" y="46" width="52" height="22" rx="6" fill={C.tinta} />
      <path d="M96 68 h48 a16 16 0 0 1 16 16 v78 a16 16 0 0 1 -16 16 h-48 a16 16 0 0 1 -16 -16 v-78 a16 16 0 0 1 16 -16 z" fill={cor} />
      <rect x="80" y="104" width="80" height="34" fill={estampa} />
      <rect x="80" y="68" width="18" height="110" fill="#fff" opacity=".25" />
    </>
  );
}

function DtfRolo() {
  return (
    <>
      <rect x="40" y="56" width="30" height="128" rx="15" fill="#C6CEDA" />
      <rect x="66" y="72" width="140" height="96" rx="6" fill="#fff" stroke="#DDE2EA" strokeWidth="2" />
      <circle cx="104" cy="106" r="17" fill={C.magenta} />
      <circle cx="146" cy="106" r="17" fill={C.ciano} />
      <circle cx="125" cy="140" r="17" fill={C.amarelo} />
      <circle cx="180" cy="132" r="12" fill={C.tinta} />
      <rect x="40" y="56" width="12" height="128" rx="6" fill="#AEB8C7" />
    </>
  );
}

function DtfFolha() {
  return (
    <>
      <rect x="66" y="52" width="112" height="144" rx="8" fill="#fff" stroke="#DDE2EA" strokeWidth="2" />
      <rect x="84" y="72" width="76" height="30" rx="6" fill={C.magenta} />
      <circle cx="102" cy="132" r="16" fill={C.ciano} />
      <circle cx="142" cy="132" r="16" fill={C.amarelo} />
      <rect x="84" y="162" width="76" height="12" rx="6" fill={C.tinta} />
    </>
  );
}

function Generico() {
  return (
    <>
      <rect x="62" y="62" width="116" height="116" rx="16" fill="#fff" stroke="#DDE2EA" strokeWidth="2" />
      <circle cx="102" cy="106" r="18" fill={C.magenta} />
      <circle cx="138" cy="106" r="18" fill={C.ciano} />
      <circle cx="120" cy="140" r="18" fill={C.amarelo} />
    </>
  );
}

const mapa: Record<string, () => any> = {
  camiseta: Camiseta,
  moletom: Moletom,
  polo: Polo,
  bone: Bone,
  caneca: Caneca,
  ecobag: Ecobag,
  squeeze: Squeeze,
  "dtf-rolo": DtfRolo,
  "dtf-folha": DtfFolha,
  generico: Generico,
};

export function Ilustra({
  tipo = "generico",
  className = "",
  fundo = true,
}: {
  tipo?: TipoIlustra;
  className?: string;
  fundo?: boolean;
}) {
  const foto = FOTOS[tipo];
  if (foto) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={foto} alt="" className={`object-cover ${className}`} loading="lazy" />
    );
  }

  const Desenho = mapa[tipo] ?? Generico;

  return (
    <svg viewBox="0 0 240 220" className={className} role="img" aria-hidden="true">
      {fundo && (
        <>
          <defs>
            <linearGradient id={`g-${tipo}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#EEF2F7" />
            </linearGradient>
          </defs>
          <rect width="240" height="220" fill={`url(#g-${tipo})`} />
        </>
      )}
      <Desenho />
    </svg>
  );
}
