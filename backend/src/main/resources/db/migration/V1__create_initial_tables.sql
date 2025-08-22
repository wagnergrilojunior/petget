-- Migração inicial do banco de dados PetGet
-- Criação das tabelas principais do sistema

-- Tabela de empresas (tenants)
CREATE TABLE empresas (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    email VARCHAR(100),
    telefone VARCHAR(20),
    endereco VARCHAR(100),
    cidade VARCHAR(50),
    estado VARCHAR(2),
    cep VARCHAR(10),
    tenant_id VARCHAR(50) NOT NULL UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT true,
    logo_url TEXT,
    observacoes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para empresas
CREATE INDEX idx_empresas_tenant_id ON empresas(tenant_id);
CREATE INDEX idx_empresas_cnpj ON empresas(cnpj);
CREATE INDEX idx_empresas_ativo ON empresas(ativo);

-- Tabela de usuários
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('ADMIN_EMPRESA', 'VETERINARIO', 'ATENDENTE', 'FINANCEIRO', 'USUARIO')),
    ativo BOOLEAN NOT NULL DEFAULT true,
    ultimo_login TIMESTAMP,
    telefone VARCHAR(20),
    foto_url TEXT,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    tenant_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para usuários
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_tenant_id ON usuarios(tenant_id);
CREATE INDEX idx_usuarios_empresa_id ON usuarios(empresa_id);
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo);
CREATE INDEX idx_usuarios_perfil ON usuarios(perfil);

-- Tabela de clientes
CREATE TABLE clientes (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf_cnpj VARCHAR(18),
    email VARCHAR(100),
    telefone VARCHAR(20),
    celular VARCHAR(20),
    endereco VARCHAR(100),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    estado VARCHAR(2),
    cep VARCHAR(10),
    observacoes TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    tenant_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para clientes
CREATE INDEX idx_clientes_tenant_id ON clientes(tenant_id);
CREATE INDEX idx_clientes_nome ON clientes(nome);
CREATE INDEX idx_clientes_cpf_cnpj ON clientes(cpf_cnpj);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_ativo ON clientes(ativo);

-- Tabela de pets
CREATE TABLE pets (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    especie VARCHAR(20) NOT NULL CHECK (especie IN ('CACHORRO', 'GATO', 'PASSARO', 'PEIXE', 'HAMSTER', 'COELHO', 'TARTARUGA', 'IGUANA', 'CHINCHILA', 'FERRET', 'OUTRO')),
    raca VARCHAR(50),
    sexo VARCHAR(10) CHECK (sexo IN ('MACHO', 'FEMEA', 'INDEFINIDO')),
    data_nascimento DATE,
    peso DECIMAL(5,2),
    cor VARCHAR(50),
    foto_url TEXT,
    observacoes TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    microchip VARCHAR(20),
    pedigree VARCHAR(50),
    cliente_id BIGINT NOT NULL REFERENCES clientes(id),
    tenant_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para pets
CREATE INDEX idx_pets_tenant_id ON pets(tenant_id);
CREATE INDEX idx_pets_cliente_id ON pets(cliente_id);
CREATE INDEX idx_pets_nome ON pets(nome);
CREATE INDEX idx_pets_especie ON pets(especie);
CREATE INDEX idx_pets_ativo ON pets(ativo);
CREATE INDEX idx_pets_microchip ON pets(microchip);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserção de dados iniciais
-- Empresa de demonstração
INSERT INTO empresas (nome, cnpj, email, telefone, tenant_id, ativo) 
VALUES ('Clínica Veterinária Demo', '12.345.678/0001-90', 'contato@clinicademo.com', '(11) 99999-9999', 'demo-clinic', true);

-- Usuários de teste com diferentes perfis
-- Senha padrão para todos: 123456 (hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.)

-- 1. Administrador da empresa
INSERT INTO usuarios (nome, email, senha, perfil, ativo, empresa_id, tenant_id, telefone)
VALUES (
    'Dr. Carlos Silva', 
    'admin@clinicademo.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', -- 123456
    'ADMIN_EMPRESA', 
    true, 
    1, 
    'demo-clinic',
    '(11) 99999-0001'
);

-- 2. Veterinário
INSERT INTO usuarios (nome, email, senha, perfil, ativo, empresa_id, tenant_id, telefone)
VALUES (
    'Dra. Maria Santos', 
    'veterinario@clinicademo.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', -- 123456
    'VETERINARIO', 
    true, 
    1, 
    'demo-clinic',
    '(11) 99999-0002'
);

-- 3. Atendente
INSERT INTO usuarios (nome, email, senha, perfil, ativo, empresa_id, tenant_id, telefone)
VALUES (
    'Ana Costa', 
    'atendente@clinicademo.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', -- 123456
    'ATENDENTE', 
    true, 
    1, 
    'demo-clinic',
    '(11) 99999-0003'
);

-- 4. Financeiro
INSERT INTO usuarios (nome, email, senha, perfil, ativo, empresa_id, tenant_id, telefone)
VALUES (
    'Roberto Oliveira', 
    'financeiro@clinicademo.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', -- 123456
    'FINANCEIRO', 
    true, 
    1, 
    'demo-clinic',
    '(11) 99999-0004'
);

-- 5. Usuário comum
INSERT INTO usuarios (nome, email, senha, perfil, ativo, empresa_id, tenant_id, telefone)
VALUES (
    'Pedro Almeida', 
    'usuario@clinicademo.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', -- 123456
    'USUARIO', 
    true, 
    1, 
    'demo-clinic',
    '(11) 99999-0005'
);

-- Cliente de exemplo
INSERT INTO clientes (nome, email, telefone, cidade, estado, tenant_id)
VALUES ('João Silva', 'joao@email.com', '(11) 98765-4321', 'São Paulo', 'SP', 'demo-clinic');

-- Pet de exemplo
INSERT INTO pets (nome, especie, raca, sexo, cliente_id, tenant_id)
VALUES ('Rex', 'CACHORRO', 'Labrador', 'MACHO', 1, 'demo-clinic');