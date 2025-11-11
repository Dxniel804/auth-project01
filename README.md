# Projeto de Digitalização E-Commerce: Pedidos & Autenticação

---

## 📝 1. Projeto

Este projeto é o **front-end** de uma aplicação web desenvolvida para modernizar os processos de pedidos e gestão de estoque de uma pequena empresa. O principal objetivo é substituir o fluxo manual (pedidos via WhatsApp e planilhas) por um sistema digital seguro e eficiente.

### 💡 Desafio Central

Desenvolver uma aplicação funcional, segura e visualmente agradável utilizando **Next.js (App Router)** em uma arquitetura de **Monorepo**, garantindo autenticação robusta (Better-Auth), persistência de dados (Prisma) e uma experiência de usuário fluida para clientes e administradores.

### ✨ Principais Funcionalidades

| **Área** | **Funcionalidade** | **Descrição** |
| --- | --- | --- |
| **Clientes** | **Loja Online** | Navegação por produtos e realização de pedidos diretamente pelo site. |
| **Administração** | **Painel Administrativo** | Área restrita para gestão completa de produtos, categorias e acompanhamento de pedidos. |
| **Segurança** | **Login & Acesso** | Autenticação segura via **Better-Auth** e controle de acesso baseado em Papéis (Adminhttps://www.google.com/search?q=/Cliente). |

---

## 💻 2. Tecnologias e Arquitetura

Este projeto segue uma estrutura de **Monorepo** com foco em performance e reuso de código, utilizando as seguintes tecnologias:

| **Categoria** | **Tecnologia** | **Versão** |
| --- | --- | --- |
| **Framework** | **Next.js** | 14+ (App Router) |
| **Linguagem** | **TypeScript** | latest |
| **Autenticação** | **Better-Auth** | latest |
| **ORM** | **Prisma** | latest |
| **Estrutura** | **Monorepo** | (e.g., Turborepo, Lerna) |

### 📂 Estrutura de Pastas

A organização em Monorepo separa a aplicação front-end dos módulos compartilháveis (auth e banco de dados).

```bash
├── apps/
│   └── web/            # Aplicação Front-end Next.js (Cliente e Admin)
│       ├── app/
│       │   ├── painel/     # Rotas protegidas (Admin)
│       │   ├── login/      # Rota de Autenticação
│       │   └── layout.tsx  # Layout principal
│       ├── components/     # Componentes Reutilizáveis
│       └── lib/            # Funções Utilitárias
├── packages/
│   ├── auth/           # Configuração e Utilitários do Better-Auth
│   └── db/             # Schema do Prisma e Scripts de Migração
└── package.json        # Configuração geral do Monorepo
```

---

## ⚙️ 3. Setup do Ambiente Local

Siga estes passos para ter a aplicação rodando em sua máquina.

### 🧩 Pré-Requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js:** Versão 18 ou superior.
2. **Git:** Para clonar o repositório.
3. **Banco de Dados:** Servidor PostgreSQL, MySQL ou SQLite para o Prisma.

### 📥 3.1. Instalação

1. **Clone o Repositório:**Bash
    
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd [NOME_DA_PASTA_DO_PROJETO]
    ```
    
2. **Instale as Dependências do Monorepo:**Bash
    
    ```bash
    npm install  # Ou yarn install / pnpm install
    ```
    

### 🔑 3.2. Configuração de Variáveis de Ambiente

Crie um arquivo chamado **`.env`** na raiz do projeto e preencha com suas credenciais:

```bash
# Configuração do Banco de Dados
DATABASE_URL="postgresql://user:password@host:port/database_name?schema=public"

# Configuração de Segurança para Better-Auth
# Gere uma chave longa e aleatória
AUTH_SECRET="SUA_CHAVE_SECRETA_UNICA_AQUI"
```

### 🐘 3.3. Configuração do Prisma e Migração

Acesse o pacote `db` para gerenciar o banco de dados e gere o cliente Prisma:

1. **Executar Migrações:** Aplica as alterações do `schema.prisma` ao seu banco de dados.Bash
    
    ```bash
    npx prisma migrate dev --name init
    ```
    
2. **Gerar o Cliente Prisma:** Cria o cliente tipado para uso no código.Bash
    
    ```powershell
    npx prisma generate
    ```
    

### ▶️ 3.4. Como Rodar o Projeto

Inicie a aplicação Next.js a partir do diretório raiz:

```bash
# Inicia o servidor de desenvolvimento em http://localhost:3000
npm run dev
```



<img width="443" height="520" alt="image" src="https://github.com/user-attachments/assets/1acdd012-f069-4277-a829-789b4d0e2147" />
