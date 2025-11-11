 Projeto de Digitalização E-Commerce: Pedidos & Autenticação🔗 Badges📝 1. Visão Geral do ProjetoEste projeto é o front-end de uma aplicação web desenvolvida para modernizar os processos de pedidos e gestão de estoque de uma pequena empresa. O principal objetivo é substituir o fluxo manual (pedidos via WhatsApp e planilhas) por um sistema digital seguro e eficiente.💡 Desafio CentralDesenvolver uma aplicação funcional, segura e visualmente agradável utilizando Next.js (App Router) em uma arquitetura de Monorepo, garantindo autenticação robusta (Better-Auth), persistência de dados (Prisma) e uma experiência de usuário fluida para clientes e administradores.✨ Principais FuncionalidadesÁreaFuncionalidadeDescriçãoClientesLoja OnlineNavegação por produtos e realização de pedidos diretamente pelo site.AdministraçãoPainel AdministrativoÁrea restrita para gestão completa de produtos, categorias e acompanhamento de pedidos.SegurançaLogin & AcessoAutenticação segura via Better-Auth e controle de acesso baseado em Papéis (Adminhttps://www.google.com/search?q=/Cliente).💻 2. Tecnologias e ArquiteturaEste projeto segue uma estrutura de Monorepo com foco em performance e reuso de código, utilizando as seguintes tecnologias:CategoriaTecnologiaVersãoFrameworkNext.js14+ (App Router)LinguagemTypeScriptlatestAutenticaçãoBetter-AuthlatestORMPrismalatestEstruturaMonorepo(e.g., Turborepo, Lerna)📂 Estrutura de PastasA organização em Monorepo separa a aplicação front-end dos módulos compartilháveis (auth e banco de dados)..
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
⚙️ 3. Setup do Ambiente LocalSiga estes passos para ter a aplicação rodando em sua máquina.🧩 Pré-RequisitosAntes de começar, certifique-se de ter instalado:Node.js: Versão 18 ou superior.Git: Para clonar o repositório.Banco de Dados: Servidor PostgreSQL, MySQL ou SQLite para o Prisma.📥 3.1. InstalaçãoClone o Repositório:Bashgit clone [URL_DO_SEU_REPOSITORIO]
cd [NOME_DA_PASTA_DO_PROJETO]
Instale as Dependências do Monorepo:Bashnpm install  # Ou yarn install / pnpm install
🔑 3.2. Configuração de Variáveis de AmbienteCrie um arquivo chamado .env na raiz do projeto e preencha com suas credenciais:Ini, TOML# Configuração do Banco de Dados
DATABASE_URL="postgresql://user:password@host:port/database_name?schema=public"

# Configuração de Segurança para Better-Auth
# Gere uma chave longa e aleatória
AUTH_SECRET="SUA_CHAVE_SECRETA_UNICA_AQUI"
🐘 3.3. Configuração do Prisma e MigraçãoAcesse o pacote db para gerenciar o banco de dados e gere o cliente Prisma:Executar Migrações: Aplica as alterações do schema.prisma ao seu banco de dados.Bashnpx prisma migrate dev --name init
Gerar o Cliente Prisma: Cria o cliente tipado para uso no código.Bashnpx prisma generate
▶️ 3.4. Como Rodar o ProjetoInicie a aplicação Next.js a partir do diretório raiz:Bash# Inicia o servidor de desenvolvimento em http://localhost:3000
npm run dev




<img width="443" height="520" alt="image" src="https://github.com/user-attachments/assets/1acdd012-f069-4277-a829-789b4d0e2147" />
