import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const chave = new TextEncoder().encode(
  process.env.AUTH_SECRET || "chave-de-desenvolvimento-troque-em-producao"
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("sessao")?.value;
  let valido = false;

  if (token) {
    try {
      await jwtVerify(token, chave);
      valido = true;
    } catch {
      valido = false;
    }
  }

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !valido) {
    const url = req.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("de", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/entrar" && valido) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/entrar"] };
