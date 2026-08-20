"use client";

import { useActionState } from "react";
import { entrar } from "@/app/admin/acoes";

export function FormLogin({ de }: { de?: string }) {
  const [estado, acao, pendente] = useActionState(entrar, { erro: undefined as string | undefined });

  return (
    <form action={acao} className="mt-8 space-y-4">
      <input type="hidden" name="de" value={de || "/admin"} />

      <div>
        <label className="rotulo-campo" htmlFor="email">
          E-mail
        </label>
        <input id="email" name="email" type="email" autoComplete="username" className="campo" />
      </div>

      <div>
        <label className="rotulo-campo" htmlFor="senha">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          autoComplete="current-password"
          className="campo"
        />
      </div>

      {estado?.erro && (
        <p className="border-l-2 border-magenta bg-magenta/5 px-3 py-2 text-[13px]">{estado.erro}</p>
      )}

      <button type="submit" disabled={pendente} className="botao w-full disabled:bg-grafite disabled:border-grafite">
        {pendente ? "Verificando..." : "Entrar"}
      </button>
    </form>
  );
}
