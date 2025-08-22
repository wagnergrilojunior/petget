# API Endpoints – PetGet

## Autenticação & Usuários
- `POST /auth/login` – autenticação com JWT
- `POST /auth/refresh` – refresh token
- `POST /auth/register` – criação de usuário
- `GET /users` – listar usuários
- `GET /users/{id}` – detalhes
- `PUT /users/{id}` – atualizar
- `DELETE /users/{id}` – remover

## Empresas
- `POST /companies` – criar empresa
- `GET /companies` – listar
- `GET /companies/{id}` – detalhes
- `PUT /companies/{id}` – atualizar
- `DELETE /companies/{id}` – excluir

## Clientes
- `POST /clients` – criar cliente
- `GET /clients` – listar clientes
- `GET /clients/{id}` – detalhes
- `PUT /clients/{id}` – atualizar
- `DELETE /clients/{id}` – excluir

## Pets
- `POST /pets` – criar pet
- `GET /pets` – listar pets
- `GET /pets/{id}` – detalhes
- `PUT /pets/{id}` – atualizar
- `DELETE /pets/{id}` – excluir

## Prontuário
- `POST /records/{petId}` – adicionar registro
- `GET /records/{petId}` – listar registros do pet
- `GET /records/{recordId}` – detalhes do registro
- `DELETE /records/{recordId}` – excluir registro

## Agenda & Serviços
- `POST /appointments` – criar agendamento
- `GET /appointments` – listar agendamentos
- `PUT /appointments/{id}` – atualizar agendamento
- `DELETE /appointments/{id}` – cancelar agendamento

## Produtos & Estoque
- `POST /products` – criar produto
- `GET /products` – listar produtos
- `PUT /products/{id}` – atualizar produto
- `DELETE /products/{id}` – excluir produto
- `POST /inventory/movements` – lançar movimentação de estoque
- `GET /inventory/movements` – listar movimentações

## Vendas & Faturamento
- `POST /sales` – registrar venda
- `GET /sales` – listar vendas
- `GET /sales/{id}` – detalhes da venda
- `POST /invoices` – emitir fatura (Asaas)
- `GET /invoices` – listar faturas

## Financeiro
- `POST /financial/payables` – criar conta a pagar
- `POST /financial/receivables` – criar conta a receber
- `GET /financial/payables` – listar contas a pagar
- `GET /financial/receivables` – listar contas a receber
- `POST /financial/webhooks/asaas` – receber webhook do Asaas

## Relatórios
- `GET /reports/finance` – fluxo de caixa
- `GET /reports/sales` – vendas consolidadas
- `GET /reports/stock` – giro de estoque
