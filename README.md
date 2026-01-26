🎯 CRM Full Stack – Sistema de Gestão Comercial

Sistema CRM completo para gestão de clientes, empresas e leads, desenvolvido com NestJS no backend e Next.js no frontend, focado em escalabilidade, organização e boas práticas.

👨‍💻 Autores
Felipe Fernandes – @Felipe-Fernandes97

📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado na sua máquina:
Node.js 18+
Docker Desktop
Git

🚀 Instalação e Configuração
1️⃣ Clonar o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git
cd CRM

2️⃣ Subir o Banco de Dados (PostgreSQL via Docker)
docker-compose up -d

✅ PostgreSQL rodando na porta 5433

3️⃣ Configurar o Backend
cd backend

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env


Editar o .env conforme necessário.

4️⃣ Iniciar o Backend
npm run start:dev


✅ Backend rodando em:
http://localhost:3001

5️⃣ Configurar o Frontend

Em outro terminal:

cd frontend

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.local.example .env.local


Editar o .env.local se necessário.

6️⃣ Iniciar o Frontend
npm run dev


✅ Frontend rodando em:
http://localhost:3000

🌐 Portas Utilizadas
Serviço	Porta
Frontend	3000
Backend (API)	3001
PostgreSQL	5433

🧠 Tech Stack
°Frontend
Next.js 16
React 19
Tailwind CSS 4

°Backend
NestJS 11
TypeScript
TypeORM 0.3

°Banco de Dados
PostgreSQL 16 (Docker)

°Autenticação & Segurança
JWT
Passport.js
Bcrypt
Guards de autenticação
Controle de acesso por roles

🧩 Funcionalidades Implementadas
🔐 Backend (CRUD completo)

°Auth
Login
Registro
JWT

°Users
Roles: admin, gerente, vendedor

°Clients
Gestão de clientes

°Companies
Empresas com validação de CNPJ

°Leads
Status
Pontuação
Pipeline

🎨 Frontend

Login e Registro
Dashboard com cards de estatísticas
Clientes (listagem, busca, paginação, CRUD)
Empresas (CRUD + validação de CNPJ)
Leads (gestão por status)

🧱 Componentes UI

Button
Input
Card
Modal
Table
Pagination
Badge
Avatar
Select
Skeleton
EmptyState

🏗️ Infraestrutura
Guards de autenticação
Decorators de roles
Filtros globais de erro
Paginação padronizada
Axios com interceptors
Docker Compose para PostgreSQL
Arquitetura modular e escalável

🧭 Funcionalidades Planejadas (não implementadas)
Oportunidades
Negociações
Atividades
Comunicações
Equipe
Relatórios
Automações
Configurações

Essas opções já aparecem na sidebar, mas ainda não possuem implementação.
