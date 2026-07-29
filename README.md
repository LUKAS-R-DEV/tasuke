<p align="center">
  <img src="https://img.shields.io/badge/Java-21-%23ED8B00?logo=openjdk&logoColor=white" alt="Java 21">
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1.0-%236DB33F?logo=springboot&logoColor=white" alt="Spring Boot 4.1.0">
  <img src="https://img.shields.io/badge/PostgreSQL-16-%234169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 16">
  <img src="https://img.shields.io/badge/Flyway-11-%23CC0200?logo=flyway&logoColor=white" alt="Flyway">
  <img src="https://img.shields.io/badge/License-MIT-%23FF5733" alt="License">
  <br>
  <img src="https://img.shields.io/github/actions/workflow/status/LUKAS-R-DEV/tasuke/ci.yml?branch=main&label=build" alt="Build">
  <img src="https://img.shields.io/github/last-commit/LUKAS-R-DEV/tasuke" alt="Last Commit">
</p>

<p align="center">
  <h1 align="center">⚡ Tasuke</h1>
  <p align="center">
    <em>RESTful user management API — robust, modern, and ready to scale.</em>
    <br>
    Built with <strong>Spring Boot 4.1</strong> and <strong>Java 21</strong>.
  </p>
</p>

---

## 📋 Índice

- [Sobre](#-sobre)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Começando](#-começando)
- [API](#-api)
- [Estrutura](#-estrutura)
- [Docker](#-docker)
- [Licença](#-licença)

---

## 💡 Sobre

**Tasuke** (助け — "ajuda" em japonês) é uma API REST desenvolvida para gerenciamento de usuários com suporte a papéis (roles), ativação/desativação de contas e validação de dados. Projetada com arquitetura limpa e pronta para ser estendida.

---

## 🛠 Tecnologias

| Categoria | Tecnologia |
|-----------|-----------|
| **Linguagem** | Java 21 |
| **Framework** | Spring Boot 4.1.0 |
| **ORM** | Spring Data JPA / Hibernate |
| **Database** | PostgreSQL 16 |
| **Migração** | Flyway |
| **Mapper** | MapStruct 1.6 |
| **Build** | Maven Wrapper |
| **Container** | Docker / Docker Compose |
| **Validação** | Jakarta Bean Validation |

---

## ✨ Funcionalidades

- **CRUD completo** de usuários
- **Papéis** — `ADMIN`, `AGENT`, `CUSTOMER`
- **Ativação/Desativação** de contas
- **Validação** de dados com mensagens claras
- **Tratamento global** de exceções
- **Respostas padronizadas** (`ApiResponse<T>`)
- **Migração automática** do banco com Flyway

---

## 🚀 Começando

### Pré-requisitos

- Java 21+
- Docker & Docker Compose

### Setup

```bash
# 1. Suba o banco PostgreSQL
docker compose up -d

# 2. Execute a aplicação
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`.

---

## 📡 API

### Users

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/users` | Lista todos os usuários ativos |
| `GET` | `/users/{id}` | Busca usuário por ID |
| `POST` | `/users` | Cria um novo usuário |
| `PATCH` | `/users/update/{id}` | Atualiza dados do usuário |
| `PATCH` | `/users/deactivate/{id}` | Desativa um usuário |
| `PATCH` | `/users/activate/{id}` | Ativa um usuário |

### Exemplo de criação

```json
POST /users
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456",
  "role": "AGENT"
}
```

### Respostas padronizadas

```json
{
  "statusResponse": "SUCCESS",
  "message": "Usuário criado com sucesso.",
  "data": { ... },
  "timestamp": "2026-07-29T00:37:11.123Z"
}
```

---

## 📁 Estrutura

```
src/
└── main/java/com/lukas_r_dev/tasuke/
    ├── shared/
    │   ├── exceptions/        # Exceções + handler global
    │   └── response/          # Respostas padronizadas
    └── users/
        ├── controller/        # Endpoints REST
        ├── domain/            # Entidade + enum Role
        ├── dtos/              # Request/Response records
        ├── mapper/            # MapStruct mapper
        ├── repository/        # Spring Data JPA
        └── service/           # Regras de negócio
```

---

## 🐳 Docker

```bash
docker compose up -d
```

Remove o container do banco:

```bash
docker compose down -v
```

---

## 📄 Licença

Este projeto está sob a licença **MIT**.

---

<p align="center">
  Feito com ☕ por <a href="https://github.com/LUKAS-R-DEV">LUKAS-R-DEV</a>
</p>
