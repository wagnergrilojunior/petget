// Teste direto com fetch para verificar CORS e conectividade
// Cole este código no console do navegador

console.log('🧪 Testando fetch direto para o backend...');

fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@clinicademo.com',
    senha: '123456'
  })
})
.then(response => {
  console.log('✅ Resposta recebida:', response.status, response.statusText);
  console.log('📋 Headers:', [...response.headers.entries()]);
  return response.json();
})
.then(data => {
  console.log('📦 Dados:', data);
})
.catch(error => {
  console.error('❌ Erro:', error);
  console.error('❌ Tipo do erro:', error.name);
  console.error('❌ Mensagem:', error.message);
});