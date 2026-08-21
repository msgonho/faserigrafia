/**
 * Fotos livres (licença Unsplash, uso comercial permitido) usadas enquanto
 * a F&A não sobe as fotos das peças reais. Basta preencher o campo "Link da
 * foto" no painel que a foto do produto substitui a daqui.
 */
const base = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const FOTOS: Record<string, string> = {
  camiseta: base("photo-1651761179569-4ba2aa054997"),
  "camiseta-vestida": base("photo-1521572163474-6864f9cf17ab"),
  "camiseta-preta": base("photo-1610502778270-c5c6f4c7d575"),
  "camiseta-cabide": base("photo-1778671394516-8270eac13c42"),
  "camiseta-parede": base("photo-1722310752951-4d459d28c678"),
  moletom: base("photo-1620799140408-edc6dcb6d633"),
  polo: base("photo-1581655353564-df123a1eb820"),
  dryfit: base("photo-1622445275463-afa2ab738c34"),
  pilha: base("photo-1562157873-818bc0726f68"),
};

export const FOTO_CAPA = base("photo-1562157873-818bc0726f68", 1600);
