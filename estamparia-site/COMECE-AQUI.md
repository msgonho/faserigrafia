# Como colocar o site no ar

Sem instalar nada no seu computador. Tudo pelo navegador, em três sites gratuitos.
Reserve uns 20 minutos.

---

## Passo 1 — Criar o banco de dados (Neon)

O banco é onde ficam guardados os pedidos, os produtos e os preços.

1. Entre em **neon.tech** e crie uma conta (dá para entrar com o Google).
2. Clique em **Create project**. Dê o nome que quiser.
3. Em **Region**, escolha **AWS South America (São Paulo)**. Isso deixa o site mais
   rápido para clientes no Brasil e mantém os dados em território nacional.
   > Atenção: a região não pode ser trocada depois. As outras opções da lista ficam
   > nos Estados Unidos, na Europa ou na Ásia.
4. Confirme a criação.
5. Vai aparecer uma caixa chamada **Connection string**, com um texto longo começando
   com `postgresql://`. Clique no botão de copiar.
6. **Cole esse texto num bloco de notas.** Você vai usar daqui a pouco.

---

## Passo 2 — Guardar os arquivos (GitHub)

O GitHub é onde o código fica hospedado. A Vercel lê de lá.

1. Descompacte o arquivo `estamparia-site.zip` no seu computador.
   Vai virar uma pasta chamada `estamparia-site`.
2. Entre em **github.com** e crie uma conta.
3. Clique no **+** no canto superior direito → **New repository**.
4. Em *Repository name*, escreva `estamparia-site`. Marque **Private**. Clique em
   **Create repository**.
5. Na tela seguinte, clique no link **uploading an existing file**.
6. Abra a pasta `estamparia-site` no seu computador, selecione **tudo que está dentro
   dela** e arraste para a área do navegador.
   > Importante: arraste o *conteúdo* da pasta, não a pasta em si.
7. Espere terminar de subir e clique em **Commit changes**.

---

## Passo 3 — Publicar (Vercel)

1. Entre em **vercel.com** e crie a conta clicando em **Continue with GitHub**.
2. Clique em **Add New** → **Project**.
3. Encontre `estamparia-site` na lista e clique em **Import**.
4. Antes de publicar, abra a seção **Environment Variables**. Você vai cadastrar
   quatro itens. Para cada um, escreva o nome no campo da esquerda e o valor no
   da direita, e clique em **Add**:

   | Nome | Valor |
   |---|---|
   | `DATABASE_URL` | o texto que você copiou do Neon no passo 1 |
   | `AUTH_SECRET` | invente uma senha longa e embaralhada, uns 40 caracteres |
   | `ADMIN_EMAIL` | o e-mail que você vai usar para entrar no painel |
   | `ADMIN_PASSWORD` | a senha que você vai usar para entrar no painel |

5. Clique em **Deploy** e espere de 2 a 4 minutos.

O projeto já vem configurado para rodar no servidor da Vercel em São Paulo, do lado do
seu banco de dados. Você não precisa mexer em nada para isso.

Pronto. A Vercel monta o banco, cria seu acesso e publica o site. Ela te mostra o
endereço, algo como `estamparia-site.vercel.app`.

---

## Passo 4 — Entrar no painel

Abra o endereço do seu site e acrescente `/entrar` no final:

`https://seu-endereco.vercel.app/entrar`

Use o e-mail e a senha que você cadastrou no passo 4. Lá dentro:

- **Ajustes** → troque o nome da estamparia, o WhatsApp e o prazo
- **Produtos** → o site já vem com 12 produtos de exemplo. Apague os que não fizer,
  edite os preços dos que fizer, cadastre os que faltam
- **Orçamentos** → é aqui que caem os pedidos do site

---

## Depois de mudar alguma coisa

Tudo que você edita no painel (produtos, preços, textos) aparece no site na hora.
Você só volta na Vercel se um dia quiser mudar o código.

## Se der erro na publicação

A Vercel mostra um log vermelho. Copie o texto do erro e me mande — quase sempre é
uma variável de ambiente com nome errado ou a connection string incompleta.
