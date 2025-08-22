# Arquitetura do Sistema - PetGet

## Visão Geral
O **PetGet** será um sistema SaaS multi-tenant, composto por:
- **Backend**: Java 21 + Spring Boot 3.3.x
- **Frontend**: Next.js 14 (App Router) + Tailwind + shadcn/ui
- **Banco de Dados**: PostgreSQL
- **Infra**: Docker, Docker Compose, Nginx, CI/CD com Drone/GitLab

## Componentes Principais
- **API Gateway** (Nginx)
- **Backend** (API REST com autenticação JWT)
- **Banco de Dados PostgreSQL**
- **Frontend Next.js**
- **Serviços externos** (Asaas, WhatsApp API, ViaCEP)

## Arquitetura em Camadas - Backend
- **Controller** → Endpoints REST.
- **Service** → Regras de negócio.
- **Repository** → Acesso ao banco via Spring Data JPA.
- **DTOs** → `Request` e `Response` para comunicação.
- **Entities** → Mapeamento das tabelas no PostgreSQL.

## Multi-tenancy
- Cada tenant terá chave única (tenant_id).
- Dados segregados via **filtro JPA/Hibernate**.
- Usuário sempre vinculado ao tenant.

## Autenticação
- **Spring Security** + JWT.
- Refresh token e expiração configurável.
- Permissões baseadas em roles (`ROLE_ADMIN`, `ROLE_USER`, etc.).

## Infraestrutura
- **Docker Compose** para subir:
  - PostgreSQL
  - Backend
  - Frontend
  - Nginx (reverse proxy)

## Monitoramento e Logs
- Logs estruturados em JSON.
- Suporte futuro para integração com ELK Stack ou Grafana Loki.
