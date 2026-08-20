import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "sessao";

function chave() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "chave-de-desenvolvimento-troque-em-producao"
  );
}

export type Sessao = { id: string; nome: string; papel: "ADMIN" | "STAFF" };

export async function criarSessao(user: { id: string; name: string; role: string }) {
  const token = await new SignJWT({ nome: user.name, papel: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(chave());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function lerSessao(): Promise<Sessao | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, chave());
    return {
      id: String(payload.sub),
      nome: String(payload.nome ?? ""),
      papel: (payload.papel === "ADMIN" ? "ADMIN" : "STAFF"),
    };
  } catch {
    return null;
  }
}

export async function encerrarSessao() {
  (await cookies()).delete(COOKIE);
}

export async function exigirSessao(): Promise<Sessao> {
  const s = await lerSessao();
  if (!s) redirect("/entrar");
  return s;
}

export async function exigirAdmin(): Promise<Sessao> {
  const s = await exigirSessao();
  if (s.papel !== "ADMIN") redirect("/admin?erro=permissao");
  return s;
}
