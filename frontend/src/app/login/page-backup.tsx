'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthService } from '@/services/auth';
import { Heart, Mail, Lock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !senha) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      await AuthService.login({ email, senha });
      router.push('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card de login centralizado */}
        <Card className="w-full max-w-md p-8 shadow-2xl border-0 bg-white rounded-3xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-6">Login</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Nome de usuário
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Digite seu nome de usuário"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-14 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-700"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha" className="text-sm font-medium text-gray-700">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="senha"
                      type="password"
                      placeholder="Digite sua senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="pl-10 h-14 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-700"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => alert('Funcionalidade em desenvolvimento')}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    type="button"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              </div>
              
              {/* Mensagem de erro */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white font-bold text-lg rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>ENTRANDO...</span>
                  </div>
                ) : (
                  'ENTRAR'
                )}
              </Button>
            </form>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Ou cadastre-se usando</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-12 h-12 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold"
                >
                  f
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-12 h-12 rounded-full border-2 border-blue-400 text-blue-400 hover:bg-blue-50 font-bold"
                >
                  t
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-12 h-12 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50 font-bold"
                >
                  G
                </Button>
              </div>

              <div className="mt-6 text-center">
                <span className="text-sm text-gray-500">Ou cadastre-se usando</span>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold rounded-xl"
                onClick={() => alert('Funcionalidade em desenvolvimento')}
              >
                CADASTRAR
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}