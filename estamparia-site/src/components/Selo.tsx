import { STATUS } from "@/lib/format";

export function Selo({ status }: { status: string }) {
  const s = STATUS[status] ?? { rotulo: status, cor: "bg-grafite text-white" };
  return (
    <span
      className={`inline-block px-2 py-1 text-[12px] font-semibold ${s.cor}`}
    >
      {s.rotulo}
    </span>
  );
}
