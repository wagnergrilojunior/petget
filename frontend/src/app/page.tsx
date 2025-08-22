'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@/hooks/useLocalStorage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Calendar, Shield } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">PetGet</span>
            </div>
            <Button onClick={() => router.push('/login')} className="bg-blue-600 hover:bg-blue-700">
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Gestão Completa para
            <span className="text-blue-600 block">Clínicas Veterinárias</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema completo para gerenciar clientes, pets, agendamentos, estoque e financeiro.
            Tudo que você precisa para fazer seu negócio crescer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              onClick={() => router.push('/login')}
            >
              Começar Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3"
            >
              Ver Demonstração
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tudo que você precisa em um só lugar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>Gestão de Clientes</CardTitle>
                <CardDescription>
                  Cadastro completo de clientes e seus pets, com histórico de atendimentos e vacinas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle>Agenda Inteligente</CardTitle>
                <CardDescription>
                  Agendamento de consultas, cirurgias e serviços com lembretes automáticos via WhatsApp.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-purple-600 mb-4" />
                <CardTitle>Controle Financeiro</CardTitle>
                <CardDescription>
                  Gestão completa de contas a pagar e receber, com integração para pagamentos online.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-blue-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para transformar sua clínica?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Junte-se a centenas de profissionais que já usam o PetGet para gerenciar seus negócios.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
            onClick={() => router.push('/login')}
          >
            Começar Gratuitamente
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-xl font-bold">PetGet</span>
            </div>
            <p className="text-gray-400">
              © 2024 PetGet. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
