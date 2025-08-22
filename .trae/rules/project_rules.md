# Project Rules - PetGet

## Linguagem
- Sempre responder em **português**.
- Gerar exemplos de código no padrão da stack definida.

## Backend
- Usar **Java 21** com **Spring Boot 3.3.x**.
- Utilizar **Spring Security** para autenticação/autorização.
- Seguir boas práticas de **REST API**.
- Usar **JPA/Hibernate** com **PostgreSQL**.
- DTOs devem terminar com `Request` e `Response`.
- Exceptions personalizadas no padrão `NotFoundException`, `ConflictException`, `InvalidParameterException`, `InternalErrorException`.
- Utilizar arquitetura em camadas: `controller`, `service`, `repository`.
- Suporte a **multi-tenancy** (multi-empresa), isolando os dados por tenant.

## Frontend
- Usar **Next.js (App Router)**.
- Estilização com **TailwindCSS** e **shadcn/ui**.
- Seguir **atomic design** (components, layouts, pages).
- Sempre usar componentes do **shadcn/ui** quando possível.
- Implementar chamadas à API backend via **fetch/axios** com autenticação JWT.
- Garantir design **responsivo** (desktop, tablet e mobile).

## Infra
- Usar **Docker** e **docker-compose** para subir serviços locais.
- Configuração de banco com volume persistente `infra_pg_data`.
- Seguir boas práticas de CI/CD (Drone ou GitLab pipelines).
- Utilizar **Nginx** como proxy reverso para frontend/backend em produção.
- Logs centralizados (padrão JSON no backend).

## Escopo Funcional - SaaS PetGet
O sistema será um **SaaS multi-empresa** para gestão de **clínicas veterinárias, pet shops e profissionais autônomos**.

### Módulos Principais
- **Clientes**
  - Cadastro completo com nome, CPF/CNPJ, telefone, e-mail, endereço.
  - Histórico de atendimentos.
  - Um cliente pode ter múltiplos pets.

- **Animais/Pets**
  - Cadastro com nome, espécie, raça, idade, peso, vacinas e histórico médico.
  - Associação a um cliente.
  - Registro de consultas, vacinas aplicadas e cirurgias.

- **Agenda/Serviços**
  - Agendamento de consultas, cirurgias, vacinas, banho e tosa, outros serviços.
  - Envio de lembretes automáticos (e-mail e WhatsApp).
  - Visualização de agenda diária, semanal e mensal.

- **Produtos/Estoque**
  - Cadastro de produtos (ração, medicamentos, acessórios, cosméticos).
  - Controle de estoque com entradas/saídas.
  - Alertas de baixo estoque.
  - Relatórios de movimentação.

- **Financeiro**
  - Contas a pagar e receber.
  - Faturamento por cliente/pet.
  - Fluxo de caixa.
  - Integração com **Asaas** para pagamentos (Pix, boleto, cartão de crédito).
  - Relatórios financeiros detalhados.

- **Comunicação**
  - Integração com **WhatsApp API** para envio de lembretes e notificações.
  - Envio de e-mails automáticos.

- **Relatórios**
  - Faturamento por período.
  - Serviços mais realizados.
  - Pets atendidos.
  - Controle de estoque.
  - Clientes ativos/inativos.

- **Integrações externas**
  - **ViaCEP** para preenchimento automático de endereço.
  - **Asaas** para meios de pagamento.
  - **WhatsApp API** para notificações.

### Regras Gerais de SaaS
- Cada empresa (clínica ou profissional) terá seu próprio **tenant**.
- Usuários sempre estarão vinculados a um **tenant**.
- Dados nunca devem vazar entre empresas.
- O sistema deve ser escalável para milhares de clientes.
- Permitir customização mínima por empresa (ex: logotipo, dados fiscais).

## Geral
- Gerar código com **comentários explicativos**.
- Seguir convenções de nomenclatura claras:
  - **camelCase** no JS/TS.
  - **PascalCase** em classes Java.
  - **snake_case** em nomes de tabelas SQL.
- Preferir **arquitetura limpa**.
- Sempre que possível, gerar **testes automatizados básicos** (unitários e E2E).
