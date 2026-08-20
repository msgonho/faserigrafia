"use server";

import { db } from "@/lib/prisma";
import { precoUnitario } from "@/lib/pricing";
import { revalidatePath } from "next/cache";
import type { DadosCliente, ItemEnviado } from "@/lib/tipos";

async function gerarCodigo() {
  const total = await db.quote.count();
  for (let i = 0; i < 8; i++) {
    const codigo = `ORC-${1000 + total + 1 + i}`;
    const existe = await db.quote.findUnique({ where: { code: codigo } });
    if (!existe) return codigo;
  }
  return `ORC-${Date.now().toString().slice(-6)}`;
}

export async function criarOrcamento(cliente: DadosCliente, itens: ItemEnviado[]) {
  if (!cliente?.nome?.trim() || !cliente?.telefone?.trim()) {
    return { ok: false as const, erro: "Preencha o nome e o telefone para a gente responder." };
  }
  if (!itens?.length) {
    return { ok: false as const, erro: "Seu orçamento está sem itens. Adicione ao menos um produto." };
  }

  // Os preços são recalculados aqui, a partir do banco — nunca do que veio do navegador.
  const produtos = await db.product.findMany({
    where: { id: { in: itens.map((i) => i.productId).filter(Boolean) } },
    include: { tiers: true, options: true },
  });

  const linhas = itens.map((item) => {
    const p = produtos.find((x) => x.id === item.productId);
    const qtd = Math.max(1, Math.round((item.qtd || 0) * 100) / 100);

    if (!p) {
      return {
        productId: null,
        productName: item.nome || "Item",
        unit: item.unit || "UNIDADE",
        qtd: Math.round(qtd),
        size: item.tamanho || null,
        color: item.cor || null,
        sides: item.lados || null,
        widthCm: item.larguraCm ?? null,
        heightCm: item.alturaCm ?? null,
        artUrl: item.artUrl || null,
        notes: item.obs || null,
        unitPrice: 0,
        subtotal: 0,
      };
    }

    const extraTam = p.options.find((o) => o.type === "TAMANHO" && o.label === item.tamanho)?.extraPrice ?? 0;
    const extraCor = p.options.find((o) => o.type === "COR" && o.label === item.cor)?.extraPrice ?? 0;
    const unitario = precoUnitario(p, qtd) + extraTam + extraCor;

    return {
      productId: p.id,
      productName: p.name,
      unit: p.unit,
      qtd: Math.round(qtd),
      size: item.tamanho || null,
      color: item.cor || null,
      sides: item.lados || null,
      widthCm: item.larguraCm ?? null,
      heightCm: item.alturaCm ?? null,
      artUrl: item.artUrl || null,
      notes: item.obs || null,
      unitPrice: unitario,
      subtotal: Math.round(unitario * qtd * 100) / 100,
    };
  });

  const total = linhas.reduce((s, l) => s + l.subtotal, 0);
  const code = await gerarCodigo();

  await db.quote.create({
    data: {
      code,
      customerName: cliente.nome.trim(),
      phone: cliente.telefone.trim(),
      email: cliente.email?.trim() || null,
      company: cliente.empresa?.trim() || null,
      city: cliente.cidade?.trim() || null,
      deadline: cliente.prazo?.trim() || null,
      notes: cliente.observacoes?.trim() || null,
      estimatedTotal: Math.round(total * 100) / 100,
      items: { create: linhas as never },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");

  return { ok: true as const, code };
}
