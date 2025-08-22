-- Migração para adicionar dados do tenant petshop-abc
-- Criado para resolver conflito de tenant entre demo-clinic e petshop-abc

-- 1. Inserir empresa PetShop ABC
INSERT INTO empresas (nome, cnpj, email, telefone, endereco, cidade, estado, cep, ativo, tenant_id)
VALUES (
    'PetShop ABC Ltda',
    '98.765.432/0001-10',
    'contato@petshop-abc.com',
    '(11) 3333-4444',
    'Rua das Flores, 123',
    'São Paulo',
    'SP',
    '01234-567',
    true,
    'petshop-abc'
);

-- 2. Inserir usuários para o tenant petshop-abc
-- Administrador da empresa
INSERT INTO usuarios (nome, email, senha, perfil, ativo, empresa_id, tenant_id, telefone)
VALUES (
    'João Silva',
    'admin@petshop.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', -- 123456
    'ADMIN_EMPRESA',
    true,
    (SELECT id FROM empresas WHERE tenant_id = 'petshop-abc'),
    'petshop-abc',
    '(11) 99999-1001'
);

-- Atendente
INSERT INTO usuarios (nome, email, senha, perfil, ativo, empresa_id, tenant_id, telefone)
VALUES (
    'Maria Oliveira',
    'atendente@petshop.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', -- 123456
    'ATENDENTE',
    true,
    (SELECT id FROM empresas WHERE tenant_id = 'petshop-abc'),
    'petshop-abc',
    '(11) 99999-1002'
);

-- Financeiro
INSERT INTO usuarios (nome, email, senha, perfil, ativo, empresa_id, tenant_id, telefone)
VALUES (
    'Carlos Santos',
    'financeiro@petshop.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', -- 123456
    'FINANCEIRO',
    true,
    (SELECT id FROM empresas WHERE tenant_id = 'petshop-abc'),
    'petshop-abc',
    '(11) 99999-1003'
);

-- 3. Inserir alguns clientes de exemplo para o petshop
INSERT INTO clientes (nome, email, telefone, cpf_cnpj, endereco, cidade, estado, cep, tenant_id)
VALUES 
    ('Ana Paula Costa', 'ana@email.com', '(11) 98765-4321', '123.456.789-01', 'Rua A, 100', 'São Paulo', 'SP', '01000-000', 'petshop-abc'),
    ('Roberto Lima', 'roberto@email.com', '(11) 98765-4322', '234.567.890-12', 'Rua B, 200', 'São Paulo', 'SP', '01000-001', 'petshop-abc'),
    ('Fernanda Silva', 'fernanda@email.com', '(11) 98765-4323', '345.678.901-23', 'Rua C, 300', 'São Paulo', 'SP', '01000-002', 'petshop-abc');

-- 4. Inserir alguns pets de exemplo
INSERT INTO pets (nome, especie, raca, data_nascimento, peso, cliente_id, tenant_id)
VALUES 
    ('Rex', 'CACHORRO', 'Labrador', '2021-01-15', 25.5, (SELECT id FROM clientes WHERE email = 'ana@email.com' AND tenant_id = 'petshop-abc'), 'petshop-abc'),
    ('Mimi', 'GATO', 'Persa', '2022-03-10', 4.2, (SELECT id FROM clientes WHERE email = 'roberto@email.com' AND tenant_id = 'petshop-abc'), 'petshop-abc'),
    ('Thor', 'CACHORRO', 'Golden Retriever', '2019-06-20', 30.0, (SELECT id FROM clientes WHERE email = 'fernanda@email.com' AND tenant_id = 'petshop-abc'), 'petshop-abc');

-- 5. Inserir alguns produtos de exemplo
INSERT INTO produtos (nome, descricao, categoria, preco, estoque_atual, estoque_minimo, ativo, tenant_id)
VALUES 
    ('Ração Premium Cães', 'Ração super premium para cães adultos', 'RACAO', 89.90, 50, 10, true, 'petshop-abc'),
    ('Ração Premium Gatos', 'Ração super premium para gatos adultos', 'RACAO', 79.90, 30, 5, true, 'petshop-abc'),
    ('Shampoo Pet', 'Shampoo neutro para pets', 'HIGIENE', 25.90, 20, 5, true, 'petshop-abc'),
    ('Brinquedo Corda', 'Brinquedo de corda para cães', 'BRINQUEDO', 15.90, 15, 3, true, 'petshop-abc'),
    ('Coleira Ajustável', 'Coleira ajustável para cães pequenos e médios', 'ACESSORIO', 35.90, 25, 5, true, 'petshop-abc');