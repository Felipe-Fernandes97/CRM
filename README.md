🚀 CRM Full Stack – Next.js + NestJS

Sistema CRM moderno e escalável, desenvolvido com Next.js no frontend e NestJS no backend, focado em performance, organização de código e boas práticas.

Projeto em evolução contínua, com base sólida já implementada e várias funcionalidades estratégicas planejadas.

🧠 Tech Stack
Frontend

Next.js 16

React 19

Tailwind CSS 4

Backend

NestJS 11

TypeScript

TypeORM 0.3

Banco de Dados

PostgreSQL 16 (Docker)

Autenticação & Segurança

JWT

Passport.js

Bcrypt

Guards de autenticação

Controle de acesso por roles

✅ Funcionalidades Já Implementadas
🔐 Backend (CRUD completo)

Auth

Login

Registro

Autenticação JWT

Users

Roles: admin, gerente, vendedor

Clients

Cadastro e gestão de clientes

Companies

Empresas com validação de CNPJ

Leads

Status

Pontuação

Pipeline

🎨 Frontend

Autenticação

Login

Registro

Dashboard

Cards de estatísticas

Pipeline visual

Clientes

Listagem

Busca

Paginação

CRUD completo

Empresas

Listagem

CRUD

Validação de CNPJ

Leads

Gestão por status

🧩 Componentes UI Reutilizáveis

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

🏗️ Infraestrutura & Arquitetura

Guards de autenticação

Decorators de roles

Filtros globais de erro

Paginação padronizada

Axios com interceptors

Docker Compose para o banco de dados

Estrutura modular e escalável

🧭 Funcionalidades Planejadas (não implementadas ainda)

Oportunidades

Negociações

Atividades

Comunicações

Equipe

Relatórios

Automações

Configurações

Essas opções já aparecem na sidebar, mas ainda não possuem implementação.

⚙️ Instalação e Execução do Projeto
1️⃣ Pré-requisitos

Node.js v18 ou superior

Docker Desktop

2️⃣ Subir o banco de dados (PostgreSQL)
cd C:\Users\Multi360\Documents\CRM\CRM
docker-compose up -d


O PostgreSQL ficará disponível na porta 5433

3️⃣ Instalar dependências do Backend
cd backend
npm install

4️⃣ Instalar dependências do Frontend
cd frontend
npm install

5️⃣ Configurar variáveis de ambiente

Backend

cp .env.example .env


Frontend

cp .env.local.example .env.local


Ajuste os valores conforme seu ambiente.

6️⃣ Rodar o projeto
Terminal 1 – Backend
cd backend
npm run start:dev

Terminal 2 – Frontend
cd frontend
npm run dev

🌐 Portas Utilizadas
Serviço	Porta
Backend (API)	3001
Frontend	3000
PostgreSQL	5433
📌 Status do Projeto

🟡 Em desenvolvimento ativo
Base sólida pronta, com foco em evoluir para um CRM completo, profissional e escalável.
