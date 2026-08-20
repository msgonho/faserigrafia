/** Destaque de texto usando o azul da marca. */
export function Registro({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
  animar?: boolean;
}) {
  return <span className={`text-azul ${className}`}>{children}</span>;
}

/** Logotipo F&A, nas duas versões. */
export function Logo({
  variante = "horizontal",
  className = "",
}: {
  variante?: "horizontal" | "redondo";
  className?: string;
}) {
  const src = variante === "redondo" ? "/logo-redondo.png" : "/logo-horizontal.png";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="F&A Serigrafia e Estamparia" className={className} />
  );
}
