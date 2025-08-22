# PRD – PetGet (SaaS multiempresa)

## Objetivo
Sistema SaaS para pet shops, clínicas e profissionais, com gestão de clientes, pets, agenda, vendas, estoque e financeiro.

## Módulos (detalhes)
### 1) Empresas & Multitenancy
- Tabelas: empresas, usuarios, perfis; `tenant_id` obrigatório.
- Regras: cada request deve carregar `X-Tenant-Id`.
- Telas: cadastro empresa, gestão de usuários.

### 2) Autenticação & Usuários
- Login JWT, refresh token, política de senha.
- Perfis: ADMIN_EMPRESA, VETERINARIO, ATENDENTE, FINANCEIRO.
- Telas: login, recuperar senha, perfil.

### 3) Clientes
- Campos: nome, CPF/CNPJ, e-mail, telefones, endereço (ViaCEP), observações.
- Telas: lista, cadastro/edição, detalhes (com pets).

### 4) Pets
- Campos: nome, espécie, raça, sexo, idade, peso, foto.
- Telas: lista, cadastro/edição, detalhe do pet.

### 5) Prontuário
- Itens: consultas, vacinas, prescrições, exames (upload), anotações.
- Telas: timeline do pet, criação de registro, impressão/compartilhar PDF.

### 6) Agenda & Serviços
- Tipos: consulta, banho/tosa, vacina, cirurgia.
- Funcionalidades: horários, confirmação, reagendamento, lembretes WhatsApp/e‑mail.
- Telas: calendário (dia/semana/mês), fila, check‑in/check‑out.

### 7) Produtos & Estoque
- Produtos com SKU, preço, custo, categoria, unidade.
- Movimentações: entrada, saída, ajuste; alerta de baixo estoque.
- Telas: catálogo, inventário, movimentos.

### 8) Vendas & Faturamento
- Itens: produtos/serviços, descontos, impostos simples (futuro).
- Emissão de faturas; integração **Asaas** (PIX, cartão, boleto).
- Telas: PDV simples, carrinho, faturas.

### 9) Financeiro
- Contas a receber/pagar, conciliação por **webhooks Asaas**.
- Relatórios: fluxo de caixa, recebimentos, inadimplência.
- Telas: listagens, filtros, detalhes da fatura.

### 10) Relatórios & Dashboards
- KPIs: faturamento por período, serviços top, pets atendidos, estoque (giro).
- Gráficos (Recharts) e exportação CSV.

## Integrações
- ViaCEP: GET `/{cep}/json`.
- Asaas: clientes, cobranças, webhooks (pago, vencido, estornado).
- WhatsApp API (Meta Cloud ou provedor) para lembretes/links de pagamento.

## Não-funcionais
- Java 21, Spring Boot 3.3.x; Next.js + Tailwind + shadcn/ui.
- PostgreSQL 15; Flyway; testes (JUnit/Playwright).
- Docker compose local; Swagger; JWT; CORS.
