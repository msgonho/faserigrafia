import { STATUS } from "@/lib/format";

export function Selo({ status }: { status: string }) {
  const s = STATUS[status] ?? { rotulo: status, cor: "bg-grafite text-white" };
  return (
    <span
      className={`inline-block px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${s.cor}`}
    >
      {s.rotulo}
    </span>
  );
}
