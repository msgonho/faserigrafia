export function Registro({
  children,
  className = "",
  animar = true,
}: {
  children: React.ReactNode;
  className?: string;
  animar?: boolean;
}) {
  return (
    <span className={`registro ${className}`}>
      <span
        aria-hidden="true"
        className={`chapa text-ciano ${animar ? "chapa-c" : "translate-x-[-5px] translate-y-[4px]"}`}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className={`chapa text-amarelo ${animar ? "chapa-y" : "translate-x-[5px] translate-y-[-4px]"}`}
      >
        {children}
      </span>
      <span className="tinta-preta">{children}</span>
    </span>
  );
}
