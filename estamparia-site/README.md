# Site de orçamentos para estamparia

Site público onde o cliente monta o pedido (camiseta, DTF por metro, brinde) e envia o
orçamento, mais um painel em `/admin` onde a equipe recebe e trata cada pedido.

## O que já vem pronto

**Site**
- Página inicial com chamada, categorias e produtos em destaque
- Catálogo com filtro por categoria e busca
- Página de produto com tabela de preço por faixa de quantidade, grade de tamanhos,
  cores, escolha de onde vai a estampa, calculadora de metragem de DTF e link da arte
- "Meu orçamento": carrinho no navegador, estimativa na hora e envio com dados de contato
- Página de confirmação com o número do pedido

**Painel `/admin`** (login em `/entrar`)
- Início: pedidos esperando resposta, em produção, do mês e valor fechado no mês
- Orçamentos: lista com filtro por status e busca; tela de detalhe com ordem de serviço,
  link direto de WhatsApp, mudança de status, valor fechado e anotação interna
- Produtos: cadastrar, editar, publicar/ocultar e excluir; preço base, quantidade mínima,
  faixas de preço por quantidade, tamanhos e cores com acréscimo
- Categorias, usuários (com nível de acesso) e ajustes do site

**Como o preço é calculado**
A faixa de quantidade define o preço unitário; acréscimos de tamanho e de cor entram por
peça. O total mostrado ao cliente é sempre uma *estimativa* — o valor fechado é você quem
grava no painel. Os preços são recalculados no servidor a partir do banco, então ninguém
consegue alterar valores pelo navegador.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Prisma · PostgreSQL

## Rodar na sua máquina

```bash
npm install
cp .env.example .env      # preencha DATABASE_URL e AUTH_SECRET
npm run db:push           # cria as tabelas
npm run db:seed           # cria o admin e um catálogo de exemplo
npm run dev
```

Site em `http://localhost:3000`, painel em `http://localhost:3000/entrar`.

## Publicar na Vercel

1. **Banco.** Crie um PostgreSQL gratuito no [Neon](https://neon.tech) ou no
   [Supabase](https://supabase.com) e copie a string de conexão.
2. **Repositório.** Suba esta pasta para o GitHub.
3. **Projeto.** Na Vercel, importe o repositório. O build já roda `prisma generate`.
4. **Variáveis de ambiente** (Settings → Environment Variables):
   - `DATABASE_URL` — a string do passo 1
   - `AUTH_SECRET` — gere com `openssl rand -base64 32`
   - `ADMIN_EMAIL` e `ADMIN_PASSWORD` — o primeiro acesso do painel
5. **Criar as tabelas.** Com o `.env` local apontando para o banco de produção:
   ```bash
   npx prisma db push
   npm run db:seed
   ```
6. Faça o deploy e entre em `https://seu-site.vercel.app/entrar`.

> Troque a senha do admin depois do primeiro acesso, em Usuários.

## Próximos passos naturais

- **Upload de arquivo de arte** no lugar do link: `@vercel/blob`, com o campo `artUrl` já
  pronto para receber a URL
- **Aviso de pedido novo** por e-mail (Resend) ou WhatsApp (API da Meta), disparado no fim
  de `criarOrcamento`, em `src/app/actions.ts`
- **PDF do orçamento** para enviar ao cliente
- **Histórico por cliente**, agrupando pedidos pelo telefone
