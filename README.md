# TaskFlow API

![CI](https://github.com/nickdiegao/taskflow/actions/workflows/ci.yml/badge.svg)
![Node](https://img.shields.io/badge/node-20.x-brightgreen)
![NestJS](https://img.shields.io/badge/NestJS-11-red)
![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey)

API REST de gerenciamento de tarefas com autenticação JWT, notificações automáticas por e-mail e sistema de filas com Redis. Desenvolvida com foco em qualidade de código, TDD e boas práticas de engenharia de software.

---

## Tecnologias

- **Node.js** + **TypeScript** + **NestJS** — framework principal
- **PostgreSQL** — banco de dados relacional
- **Redis** + **Bull** — sistema de filas para notificações assíncronas
- **JWT** + **Passport** — autenticação e autorização
- **Nodemailer** — envio de e-mails
- **TypeORM** — ORM e modelagem de dados
- **Docker** + **Docker Compose** — containerização do ambiente
- **Jest** — testes unitários com TDD
- **Swagger** — documentação interativa da API
- **GitHub Actions** — CI/CD automatizado

---

## Funcionalidades

- Cadastro e autenticação de usuários com JWT
- CRUD completo de tarefas com prioridade e prazo
- Atualização de status das tarefas (pending, in_progress, done)
- Notificação automática por e-mail quando uma tarefa vence
- Sistema de filas assíncrono com Bull e Redis
- Endpoints protegidos por guard JWT
- Documentação interativa via Swagger

---

## Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [Docker](https://www.docker.com/)

---

## Como rodar localmente

### 1. Clone o repositório
```bash
git clone https://github.com/nickdiegao/taskflow.git
cd taskflow
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=taskflow
DATABASE_PASSWORD=taskflow123
DATABASE_NAME=taskflow

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d

MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=seu_usuario_mailtrap
MAIL_PASS=sua_senha_mailtrap
MAIL_FROM=taskflow@test.com
```

### 3. Suba o banco de dados e o Redis
```bash
docker compose up -d
```

### 4. Instale as dependências
```bash
npm install
```

### 5. Rode a aplicação
```bash
npm run start:dev
```

### 6. Acesse a documentação
```
http://localhost:3000/api
```

---

## Testes
```bash
# Rodar todos os testes
npm run test

# Rodar com cobertura
npm run test:cov

# Rodar em modo watch
npm run test:watch
```

---

## Endpoints

### Auth

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/auth/register` | Criar nova conta | ❌ |
| POST | `/auth/login` | Login e obter token JWT | ❌ |

### Tasks

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/tasks` | Criar tarefa | ✅ |
| GET | `/tasks` | Listar tarefas do usuário | ✅ |
| GET | `/tasks/:id` | Buscar tarefa por ID | ✅ |
| PUT | `/tasks/:id` | Atualizar tarefa | ✅ |
| DELETE | `/tasks/:id` | Deletar tarefa | ✅ |
| PATCH | `/tasks/:id/status` | Atualizar status | ✅ |

---

## Como usar a API

### 1. Criar conta
```bash
POST /auth/register
{
  "name": "Nicholas Diego",
  "email": "nick@email.com",
  "password": "123456"
}
```

### 2. Fazer login
```bash
POST /auth/login
{
  "email": "nick@email.com",
  "password": "123456"
}
```

Resposta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Criar tarefa
```bash
POST /tasks
Authorization: Bearer {access_token}
{
  "title": "Estudar TDD",
  "description": "Aprender TDD na prática com NestJS",
  "priority": "high",
  "dueDate": "2026-12-31T23:59:59.000Z"
}
```

---

## Estrutura do Projeto
```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── user.entity.ts
├── tasks/
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   ├── tasks.module.ts
│   ├── tasks.processor.ts
│   ├── tasks.scheduler.ts
│   └── task.entity.ts
└── app.module.ts
```

---

## CI/CD

O projeto utiliza **GitHub Actions** para rodar os testes automaticamente a cada push ou pull request na branch `main`. O workflow instala as dependências, roda os testes unitários e gera o relatório de cobertura.

---

## Autor

**Nicholas Diego**
- GitHub: [@nickdiegao](https://github.com/nickdiegao)
- LinkedIn: [linkedin.com/in/nicholas-diego](https://linkedin.com/in/nicholas-diego)