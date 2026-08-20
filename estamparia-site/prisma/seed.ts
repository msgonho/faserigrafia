import { PrismaClient, Unit, OptionType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

type Seed = {
  name: string;
  slug: string;
  description: string;
  unit: Unit;
  basePrice: number;
  minQty: number;
  askPrintSides?: boolean;
  askDimensions?: boolean;
  tiers?: [number, number][];
  sizes?: [string, number][];
  colors?: [string, number][];
};

const catalogo: Record<string, Seed[]> = {
  camisetas: [
    {
      name: "Camiseta 100% algodão",
      slug: "camiseta-algodao",
      description:
        "Fio 30.1 penteado, gola careca com ribana reforçada. Estampa em silk até 4 cores ou DTF.",
      unit: Unit.UNIDADE,
      basePrice: 39.9,
      minQty: 10,
      askPrintSides: true,
      tiers: [[10, 39.9], [30, 34.9], [50, 31.9], [100, 27.9]],
      sizes: [["P", 0], ["M", 0], ["G", 0], ["GG", 0], ["XG", 3], ["Infantil", -4]],
      colors: [["Branca", 0], ["Preta", 2], ["Cinza mescla", 1], ["Azul marinho", 2], ["Vermelha", 2]],
    },
    {
      name: "Camiseta dry fit",
      slug: "camiseta-dry-fit",
      description:
        "Poliéster com furos, ideal para time, corrida e uniforme de rua. Estampa em sublimação ou DTF.",
      unit: Unit.UNIDADE,
      basePrice: 49.9,
      minQty: 10,
      askPrintSides: true,
      tiers: [[10, 49.9], [30, 44.9], [50, 39.9]],
      sizes: [["P", 0], ["M", 0], ["G", 0], ["GG", 0], ["XG", 4]],
      colors: [["Branca", 0], ["Preta", 0], ["Royal", 0]],
    },
    {
      name: "Camiseta oversized",
      slug: "camiseta-oversized",
      description: "Malha pesada 180g, ombro caído e corte largo. A queridinha do streetwear.",
      unit: Unit.UNIDADE,
      basePrice: 69.9,
      minQty: 5,
      askPrintSides: true,
      tiers: [[5, 69.9], [20, 62.9], [50, 56.9]],
      sizes: [["P", 0], ["M", 0], ["G", 0], ["GG", 0]],
      colors: [["Off white", 0], ["Preta", 0], ["Verde militar", 3]],
    },
    {
      name: "Moletom canguru",
      slug: "moletom-canguru",
      description: "Moletom flanelado com bolso canguru e capuz forrado. Estampa frente e/ou costas.",
      unit: Unit.UNIDADE,
      basePrice: 119.9,
      minQty: 5,
      askPrintSides: true,
      tiers: [[5, 119.9], [20, 109.9], [50, 99.9]],
      sizes: [["P", 0], ["M", 0], ["G", 0], ["GG", 0], ["XG", 8]],
      colors: [["Preto", 0], ["Cinza mescla", 0], ["Bordô", 4]],
    },
  ],
  dtf: [
    {
      name: "DTF por metro linear",
      slug: "dtf-metro",
      description:
        "Rolo de 58 cm de largura. Você manda a arte fechada, a gente encaixa e imprime o metro cheio.",
      unit: Unit.METRO,
      basePrice: 79.9,
      minQty: 1,
      askDimensions: true,
      tiers: [[1, 79.9], [5, 69.9], [10, 62.9], [20, 55.9]],
    },
    {
      name: "DTF folha A3",
      slug: "dtf-folha-a3",
      description: "Folha 29,7 × 42 cm avulsa, para quem precisa de pouca quantidade e sem espera.",
      unit: Unit.PECA,
      basePrice: 24.9,
      minQty: 1,
      tiers: [[1, 24.9], [10, 21.9], [30, 18.9]],
    },
    {
      name: "DTF UV (adesivo)",
      slug: "dtf-uv",
      description: "Aplica em caneca, garrafa, celular, vidro e metal. Sem calor, só descolar e colar.",
      unit: Unit.PECA,
      basePrice: 12.9,
      minQty: 10,
      askDimensions: true,
      tiers: [[10, 12.9], [50, 9.9], [100, 7.9]],
    },
  ],
  brindes: [
    {
      name: "Caneca cerâmica 325 ml",
      slug: "caneca-325",
      description: "Cerâmica branca AAA com impressão em sublimação. Vai à máquina de lavar.",
      unit: Unit.UNIDADE,
      basePrice: 29.9,
      minQty: 6,
      tiers: [[6, 29.9], [24, 25.9], [50, 22.9]],
      colors: [["Branca", 0], ["Interior colorido", 4], ["Mágica", 12]],
    },
    {
      name: "Ecobag algodão cru",
      slug: "ecobag-algodao",
      description: "Sacola 38 × 42 cm com alça reforçada. Estampa em silk de 1 a 3 cores.",
      unit: Unit.UNIDADE,
      basePrice: 27.9,
      minQty: 10,
      askPrintSides: true,
      tiers: [[10, 27.9], [50, 23.9], [100, 19.9]],
      colors: [["Cru", 0], ["Preta", 3]],
    },
    {
      name: "Squeeze 500 ml",
      slug: "squeeze-500",
      description: "Garrafa de alumínio com tampa rosca e mosquetão. Gravação em DTF UV.",
      unit: Unit.UNIDADE,
      basePrice: 39.9,
      minQty: 10,
      tiers: [[10, 39.9], [50, 34.9], [100, 29.9]],
      colors: [["Prata", 0], ["Preta", 0], ["Branca", 0]],
    },
  ],
  uniformes: [
    {
      name: "Camisa polo bordada",
      slug: "polo-bordada",
      description: "Piquet com punho e gola em ribana. Bordado do logo no peito incluso.",
      unit: Unit.UNIDADE,
      basePrice: 89.9,
      minQty: 10,
      tiers: [[10, 89.9], [30, 79.9], [50, 72.9]],
      sizes: [["P", 0], ["M", 0], ["G", 0], ["GG", 0], ["XG", 6]],
      colors: [["Branca", 0], ["Preta", 0], ["Azul marinho", 0]],
    },
    {
      name: "Boné trucker",
      slug: "bone-trucker",
      description: "Frente em brim e traseira em tela, com aba curva e regulagem. Bordado ou DTF.",
      unit: Unit.UNIDADE,
      basePrice: 45.0,
      minQty: 12,
      tiers: [[12, 45.0], [50, 39.0], [100, 34.0]],
      colors: [["Preto", 0], ["Branco", 0], ["Vermelho", 0]],
    },
  ],
};

const categorias = [
  { slug: "camisetas", name: "Camisetas e moletons", description: "Silk, DTF e sublimação em malha.", position: 1 },
  { slug: "dtf", name: "DTF por metro", description: "Impressão pronta pra você prensar aí.", position: 2 },
  { slug: "brindes", name: "Brindes personalizados", description: "Caneca, ecobag, squeeze e mais.", position: 3 },
  { slug: "uniformes", name: "Uniformes", description: "Polo, boné e camisa de trabalho.", position: 4 },
];

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@estamparia.com.br";
  const senha = process.env.ADMIN_PASSWORD || "admin123";

  await db.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Administrador",
      email,
      passwordHash: bcrypt.hashSync(senha, 10),
      role: Role.ADMIN,
    },
  });

  const settings: Record<string, string> = {
    nomeEmpresa: "F&A Serigrafia e Estamparia",
    whatsapp: "5514997001911",
    telefone: "(14) 99700-1911",
    email: "f.a_serigrafia@hotmail.com",
    endereco: "R. Cornélio Pires, 428 - Centro, Botucatu - SP, 18600-370",
    cidade: "Botucatu, SP",
    horario: "Segunda a sexta, 8h às 18h · Sábado, 8h às 12h",
    prazoPadrao: "5 a 7 dias úteis após aprovação da arte",
  };

  // Grava os dados reais uma única vez; depois disso, o que valer é o que
  // estiver no painel — o seed não sobrescreve mais nada.
  const marca = await db.setting.findUnique({ where: { key: "ajustesReais" } });
  for (const [key, value] of Object.entries(settings)) {
    if (marca) {
      await db.setting.upsert({ where: { key }, update: {}, create: { key, value } });
    } else {
      await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
    }
  }
  if (!marca) {
    await db.setting.create({ data: { key: "ajustesReais", value: "1" } });
  }

  for (const c of categorias) {
    const cat = await db.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, position: c.position },
      create: c,
    });

    let pos = 0;
    for (const p of catalogo[c.slug]) {
      pos += 1;
      const existente = await db.product.findUnique({ where: { slug: p.slug } });
      if (existente) continue;

      await db.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          categoryId: cat.id,
          unit: p.unit,
          basePrice: p.basePrice,
          minQty: p.minQty,
          askPrintSides: p.askPrintSides ?? false,
          askDimensions: p.askDimensions ?? false,
          position: pos,
          tiers: {
            create: (p.tiers ?? []).map(([minQty, price]) => ({ minQty, price })),
          },
          options: {
            create: [
              ...(p.sizes ?? []).map(([label, extraPrice], i) => ({
                type: OptionType.TAMANHO,
                label,
                extraPrice,
                position: i,
              })),
              ...(p.colors ?? []).map(([label, extraPrice], i) => ({
                type: OptionType.COR,
                label,
                extraPrice,
                position: i,
              })),
            ],
          },
        },
      });
    }
  }

  const camiseta = await db.product.findUnique({ where: { slug: "camiseta-algodao" } });
  const dtf = await db.product.findUnique({ where: { slug: "dtf-metro" } });
  const jaTem = await db.quote.findFirst();

  if (!jaTem && camiseta && dtf) {
    await db.quote.create({
      data: {
        code: "ORC-1001",
        customerName: "Marina Alves",
        phone: "11988887777",
        email: "marina@padariadovale.com.br",
        company: "Padaria do Vale",
        city: "Guarulhos, SP",
        deadline: "Preciso até dia 30",
        notes: "O logo está em PDF vetor, mando por e-mail assim que confirmarem.",
        estimatedTotal: 30 * 34.9 + 3 * 79.9,
        items: {
          create: [
            {
              productId: camiseta.id,
              productName: "Camiseta 100% algodão",
              unit: Unit.UNIDADE,
              qty: 30,
              size: "Grade sortida",
              color: "Preta",
              sides: "Frente e costas",
              unitPrice: 34.9,
              subtotal: 30 * 34.9,
              notes: "10 P, 10 M, 10 G",
            },
            {
              productId: dtf.id,
              productName: "DTF por metro linear",
              unit: Unit.METRO,
              qty: 3,
              unitPrice: 79.9,
              subtotal: 3 * 79.9,
              notes: "Arte do avental, 20 x 25 cm",
            },
          ],
        },
      },
    });
  }

  console.log("Seed concluído. Entre em /entrar com:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
