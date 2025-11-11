E-Commerce Digitalização Simplificada📝 Descrição do ProjetoEste projeto consiste no desenvolvimento do front-end de uma aplicação web para a digitalização de serviços de uma pequena empresa de e-commerce, substituindo o processo manual de pedidos por WhatsApp e planilhas.O sistema visa resolver problemas como pedidos duplicados, atrasos na entrega e falta de controle de estoque, oferecendo uma plataforma moderna, segura e com uma experiência de usuário aprimorada.🌟 Funcionalidades PrincipaisLoja Online para Clientes: Permite que clientes naveguem e façam pedidos de produtos diretamente pelo site.Painel Administrativo: Área restrita para administradores com funcionalidades de gestão:Gestão de ProdutosGestão de CategoriasGestão de PedidosAutenticação Segura: Login seguro com controle de acesso diferenciado para Clientes e Administradores.Controle de Acesso: Proteção de rotas, garantindo que apenas administradores acessem o painel.💻 Tecnologias UtilizadasEste projeto utiliza uma arquitetura moderna de Monorepo para gerenciar a aplicação web principal e os pacotes de utilidade e banco de dados, promovendo reuso de código e organização.CategoriaTecnologiaDescriçãoFrameworkNext.js 14+Framework React para produção, utilizando o App Router.LinguagemTypeScriptGarante maior segurança e robustez ao código com tipagem estática.EstruturaMonorepoOrganização do código em múltiplos pacotes em um único repositório.AutenticaçãoBetter-AuthSolução de autenticação completa e flexível.Banco de DadosPrismaORM (Object-Relational Mapper) moderno para acesso e migração de dados.Estilização[Adicionar tecnologia de CSS, e.g., Tailwind CSS / Sass / CSS Modules][Descrição breve]🏗️ Estrutura do MonorepoO projeto é dividido em dois diretórios principais: apps/ para a aplicação de front-end e packages/ para os módulos de utilidade e configuração compartilhados.DiretórioPacoteConteúdoapps/web/webAplicação Next.js (Front-end). Contém as rotas de cliente (/) e rotas administrativas (/painel/).packages/auth/authConfigurações de autenticação e utilitários relacionados ao Better-Auth.packages/db/dbConfiguração do Prisma, schema.prisma e scripts de migração do banco de dados.Detalhe das Rotas (apps/web/app/)/: Rotas públicas da loja e acesso principal./login: Página de autenticação de usuários./painel/: Área administrativa./painel/page.tsx: Dashboard principal./painel/categorias: Gestão de categorias de produtos./painel/produtos: Gestão dos itens/produtos./painel/pedidos: Gerenciamento de pedidos recebidos.⚙️ Como Rodar o Projeto LocalmenteSiga os passos abaixo para configurar e executar a aplicação em seu ambiente de desenvolvimento.Pré-RequisitosCertifique-se de ter instalado em sua máquina:Node.js (versão recomendada: 18+)npm ou Yarn (ou pnpm, dependendo do gerenciador de pacotes do monorepo)GitUm servidor de Banco de Dados compatível com Prisma (e.g., PostgreSQL, MySQL, SQLite).1. Clonar o RepositórioBashgit clone [URL_DO_SEU_REPOSITORIO]
cd [NOME_DA_PASTA_DO_PROJETO]
2. Instalar DependênciasNo diretório raiz do monorepo:Bash# Se estiver usando npm (ou o gerenciador de pacotes definido)
npm install
3. Configuração do Banco de DadosCrie um arquivo .env na raiz do projeto (ou em apps/web e packages/db, dependendo da configuração exata do monorepo) e defina a variável de conexão com o banco:Ini, TOML# Exemplo para PostgreSQL
DATABASE_URL="postgresql://user:password@host:port/database_name"

# Chave secreta de autenticação (necessária para Better-Auth)
AUTH_SECRET="UMA_CHAVE_SECRETA_LONGA_E_ALEATORIA"
4. Configurar e Migrar o PrismaExecute as migrações do banco de dados e gere o cliente Prisma:Bash# 1. Aplicar as migrações definidas em packages/db/
npx prisma migrate dev --name init

# 2. Gerar o cliente Prisma na pasta do monorepo
npx prisma generate
5. Executar o ProjetoNavegue para a pasta da aplicação e inicie o servidor de desenvolvimento do Next.js:Bashcd apps/web/

# Iniciar o servidor em modo de desenvolvimento
npm run dev
A aplicação estará acessível em: http://localhost:3000 (ou a porta padrão do Next.js).






<img width="443" height="520" alt="image" src="https://github.com/user-attachments/assets/1acdd012-f069-4277-a829-789b4d0e2147" />
