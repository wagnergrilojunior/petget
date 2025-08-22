'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuthService, UserInfo } from '@/services/auth';
import {
  Users,
  Heart,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
} from 'lucide-react';

interface DashboardStats {
  totalClientes: number;
  totalPets: number;
  agendamentosHoje: number;
  faturamentoMes: number;
  agendamentosPendentes: number;
}

interface AgendamentoRecente {
  id: string;
  cliente: string;
  pet: string;
  servico: string;
  horario: string;
  status: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalClientes: 0,
    totalPets: 0,
    agendamentosHoje: 0,
    faturamentoMes: 0,
    agendamentosPendentes: 0,
  });
  const [agendamentosRecentes, setAgendamentosRecentes] = useState<AgendamentoRecente[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!AuthService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const isValid = await AuthService.validateToken();
      if (!isValid) {
        AuthService.clearStorage();
        router.push('/login');
        return;
      }

      const userInfo = AuthService.getUserInfo();
      setUser(userInfo);
      await loadDashboardData();
    };

    checkAuth();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data por enquanto - substituir por chamadas reais à API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula loading
      
      setStats({
        totalClientes: 156,
        totalPets: 234,
        agendamentosHoje: 12,
        faturamentoMes: 15750.00,
        agendamentosPendentes: 8,
      });
      
      setAgendamentosRecentes([
        {
          id: '1',
          cliente: 'Maria Silva',
          pet: 'Rex',
          servico: 'Consulta',
          horario: '14:00',
          status: 'Confirmado'
        },
        {
          id: '2',
          cliente: 'João Santos',
          pet: 'Mimi',
          servico: 'Vacina',
          horario: '15:30',
          status: 'Pendente'
        },
        {
          id: '3',
          cliente: 'Ana Costa',
          pet: 'Bella',
          servico: 'Banho e Tosa',
          horario: '16:00',
          status: 'Confirmado'
        }
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Bem-vindo, {user.nome} - {user.empresaNome || 'PetGet'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{user.perfil}</Badge>
              <Button onClick={handleLogout} variant="outline">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Clientes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClientes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pets</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPets}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.agendamentosHoje}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Faturamento</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {stats.faturamentoMes.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.agendamentosPendentes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Recentes</CardTitle>
              <CardDescription>
                Últimos agendamentos realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agendamentosRecentes.map((agendamento) => (
                  <div key={agendamento.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{agendamento.cliente}</p>
                      <p className="text-sm text-gray-600">
                        {agendamento.pet} - {agendamento.servico}
                      </p>
                      <p className="text-sm text-gray-500">{agendamento.horario}</p>
                    </div>
                    <Badge 
                      variant={agendamento.status === 'Confirmado' ? 'default' : 'secondary'}
                    >
                      {agendamento.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Acesso rápido às principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col" variant="outline" disabled>
                  <Users className="h-6 w-6 mb-2" />
                  <span>Novo Cliente</span>
                </Button>
                <Button className="h-20 flex flex-col" variant="outline" disabled>
                  <Calendar className="h-6 w-6 mb-2" />
                  <span>Agendar</span>
                </Button>
                <Button className="h-20 flex flex-col" variant="outline" disabled>
                  <Heart className="h-6 w-6 mb-2" />
                  <span>Novo Pet</span>
                </Button>
                <Button className="h-20 flex flex-col" variant="outline" disabled>
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>Relatórios</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}