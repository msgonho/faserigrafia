import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";
import { getAjustes } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const ajustes = await getAjustes();
  return (
    <div className="flex min-h-screen flex-col">
      <Cabecalho />
      <main className="flex-1">{children}</main>
      <Rodape ajustes={ajustes} />
    </div>
  );
}
