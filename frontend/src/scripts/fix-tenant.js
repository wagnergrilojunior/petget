// Script para corrigir problema de tenant
// Execute no console do navegador em http://localhost:3000

console.log('=== DIAGNÓSTICO DO PROBLEMA DE TENANT ===');

// 1. Verificar localStorage atual
console.log('\n1. Dados atuais no localStorage:');
const userInfo = localStorage.getItem('userInfo');
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

console.log('userInfo:', userInfo);
console.log('accessToken:', accessToken);
console.log('refreshToken:', refreshToken);

// 2. Decodificar token JWT se existir
if (accessToken) {
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    console.log('\n2. Payload do JWT:');
    console.log('tenantId no token:', payload.tenantId);
    console.log('username:', payload.sub);
    console.log('exp:', new Date(payload.exp * 1000));
  } catch (e) {
    console.error('Erro ao decodificar token:', e);
  }
}

// 3. Verificar userInfo
if (userInfo) {
  try {
    const user = JSON.parse(userInfo);
    console.log('\n3. Dados do usuário:');
    console.log('tenantId no userInfo:', user.tenantId);
    console.log('email:', user.email);
  } catch (e) {
    console.error('Erro ao parsear userInfo:', e);
  }
}

// 4. Limpar tudo e forçar novo login
console.log('\n4. Limpando localStorage...');
localStorage.removeItem('userInfo');
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
localStorage.clear();

console.log('✅ localStorage limpo!');
console.log('\n5. Redirecionando para login...');

// Redirecionar para login
if (typeof window !== 'undefined') {
  window.location.href = '/login';
}

console.log('=== SCRIPT CONCLUÍDO ===');
console.log('Agora faça login novamente com as credenciais corretas.');