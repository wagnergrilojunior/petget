# Usuários de Teste - PetGet

Este documento contém os usuários de teste criados no sistema para facilitar o desenvolvimento e testes da aplicação.

## Informações Gerais

- **Empresa**: Clínica Veterinária Demo
- **Tenant ID**: `demo-clinic`
- **Senha padrão**: `123456` (para todos os usuários)
- **URL de acesso**: http://localhost:3000/login

## Usuários Disponíveis

| Nome | Email | Senha | Perfil | Descrição | Telefone |
|------|-------|-------|--------|-----------|----------|
| Dr. Carlos Silva | `admin@clinicademo.com` | `123456` | **ADMIN_EMPRESA** | Administrador principal da clínica com acesso total ao sistema | (11) 99999-0001 |
| Dra. Maria Santos | `veterinario@clinicademo.com` | `123456` | **VETERINARIO** | Veterinária responsável por consultas, cirurgias e prontuários médicos | (11) 99999-0002 |
| Ana Costa | `atendente@clinicademo.com` | `123456` | **ATENDENTE** | Atendente responsável por agendamentos, recepção e cadastro de clientes | (11) 99999-0003 |
| Roberto Oliveira | `financeiro@clinicademo.com` | `123456` | **FINANCEIRO** | Responsável pelo controle financeiro, faturamento e contas a pagar/receber | (11) 99999-0004 |
| Pedro Almeida | `usuario@clinicademo.com` | `123456` | **USUARIO** | Usuário com permissões básicas para visualização e operações limitadas | (11) 99999-0005 |

## Permissões por Perfil

### 🔴 ADMIN_EMPRESA
- **Acesso total** ao sistema
- Gerenciamento de usuários e configurações da empresa
- Relatórios completos e configurações avançadas
- Controle de permissões e configurações de sistema

### 🟢 VETERINARIO
- Acesso completo aos **prontuários médicos**
- Criação e edição de **consultas, vacinas e prescrições**
- Visualização de **agenda** e agendamentos
- Acesso aos dados de **clientes e pets**

### 🟡 ATENDENTE
- Gerenciamento de **clientes e pets**
- Controle da **agenda** e agendamentos
- Acesso ao **check-in/check-out**
- Visualização básica de relatórios

### 🟠 FINANCEIRO
- Acesso completo ao módulo **financeiro**
- Gerenciamento de **faturas e pagamentos**
- Relatórios de **fluxo de caixa**
- Controle de **contas a pagar/receber**

### 🔵 USUARIO
- Acesso **somente leitura** na maioria dos módulos
- Visualização de **clientes e pets**
- Consulta de **agenda** (sem edição)
- Relatórios básicos

## Como Testar

1. **Acesse**: http://localhost:3000/login
2. **Escolha um usuário** da tabela acima
3. **Digite o email** e a senha `123456`
4. **Explore** as funcionalidades disponíveis para cada perfil

## Dados de Exemplo

O sistema também inclui dados de exemplo:

- **Cliente**: João Silva (joao@email.com)
- **Pet**: Rex (Labrador, Macho)
- **Empresa**: Clínica Veterinária Demo

## Observações

- ⚠️ **Atenção**: Estes usuários são apenas para **desenvolvimento e testes**
- 🔒 **Segurança**: Em produção, sempre altere as senhas padrão
- 🗄️ **Banco**: Os dados são criados automaticamente via migration do Flyway
- 🔄 **Reset**: Para resetar os dados, execute `docker-compose down -v` e `docker-compose up -d`

---

**Última atualização**: $(date)
**Versão do sistema**: 1.0.0-SNAPSHOT