# 📚 Sistema de Cortesias

Sistema para monitorar envio de livros de cortesia e confirmação de divulgação por parceiros.

---

## 🗂 Estrutura do Projeto

```
src/
├── lib/supabase.js      # Conexão e funções do banco
├── pages/
│   ├── Dashboard.js     # Visão geral com estatísticas
│   ├── Parceiros.js     # Cadastro de parceiros
│   ├── Livros.js        # Cadastro de livros
│   └── Envios.js        # Registro e acompanhamento de envios
├── App.js               # Navegação principal
└── App.css              # Estilos globais
supabase-schema.sql      # Script do banco de dados
```

---

## 🚀 Passo a Passo de Configuração

### ETAPA 1 — Criar conta no Supabase

1. Acesse **https://supabase.com** e clique em **Start your project**
2. Faça login com o Google ou GitHub
3. Clique em **New Project**
4. Preencha:
   - **Name**: cortesias-sistema
   - **Database Password**: crie uma senha forte (guarde ela!)
   - **Region**: South America (São Paulo)
5. Aguarde ~2 minutos até o projeto ser criado

### ETAPA 2 — Criar as tabelas no banco

1. No painel do Supabase, clique em **SQL Editor** (menu lateral)
2. Clique em **New query**
3. Abra o arquivo `supabase-schema.sql` deste projeto
4. Cole todo o conteúdo na área de texto
5. Clique em **Run** (ou Ctrl+Enter)
6. Deve aparecer "Success" — as tabelas foram criadas!

### ETAPA 3 — Copiar as credenciais do Supabase

1. No painel do Supabase, clique em **Settings** (ícone de engrenagem)
2. Clique em **API**
3. Copie os dois valores:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **anon public key** → uma chave longa começando com `eyJ...`

### ETAPA 4 — Criar conta no GitHub e fazer upload do código

1. Acesse **https://github.com** e crie uma conta (ou faça login)
2. Clique em **New repository** (botão verde)
3. Nome: `cortesias-sistema`
4. Deixe como **Public** ou **Private** (sua escolha)
5. Clique em **Create repository**
6. Faça upload de todos os arquivos deste projeto

### ETAPA 5 — Criar conta na Vercel e fazer o deploy

1. Acesse **https://vercel.com** e clique em **Sign Up**
2. Faça login com o GitHub (recomendado)
3. Clique em **Add New Project**
4. Selecione o repositório `cortesias-sistema`
5. Antes de clicar em Deploy, clique em **Environment Variables**
6. Adicione as duas variáveis:
   - `REACT_APP_SUPABASE_URL` → cole a URL do Supabase (Etapa 3)
   - `REACT_APP_SUPABASE_ANON_KEY` → cole a anon key (Etapa 3)
7. Clique em **Deploy**
8. Aguarde ~2 minutos — seu sistema estará no ar!

---

## 📋 Como usar o sistema

### Cadastrar Parceiros
- Vá em **Parceiros** no menu lateral
- Clique em **Novo Parceiro**
- Preencha nome, canal (Instagram, YouTube etc.), tipo e contato
- Salve

### Cadastrar Livros
- Vá em **Livros** no menu lateral  
- Clique em **Novo Livro**
- Preencha título, autor, editora
- Salve

### Registrar um Envio de Cortesia
- Vá em **Envios** no menu lateral
- Clique em **Registrar Envio**
- Selecione o parceiro e o livro
- Defina a data do envio
- O status inicia como **Enviado**

### Confirmar Divulgação
- Na lista de Envios, clique em **✓ Confirmar divulgação**
- O status muda automaticamente para **Divulgado**
- Ou edite o envio e mude o status manualmente

---

## 🔧 Desenvolvimento Local (opcional)

```bash
# Instalar dependências
npm install

# Criar arquivo de variáveis locais
cp .env.example .env
# Edite o .env com suas credenciais do Supabase

# Iniciar servidor de desenvolvimento
npm start
```

---

## 💡 Dicas

- **Segurança**: O sistema está configurado para acesso público (ideal para equipe interna). Se precisar de login, avise para adicionar autenticação.
- **Backup**: O Supabase faz backups automáticos diários no plano gratuito.
- **Atualizações**: Qualquer push para o GitHub faz o deploy automático na Vercel.
