// Script para testar login via console do navegador
// Cole este código no console do navegador na página de login

// Aguardar a página carregar completamente
setTimeout(() => {
  console.log('🧪 Iniciando teste de login...');
  
  // Verificar se os campos existem
  const emailField = document.getElementById('email');
  const senhaField = document.getElementById('senha');
  const submitButton = document.querySelector('button[type="submit"]');
  
  if (!emailField || !senhaField || !submitButton) {
    console.error('❌ Campos do formulário não encontrados');
    console.log('Email field:', emailField);
    console.log('Senha field:', senhaField);
    console.log('Submit button:', submitButton);
    return;
  }
  
  console.log('✅ Campos encontrados, preenchendo...');
  
  // Simular preenchimento do formulário
  emailField.value = 'admin@clinicademo.com';
  senhaField.value = '123456';
  
  // Disparar eventos de mudança
  emailField.dispatchEvent(new Event('input', { bubbles: true }));
  senhaField.dispatchEvent(new Event('input', { bubbles: true }));
  
  console.log('📝 Formulário preenchido, clicando no botão...');
  
  // Simular clique no botão de login
  submitButton.click();
  
  console.log('🚀 Login simulado executado!');
}, 1000);