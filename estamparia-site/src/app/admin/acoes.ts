"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";
import { criarSessao, encerrarSessao, exigirSessao, lerSessao } from "@/lib/auth";
import { slugify } from "@/lib/format";

/* ---------- sessão ---------- */

export async function entrar(_estado: { erro?: string }, form: FormData) {
  const email = String(form.get("email") || "").trim().toLowerCase();
  const senha = String(form.get("senha") || "");
  const destino = String(form.get("de") || "/admin");

  if (!email || !senha) return { erro: "Informe e-mail e senha." };

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.active || !bcrypt.compareSync(senha, user.passwordHash)) {
    return { erro: "E-mail ou senha não conferem." };
  }

  await criarSessao(user);
  redirect(destino.startsWith("/admin") ? destino : "/admin");
}

export async function sair() {
  await encerrarSessao();
  redirect("/entrar");
}

/* ---------- produtos ---------- */

function parseOpcoes(texto: string, type: "TAMANHO" | "COR") {
  return String(texto || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((pedaco, i) => {
      const m = pedaco.match(/^(.*?)\s*([+-]\s*\d+(?:[.,]\d+)?)?$/);
      const label = (m?.[1] || pedaco).trim();
      const extra = m?.[2] ? parseFloat(m[2].replace(/\s/g, "").replace(",", ".")) : 0;
      return { type, label, extraPrice: extra || 0, position: i };
    });
}

function parseFaixas(qtds: FormDataEntryValue[], precos: FormDataEntryValue[]) {
  const faixas: { minQty: number; price: number }[] = [];
  for (let i = 0; i < qtds.length; i++) {
    const q = parseInt(String(qtds[i] || ""));
    const p = parseFloat(String(precos[i] || "").replace(",", "."));
    if (Number.isFinite(q) && q > 0 && Number.isFinite(p) && p >= 0) faixas.push({ minQty: q, price: p });
  }
  return faixas.sort((a, b) => a.minQty - b.minQty);
}

export async function salvarProduto(form: FormData) {
  await exigirSessao();

  const id = String(form.get("id") || "");
  const name = String(form.get("name") || "").trim();
  if (!name) return;

  const slugBruto = String(form.get("slug") || "").trim();
  const dados = {
    name,
    slug: slugify(slugBruto || name),
    description: String(form.get("description") || "").trim() || null,
    imageUrl: String(form.get("imageUrl") || "").trim() || null,
    categoryId: String(form.get("categoryId") || ""),
    unit: String(form.get("unit") || "UNIDADE") as never,
    basePrice: parseFloat(String(form.get("basePrice") || "0").replace(",", ".")) || 0,
    minQty: parseInt(String(form.get("minQty") || "1")) || 1,
    active: form.get("active") === "on",
    askPrintSides: form.get("askPrintSides") === "on",
    askDimensions: form.get("askDimensions") === "on",
    position: parseInt(String(form.get("position") || "0")) || 0,
  };

  const faixas = parseFaixas(form.getAll("tierQty"), form.getAll("tierPrice"));
  const opcoes = [
    ...parseOpcoes(String(form.get("tamanhos") || ""), "TAMANHO"),
    ...parseOpcoes(String(form.get("cores") || ""), "COR"),
  ];

  if (id) {
    await db.product.update({ where: { id }, data: dados });
    await db.priceTier.deleteMany({ where: { productId: id } });
    await db.productOption.deleteMany({ where: { productId: id } });
    if (faixas.length) await db.priceTier.createMany({ data: faixas.map((f) => ({ ...f, productId: id })) });
    if (opcoes.length) await db.productOption.createMany({ data: opcoes.map((o) => ({ ...o, productId: id })) });
  } else {
    await db.product.create({
      data: { ...dados, tiers: { create: faixas }, options: { create: opcoes as never } },
    });
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/catalogo");
  redirect("/admin/produtos");
}

export async function alternarProduto(form: FormData) {
  await exigirSessao();
  const id = String(form.get("id") || "");
  const p = await db.product.findUnique({ where: { id } });
  if (p) await db.product.update({ where: { id }, data: { active: !p.active } });
  revalidatePath("/admin/produtos");
  revalidatePath("/catalogo");
}

export async function excluirProduto(form: FormData) {
  await exigirSessao();
  await db.product.delete({ where: { id: String(form.get("id") || "") } });
  revalidatePath("/admin/produtos");
  revalidatePath("/catalogo");
  redirect("/admin/produtos");
}

/* ---------- categorias ---------- */

export async function salvarCategoria(form: FormData) {
  await exigirSessao();
  const id = String(form.get("id") || "");
  const name = String(form.get("name") || "").trim();
  if (!name) return;

  const dados = {
    name,
    slug: slugify(String(form.get("slug") || "") || name),
    description: String(form.get("description") || "").trim() || null,
    position: parseInt(String(form.get("position") || "0")) || 0,
  };

  if (id) await db.category.update({ where: { id }, data: dados });
  else await db.category.create({ data: dados });

  revalidatePath("/admin/categorias");
  revalidatePath("/catalogo");
}

export async function excluirCategoria(form: FormData) {
  await exigirSessao();
  await db.category.delete({ where: { id: String(form.get("id") || "") } });
  revalidatePath("/admin/categorias");
  revalidatePath("/catalogo");
}

/* ---------- orçamentos ---------- */

export async function atualizarOrcamento(form: FormData) {
  await exigirSessao();
  const id = String(form.get("id") || "");
  const valor = String(form.get("quotedTotal") || "").replace(",", ".");

  await db.quote.update({
    where: { id },
    data: {
      status: String(form.get("status") || "NOVO") as never,
      quotedTotal: valor ? parseFloat(valor) : null,
      internalNotes: String(form.get("internalNotes") || "").trim() || null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");
  revalidatePath(`/admin/orcamentos/${id}`);
}

export async function excluirOrcamento(form: FormData) {
  await exigirSessao();
  await db.quote.delete({ where: { id: String(form.get("id") || "") } });
  revalidatePath("/admin/orcamentos");
  redirect("/admin/orcamentos");
}

/* ---------- usuários ---------- */

export async function salvarUsuario(form: FormData) {
  await exigirSessao();
  const id = String(form.get("id") || "");
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const senha = String(form.get("senha") || "");
  const role = String(form.get("role") || "STAFF") as never;

  if (!name || !email) return;

  if (id) {
    await db.user.update({
      where: { id },
      data: { name, email, role, ...(senha ? { passwordHash: bcrypt.hashSync(senha, 10) } : {}) },
    });
  } else {
    if (!senha) return;
    const existe = await db.user.findUnique({ where: { email } });
    if (existe) return;
    await db.user.create({ data: { name, email, role, passwordHash: bcrypt.hashSync(senha, 10) } });
  }

  revalidatePath("/admin/usuarios");
}

export async function alternarUsuario(form: FormData) {
  await exigirSessao();
  const id = String(form.get("id") || "");
  const sessao = await lerSessao();
  if (sessao?.id === id) return;
  const u = await db.user.findUnique({ where: { id } });
  if (u) await db.user.update({ where: { id }, data: { active: !u.active } });
  revalidatePath("/admin/usuarios");
}

export async function excluirUsuario(form: FormData) {
  await exigirSessao();
  const id = String(form.get("id") || "");
  const sessao = await lerSessao();
  if (sessao?.id === id) return;
  const total = await db.user.count();
  if (total <= 1) return;
  await db.user.delete({ where: { id } });
  revalidatePath("/admin/usuarios");
}

/* ---------- ajustes ---------- */

export async function salvarAjustes(form: FormData) {
  await exigirSessao();
  const campos = ["nomeEmpresa", "whatsapp", "telefone", "email", "endereco", "cidade", "horario", "prazoPadrao"];
  for (const key of campos) {
    const value = String(form.get(key) || "");
    await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  revalidatePath("/", "layout");
}
