// Script para testar isolamento de dados entre tenants
const axios = require('axios');

// Configuração
const BACKEND_URL = 'http://localhost:8080/api';

// Dados de teste para diferentes tenants
const tenants = [
  {
    name: 'Clínica Demo',
    user: { email: 'admin@clinicademo.com', senha: '123456' },
    tenantId: 'demo-clinic'
  },
  {
    name: 'Pet Shop ABC',
    user: { email: 'admin@petshop.com', senha: '123456' },
    tenantId: 'petshop-abc'
  }
];

async function loginTenant(tenant) {
  console.log(`🔐 Fazendo login no tenant: ${tenant.name}`);
  try {
    const response = await axios.post(`${BACKEND_URL}/auth/login`, tenant.user);
    console.log(`✅ Login realizado com sucesso para ${tenant.name}`);
    console.log(`   - Tenant ID: ${response.data.user.tenantId}`);
    console.log(`   - Empresa: ${response.data.user.empresaNome}`);
    return {
      token: response.data.accessToken,
      tenantId: response.data.user.tenantId,
      user: response.data.user
    };
  } catch (error) {
    console.log(`❌ Erro no login para ${tenant.name}:`, error.response?.data || error.message);
    return null;
  }
}

async function createTestClient(auth, clientData) {
  console.log(`📝 Criando cliente de teste para tenant: ${auth.tenantId}`);
  try {
    const response = await axios.post(`${BACKEND_URL}/clientes`, clientData, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-Tenant-ID': auth.tenantId
      }
    });
    console.log(`✅ Cliente criado com sucesso: ${response.data.nome}`);
    return response.data;
  } catch (error) {
    console.log(`❌ Erro ao criar cliente:`, error.response?.data || error.message);
    return null;
  }
}

async function listClients(auth) {
  console.log(`📋 Listando clientes para tenant: ${auth.tenantId}`);
  try {
    const response = await axios.get(`${BACKEND_URL}/clientes`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-Tenant-ID': auth.tenantId
      }
    });
    console.log(`✅ Encontrados ${response.data.content?.length || 0} clientes`);
    return response.data.content || [];
  } catch (error) {
    console.log(`❌ Erro ao listar clientes:`, error.response?.data || error.message);
    return [];
  }
}

async function testTenantIsolation() {
  console.log('🏢 Iniciando teste de isolamento entre tenants\n');
  
  const authResults = [];
  
  // 1. Fazer login em ambos os tenants
  for (const tenant of tenants) {
    const auth = await loginTenant(tenant);
    if (auth) {
      authResults.push({ tenant, auth });
    }
    console.log('');
  }
  
  if (authResults.length < 2) {
    console.log('❌ Não foi possível fazer login em ambos os tenants. Teste cancelado.');
    return;
  }
  
  console.log('\n🧪 Testando isolamento de dados...\n');
  
  // 2. Criar clientes de teste em cada tenant
  const clientsCreated = [];
  
  for (let i = 0; i < authResults.length; i++) {
    const { tenant, auth } = authResults[i];
    
    const clientData = {
      nome: `Cliente Teste ${tenant.name}`,
      email: `cliente${i + 1}@${tenant.tenantId}.com`,
      telefone: `(11) 9999-${1000 + i}`,
      cpfCnpj: `000.000.00${i + 1}-0${i + 1}`,
      endereco: `Rua Teste ${i + 1}, ${100 + i}`,
      cidade: 'São Paulo',
      estado: 'SP',
      cep: `01000-00${i + 1}`
    };
    
    const client = await createTestClient(auth, clientData);
    if (client) {
      clientsCreated.push({ tenant, auth, client });
    }
    console.log('');
  }
  
  // 3. Verificar se cada tenant vê apenas seus próprios clientes
  console.log('\n🔍 Verificando isolamento de dados...\n');
  
  for (const { tenant, auth } of authResults) {
    const clients = await listClients(auth);
    
    console.log(`📊 Tenant ${tenant.name}:`);
    console.log(`   - Total de clientes: ${clients.length}`);
    
    // Verificar se há clientes de outros tenants
    const foreignClients = clients.filter(client => 
      client.tenantId && client.tenantId !== tenant.tenantId
    );
    
    if (foreignClients.length > 0) {
      console.log(`❌ VAZAMENTO DE DADOS! Encontrados ${foreignClients.length} clientes de outros tenants:`);
      foreignClients.forEach(client => {
        console.log(`     - ${client.nome} (${client.email})`);
      });
    } else {
      console.log(`✅ Isolamento OK - Nenhum dado de outros tenants encontrado`);
    }
    
    console.log('');
  }
  
  // 4. Tentar acessar dados de outro tenant com token diferente
  console.log('🔒 Testando tentativa de acesso cruzado entre tenants...\n');
  
  if (authResults.length >= 2) {
    const tenant1 = authResults[0];
    const tenant2 = authResults[1];
    
    console.log(`🔄 Tentando acessar dados do ${tenant2.tenant.name} com token do ${tenant1.tenant.name}`);
    
    try {
      const response = await axios.get(`${BACKEND_URL}/clientes`, {
        headers: {
          'Authorization': `Bearer ${tenant1.auth.token}`,
          'X-Tenant-ID': tenant2.auth.tenantId  // Usando tenant ID diferente do token
        }
      });
      
      console.log(`❌ FALHA DE SEGURANÇA! Acesso cruzado permitido. Dados retornados: ${response.data.content?.length || 0} clientes`);
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        console.log(`✅ Segurança OK - Acesso negado (${error.response.status})`);
      } else {
        console.log(`⚠️  Erro inesperado:`, error.response?.data || error.message);
      }
    }
  }
  
  console.log('\n📋 Teste de isolamento entre tenants concluído!');
}

// Executar teste
testTenantIsolation().catch(console.error);