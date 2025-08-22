# API Endpoints - PetGet

## Autenticação
- `POST /auth/login` → login do usuário
- `POST /auth/register` → cadastro de usuário
- `POST /auth/refresh` → renovação de token

## Clientes
- `GET /clients` → listar clientes
- `POST /clients` → criar cliente
- `GET /clients/{id}` → buscar cliente
- `PUT /clients/{id}` → atualizar cliente
- `DELETE /clients/{id}` → remover cliente

## Pets
- `GET /pets` → listar pets
- `POST /pets` → criar pet
- `GET /pets/{id}` → buscar pet
- `PUT /pets/{id}` → atualizar pet
- `DELETE /pets/{id}` → remover pet

## Agenda
- `GET /appointments` → listar agendamentos
- `POST /appointments` → criar agendamento
- `PUT /appointments/{id}/status` → alterar status (pendente, concluído, cancelado)

## Produtos
- `GET /products` → listar produtos
- `POST /products` → criar produto
- `PUT /products/{id}` → atualizar produto
- `DELETE /products/{id}` → remover produto

## Financeiro
- `GET /finance/invoices` → listar faturas
- `POST /finance/invoices` → criar fatura
- `GET /finance/cashflow` → fluxo de caixa

## Integrações
- `GET /integrations/viacep/{cep}` → buscar endereço
- `POST /integrations/asaas/payment` → gerar pagamento
- `POST /integrations/whatsapp/send` → enviar mensagem
