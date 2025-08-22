'use client';

import { useState } from 'react';
import { AuthService } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestLoginPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testLogin = async () => {
    setLoading(true);
    setResult('🔄 Testando login...');
    
    try {
      console.log('🧪 Iniciando teste de login direto');
      console.log('🔧 API_BASE_URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('🔧 Window location:', window.location.href);
      
      const response = await AuthService.login({
        email: 'admin@clinicademo.com',
        senha: '123456'
      });
      
      console.log('✅ Login bem-sucedido:', response);
      setResult(`✅ Login bem-sucedido!\nToken: ${response.accessToken ? 'Recebido' : 'Não recebido'}\nUsuário: ${response.user?.nome || 'Não encontrado'}`);
      
    } catch (error) {
      console.error('❌ Erro no login:', error);
      console.error('❌ Erro completo:', JSON.stringify(error, null, 2));
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setResult(`❌ Erro no login: ${errorMessage}\n\nDetalhes: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testFetchDirect = async () => {
    setLoading(true);
    setResult('🔄 Testando fetch direto...');
    
    try {
      console.log('🧪 Iniciando teste de fetch direto');
      console.log('🔧 URL de destino:', 'http://localhost:8080/api/auth/login');
      console.log('🔧 Origem:', window.location.origin);
      
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@clinicademo.com',
          senha: '123456'
        })
      });
      
      console.log('📊 Status:', response.status);
      console.log('📊 Status Text:', response.statusText);
      console.log('📊 URL:', response.url);
      console.log('📋 Headers:', [...response.headers.entries()]);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Sucesso:', data);
        setResult(`✅ Fetch direto bem-sucedido!\nStatus: ${response.status}\nURL: ${response.url}\nToken: ${data.accessToken ? 'Recebido' : 'Não recebido'}\nUsuário: ${data.user?.nome || 'Não encontrado'}`);
      } else {
        const errorData = await response.text();
        console.error('❌ Erro:', response.status, errorData);
        setResult(`❌ Erro no fetch direto\nStatus: ${response.status}\nURL: ${response.url}\nErro: ${errorData}`);
      }
    } catch (error) {
      console.error('💥 Erro de rede:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setResult(`💥 Erro de conectividade: ${errorMessage}\n\nDetalhes: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Teste de Login</CardTitle>
          <CardDescription>
            Página para testar a conectividade entre frontend e backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <strong>Env:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Não definido'}
            </div>
            <div className="text-sm text-gray-600">
              <strong>Origem:</strong> {typeof window !== 'undefined' ? window.location.origin : 'SSR'}
            </div>
          </div>
          
          <Button 
            onClick={testLogin} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Testando...' : 'Testar AuthService.login()'}
          </Button>
          
          <Button 
            onClick={testFetchDirect} 
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? 'Testando...' : 'Testar fetch() direto'}
          </Button>
          
          {result && (
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <pre className="text-sm whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}