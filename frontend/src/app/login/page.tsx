'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthService } from '@/services/auth';
import { Heart, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationErrors {
  email?: string;
  senha?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const router = useRouter();

  // Função para validar email
  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'E-mail é obrigatório';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Formato de e-mail inválido';
    }
    return undefined;
  };

  // Função para validar senha
  const validatePassword = (senha: string): string | undefined => {
    if (!senha) {
      return 'Senha é obrigatória';
    }
    if (senha.length < 6) {
      return 'Senha deve ter no mínimo 6 caracteres';
    }
    return undefined;
  };

  // Função para validar todos os campos
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    const emailError = validateEmail(email);
    const senhaError = validatePassword(senha);
    
    if (emailError) errors.email = emailError;
    if (senhaError) errors.senha = senhaError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Função para limpar erro de um campo específico
  const clearFieldError = (field: keyof ValidationErrors) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🔥 LoginPage - handleSubmit chamado!');
    e.preventDefault();
    setError('');
    
    console.log('🔥 LoginPage - Validando formulário...');
    if (!validateForm()) {
      console.log('🔥 LoginPage - Validação falhou, parando execução');
      return;
    }
  
    console.log('🔥 LoginPage - Iniciando loading...');
    setLoading(true);
  
    try {
      console.log('🔥 LoginPage - Chamando AuthService.login...');
      const response = await AuthService.login({ email, senha });
      console.log('🔥 LoginPage - Resposta do AuthService:', response);
      
      if (response?.accessToken) {
        console.log('🔥 LoginPage - Token recebido, redirecionando...');
        router.push('/dashboard');
        router.refresh();
      } else {
        console.log('🔥 LoginPage - Token não recebido na resposta');
        throw new Error('Token não recebido');
      }
    } catch (error: unknown) {
      console.error('🔥 LoginPage - Erro no login:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      setError(errorMessage);
    } finally {
      console.log('🔥 LoginPage - Finalizando loading...');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card de login centralizado */}
        <Card className="w-full max-w-md p-8 shadow-2xl border-0 bg-white rounded-3xl">
          <CardHeader className="space-y-4 text-center">
            {/* Logo e ícone */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white fill-current" />
              </div>
            </div>
            
            {/* Título e subtítulo */}
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-gray-800">PetCare</CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Sistema de Gestão Veterinária
              </CardDescription>
            </div>
            
            {/* Título da seção */}
            <div className="pt-4">
              <h2 className="text-xl font-semibold text-gray-800">Entrar na sua conta</h2>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    E-mail
                  </Label>
                  <div className="relative">
                    <Mail className={cn(
                      "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5",
                      validationErrors.email ? "text-red-400" : "text-gray-400"
                    )} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="E-mail"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearFieldError('email');
                      }}
                      className={cn(
                        "pl-12 h-12 bg-white rounded-lg text-gray-700 transition-colors",
                        validationErrors.email 
                          ? "border-2 border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                          : "border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      )}
                      disabled={loading}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha" className="text-sm font-medium text-gray-700">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className={cn(
                      "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5",
                      validationErrors.senha ? "text-red-400" : "text-gray-400"
                    )} />
                    <Input
                      id="senha"
                      type="password"
                      placeholder="Senha"
                      value={senha}
                      onChange={(e) => {
                        setSenha(e.target.value);
                        clearFieldError('senha');
                      }}
                      className={cn(
                        "pl-12 pr-12 h-12 bg-white rounded-lg text-gray-700 transition-colors",
                        validationErrors.senha 
                          ? "border-2 border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                          : "border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      )}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                  {validationErrors.senha && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.senha}</p>
                  )}
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
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Entrando...</span>
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => alert('Funcionalidade em desenvolvimento')}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                  type="button"
                >
                  Esqueceu sua senha?
                </button>
                <button
                  onClick={() => alert('Funcionalidade em desenvolvimento')}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                  type="button"
                >
                  Criar conta
                </button>
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                © 2024 PetCare. Todos os direitos reservados.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}