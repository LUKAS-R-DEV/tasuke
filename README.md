<p align="center">
  <img src="https://img.shields.io/badge/Java-21-%23ED8B00?logo=openjdk&logoColor=white" alt="Java 21">
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1.0-%236DB33F?logo=springboot&logoColor=white" alt="Spring Boot 4.1.0">
  <img src="https://img.shields.io/badge/PostgreSQL-16-%234169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 16">
  <img src="https://img.shields.io/badge/React-19-%2361DAFB?logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-6-%233178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-8-%23646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-%2306B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4">
  <img src="https://img.shields.io/badge/License-MIT-%23FF5733" alt="License">
</p>

<h1 align="center">⚡ Tasuke</h1>
<p align="center">
  <em>Sistema de helpdesk completo — backend em Spring Boot + frontend em React.</em>
</p>

---

## 📋 Índice

- [Sobre](#-sobre)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Começando](#-começando)
- [API](#-api)
- [Estrutura](#-estrutura)
- [Docker](#-docker)
- [Licença](#-licença)

---

## 💡 Sobre

**Tasuke** (助け — "ajuda" em japonês) é um sistema de helpdesk full-stack para gerenciamento
de chamados de suporte:

- **Backend**: API REST segura com autenticação **JWT**, controle de papéis, tickets e comentários.
- **Frontend**: interface SaaS com identidade *Japanese Cyberpunk* — obsidiana, ciano elétrico e
  roxo — construída com React, TypeScript, Vite, Tailwind CSS e shadcn/ui.

---

## 🧱 Arquitetura

```text
tasuke/                  # backend (raiz do repositório)
├── src/main/java/com/lukas_r_dev/tasuke/
└── tasuke-front/        # frontend
    └── src/
```

O frontend consome a API REST do backend em `http://localhost:8080` (sem prefixo de contexto).

---

## 🛠 Tecnologias

### Tecnologias do backend

| Categoria | Tecnologia |
|-----------|-----------|
| **Linguagem** | Java 21 |
| **Framework** | Spring Boot 4.1.0 |
| **Segurança** | Spring Security + JWT (jjwt 0.12) |
| **ORM** | Spring Data JPA / Hibernate |
| **Database** | PostgreSQL 16 |
| **Migração** | Flyway |
| **Mapper** | MapStruct 1.6 |
| **Build** | Maven Wrapper |
| **Documentação** | springdoc-openapi (Swagger UI) |
| **Validação** | Jakarta Bean Validation |

### Tecnologias do frontend

| Categoria | Tecnologia |
|-----------|-----------|
| **Linguagem** | TypeScript |
| **UI** | React 19 |
| **Build** | Vite 8 |
| **Estilo** | Tailwind CSS 4 + shadcn/ui (Radix UI) |
| **Ícones** | Lucide |
| **Roteamento** | React Router 7 |
| **Requisições** | Axios |
| **Estado servidor** | TanStack Query 5 |
| **Autenticação** | Context API |
| **Formulários** | React Hook Form |
| **Toasts** | Sonner |
| **Fonte** | Geist |

---

## ✨ Funcionalidades

### Backend

- **Autenticação JWT** — `POST /auth/login` e `GET /auth/me`
- **Papéis** — `ROLE_ADMIN`, `ROLE_AGENT`, `ROLE_CUSTOMER`
- **Tickets** — abertura, listagem, detalhe, `OPEN → IN_PROGRESS → CLOSED`
- **Comentários** — conversa por ticket (ordenada por data)
- **Usuários** — cadastro, consulta, atualização e ativação/desativação, com validação
- **Respostas padronizadas** (`ApiResponse<T>`) e **tratamento global** de exceções
- **Migração automática** do banco com Flyway
- **Swagger UI** em `/swagger-ui.html`

### Frontend

- **Login** com tema obsidiana e layout limpo
- **Dashboard** com estatísticas, tickets recentes e distribuições por status/prioridade
- **Tickets** — listagem com busca, filtros e paginação; criação em diálogo; detalhes com conversa
- **Usuários** — listagem, criação/edição, ativação/desativação (restrito a admins)
- **Perfil** e **Configurações**
- **Loading global** (barra de progresso) e **toasts** temáticos
- Sidebar expansível/colapsável e responsiva (Sheet no mobile)

---

## 🚀 Começando

### Pré-requisitos

- Java 21+
- Node.js 20+ (recomendado 22+)
- Docker & Docker Compose (para o PostgreSQL)

### 1. Banco de dados

```bash
docker compose up -d
```

### 2. Backend

```bash
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`. O CORS já está configurado para permitir o frontend.

### 3. Frontend

```bash
cd tasuke-front
npm install
npm run dev
```

A interface estará disponível em `http://localhost:5173`.

> O login exige um usuário existente no banco. Não há seed automático — crie um usuário via
> `POST /users` (role `ROLE_ADMIN`) ou insira manualmente.

---

## 📡 API

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/auth/login` | Autentica e retorna um token JWT |
| `GET` | `/auth/me` | Retorna o usuário autenticado |

### Tickets

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/tickets` | Lista todos os tickets |
| `GET` | `/tickets/{id}` | Busca ticket por ID |
| `POST` | `/tickets` | Cria um ticket (`ROLE_CUSTOMER`, `ROLE_ADMIN`) |
| `PATCH` | `/tickets/in-progress/{id}` | Coloca em andamento (`ROLE_ADMIN`, `ROLE_AGENT`) |
| `PATCH` | `/tickets/closed/{id}` | Fecha o ticket (`ROLE_ADMIN`, `ROLE_AGENT`) |

### Comentários

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/comments/tickets/{ticketId}/comments` | Lista comentários do ticket |
| `POST` | `/comments` | Cria um comentário |

### Usuários (exige `ROLE_ADMIN`)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/users` | Lista usuários ativos |
| `GET` | `/users/{id}` | Busca usuário por ID |
| `POST` | `/users` | Cria um usuário |
| `PATCH` | `/users/update/{id}` | Atualiza um usuário |
| `PATCH` | `/users/deactivate/{id}` | Desativa um usuário |
| `PATCH` | `/users/activate/{id}` | Ativa um usuário |

### Exemplo — login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@empresa.com","password":"123456"}'
```

Resposta:

```json
{
  "statusResponse": "SUCCESS",
  "message": "login successfully",
  "data": { "token": "eyJhbGciOi..." },
  "timestamp": "2026-08-09T00:00:00.000Z"
}
```

### Exemplo — criação de ticket

```bash
curl -X POST http://localhost:8080/tickets \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Erro ao acessar relatório","description":"O relatório não carrega os dados do mês.","userId":1,"priority":"HIGH"}'
```

---

## 📁 Estrutura

### Estrutura do backend

```text
src/main/java/com/lukas_r_dev/tasuke/
├── shared/
│   ├── exceptions/        # Exceções + handler global
│   └── response/          # Respostas padronizadas
├── security/
│   ├── config/            # Security + CORS
│   ├── controller/        # /auth
│   ├── dtos/              # LoginRequest / LoginResponse
│   └── jwt/               # Filtro e serviço JWT
├── users/                 # Entidade, controller, dtos, mapper, repository, service
├── ticket/                # Ticket + enums Status/Priority + serviços
└── comment/               # Comentários por ticket
```

### Estrutura do frontend

```text
tasuke-front/src/
├── api/                   # Cliente Axios + interceptor de token
├── components/
│   ├── common/            # Logo, PageHeader, EmptyState, Loading, Error, Pagination...
│   ├── layout/            # Sidebar, Header, Footer, MainLayout, AuthLayout, UserMenu
│   ├── tickets/           # CreateTicketDialog
│   ├── users/             # UserFormDialog
│   └── ui/                # shadcn/ui
├── context/               # AuthProvider / AuthContext
├── hooks/                 # useAuth + hooks de TanStack Query
├── lib/                   # utils, meta (status/prioridade/perfil), format, errors
├── pages/                 # auth, dashboard, errors, profile, settings, tickets, users
├── routes/                # Router + rotas protegidas
├── services/              # auth, ticket, comment, user
└── types/                 # tipos da API
```

---

## 🎨 Identidade visual

- **Fundo**: Obsidian `#09090B`
- **Primária**: Ciano elétrico `#00E5FF`
- **Secundária**: Roxo `#8B5CF6`
- Tipografia **Geist**; proporção visual ~90% neutro / 8% ciano / 2% roxo.
- Símbolo próprio inspirado em *kamon* japoneses (conexão e suporte).

---

## 🐳 Docker

```bash
# Sobe o PostgreSQL
docker compose up -d

# Remove o container do banco (com dados)
docker compose down -v
```

---

## 📄 Licença

Este projeto está sob a licença **MIT**.
