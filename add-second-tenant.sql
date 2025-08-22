-- Script para adicionar um segundo tenant para teste de isolamento

-- Segunda empresa (tenant)
INSERT INTO empresas (nome, cnpj, email, telefone, tenant_id, ativo) 
VALUES ('Pet Shop Teste', '98.765.432/0001-10', 'contato@petshopteste.com', '(11) 88888-8888', 'petshop-teste', true);

-- Usuário administrador para o segundo tenant
-- Senha: 123456 (hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.)
INSERT INTO usuarios (nome, email, senha, perfil, ativo, empresa_id, tenant_id, telefone)
VALUES (
    'Dr. Ana Pereira', 
    'admin@petshopteste.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', -- 123456
    'ADMIN_EMPRESA', 
    true, 
    (SELECT id FROM empresas WHERE tenant_id = 'petshop-teste'), 
    'petshop-teste',
    '(11) 88888-0001'
);

-- Cliente de exemplo para o segundo tenant
INSERT INTO clientes (nome, email, telefone, cidade, estado, tenant_id)
VALUES ('Carlos Oliveira', 'carlos@email.com', '(11) 87654-3210', 'Rio de Janeiro', 'RJ', 'petshop-teste');

-- Pet de exemplo para o segundo tenant
INSERT INTO pets (nome, especie, raca, sexo, cliente_id, tenant_id)
VALUES ('Luna', 'GATO', 'Persa', 'FEMEA', (SELECT id FROM clientes WHERE tenant_id = 'petshop-teste' LIMIT 1), 'petshop-teste');