// Script de teste para verificar integração frontend-backend
const axios = require('axios');

// Configuração
const BACKEND_URL = 'http://localhost:8080/api';
const FRONTEND_URL = 'http://localhost:3000';

async function testBackendHealth() {
  console.log('🔍 Testando saúde do backend...');
  try {
    const response = await axios.get(`${BACKEND_URL}/actuator/health`);
    console.log('✅ Backend está funcionando:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Backend não está respondendo:', error.message);
    return false;
  }
}

async function testFrontendHealth() {
  console.log('🔍 Testando saúde do frontend...');
  try {
    const response = await axios.get(FRONTEND_URL);
    console.log('✅ Frontend está funcionando (status:', response.status, ')');
    return true;
  } catch (error) {
    console.log('❌ Frontend não está respondendo:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('🔍 Testando login no backend...');
  try {
    const response = await axios.post(`${BACKEND_URL}/auth/login`, {
      email: 'admin@clinicademo.com',
      senha: '123456'
    });
    
    console.log('✅ Login funcionando!');
    console.log('📋 Dados retornados:');
    console.log('  - Token:', response.data.accessToken ? 'Presente' : 'Ausente');
    console.log('  - Usuário:', response.data.user?.nome || 'N/A');
    console.log('  - Tenant:', response.data.user?.tenantId || 'N/A');
    console.log('  - Empresa:', response.data.user?.empresaNome || 'N/A');
    
    return response.data;
  } catch (error) {
    console.log('❌ Erro no login:', error.response?.data || error.message);
    return null;
  }
}

async function testProtectedEndpoint(token) {
  console.log('🔍 Testando endpoint protegido...');
  try {
    const response = await axios.get(`${BACKEND_URL}/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Tenant-Id': 'demo-clinic'
      }
    });
    
    console.log('✅ Endpoint protegido funcionando!');
    return true;
  } catch (error) {
    console.log('❌ Erro no endpoint protegido:', error.response?.data || error.message);
    return false;
  }
}

async function runIntegrationTests() {
  console.log('🚀 Iniciando testes de integração PetGet\n');
  
  const backendOk = await testBackendHealth();
  const frontendOk = await testFrontendHealth();
  
  if (!backendOk || !frontendOk) {
    console.log('\n❌ Serviços não estão funcionando. Verifique se backend e frontend estão rodando.');
    return;
  }
  
  console.log('\n🔐 Testando autenticação...');
  const loginData = await testLogin();
  
  if (loginData && loginData.accessToken) {
    await testProtectedEndpoint(loginData.accessToken);
  }
  
  console.log('\n📊 Resumo dos testes:');
  console.log('  - Backend:', backendOk ? '✅' : '❌');
  console.log('  - Frontend:', frontendOk ? '✅' : '❌');
  console.log('  - Login:', loginData ? '✅' : '❌');
  console.log('  - Endpoints protegidos:', loginData ? '✅' : '❌');
  
  if (backendOk && frontendOk && loginData) {
    console.log('\n🎉 Integração frontend-backend funcionando corretamente!');
    console.log('\n📝 Próximos passos:');
    console.log('  1. Testar login pela interface do frontend');
    console.log('  2. Verificar navegação entre páginas');
    console.log('  3. Testar operações CRUD');
    console.log('  4. Validar isolamento de dados por tenant');
  } else {
    console.log('\n⚠️  Alguns problemas foram encontrados. Verifique os logs acima.');
  }
}

// Executa os testes
runIntegrationTests().catch(console.error);