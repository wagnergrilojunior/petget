# Project Rules - Petget

## Linguagem
- Sempre responder em **português**.
- Gerar exemplos de código no padrão da stack definida.

## Backend
- Usar **Java 21** com **Spring Boot 3.3.x**.
- Utilizar **Spring Security** para autenticação/autorização.
- Seguir boas práticas de **REST API**.
- Usar **JPA/Hibernate** com **PostgreSQL**.
- DTOs devem terminar com `Request` e `Response`.
- Exceptions personalizadas no padrão `NotFoundException`, `ConflictException`, etc.

## Frontend
- Usar **Next.js (App Router)**.
- Estilização com **TailwindCSS** e **shadcn/ui**.
- Seguir atomic design (components, layouts, pages).
- Sempre usar componentes do shadcn/ui quando possível.

## Infra
- Usar **Docker** e **docker-compose** para subir serviços locais.
- Configuração de banco com volume persistente `infra_pg_data`.
- Seguir boas práticas de CI/CD (Drone ou GitLab pipelines).

## Geral
- Gerar código com **comentários explicativos**.
- Seguir convenções de nomenclatura claras (camelCase no JS/TS, PascalCase em classes Java).
- Preferir **arquitetura limpa** (camadas: controller, service, repository).
