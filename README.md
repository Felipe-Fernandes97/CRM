O que já está criado
Módulos Backend (CRUD completo):

Auth (login, registro, JWT)
Users (com roles: admin, gerente, vendedor)
Clients (contatos de clientes)
Companies (empresas com CNPJ)
Leads (prospects com status e pontuação)
Páginas Frontend:

Login e Registro
Dashboard (cards de estatísticas, pipeline)
Clientes (listagem, busca, paginação, CRUD)
Empresas (listagem, CRUD, validação CNPJ)
Leads (gestão com status)
Componentes UI: Button, Input, Card, Modal, Table, Pagination, Badge, Avatar, Select, Skeleton, EmptyState

Infraestrutura: Guards de autenticação, decorators de roles, filtros de erro, paginação, Axios com interceptors, Docker Compose para PostgreSQL

O que está planejado (sidebar) mas NÃO implementado ainda
Oportunidades
Negociações
Atividades
Comunicações
Equipe
Relatórios
Automações
Configurações
Instalações necessárias
Para rodar o projeto, você precisa executar:

1. Pré-requisitos no seu sistema:

Node.js (v18 ou superior)
Docker Desktop (para o PostgreSQL)
2. Subir o banco de dados:

cd C:\Users\Multi360\Documents\CRM\CRM
docker-compose up -d

3. Instalar dependências do Backend:

cd backend
npm install

4. Instalar dependências do Frontend:

cd frontend
npm install

5. Configurar variáveis de ambiente:

Backend: copiar .env.example para .env e ajustar os valores
Frontend: copiar .env.local.example para .env.local
6. Rodar o projeto:

# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev

O backend roda na porta 3001 e o frontend na porta padrão do Next.js (3000). O PostgreSQL fica exposto na porta 5433.
