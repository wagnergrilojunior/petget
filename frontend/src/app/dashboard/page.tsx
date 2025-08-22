'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// Layout removido - usando layout nativo do Next.js em dashboard/layout.tsx
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { RevenueChart, PlanChart } from '@/components/dashboard/Charts';
import { RecentTable } from '@/components/dashboard/RecentTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthService, UserInfo } from '@/services/auth';
import { 
  Euro,
  Users, 
  Heart, 
  TrendingUp,
  Activity,
  Calendar,
  Stethoscope,
  PawPrint
} from 'lucide-react';

interface DashboardStats {
  receita: number;
  faturasAbertas: number;
  clientesAtivos: number;
  tratamentos: {
    checkup: number;
    vacinacao: number;
    cirurgia: number;
    odontologia: number;
    exames: number;
    internacao: number;
  };
}

interface RecentConsultation {
  id: string;
  animal: string;
  client: string;
  service: string;
  status: 'completed' | 'pending' | 'cancelled';
  value: string;
}

interface TopClient {
  id: string;
  name: string;
  value: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    receita: 23500,
    faturasAbertas: 5200,
    clientesAtivos: 451,
    tratamentos: {
      checkup: 282,
      vacinacao: 282,
      cirurgia: 126,
      odontologia: 153,
      exames: 108,
      internacao: 58,
    },
  });
  const [consultations, setConsultations] = useState<RecentConsultation[]>([]);
  const [topClients, setTopClients] = useState<TopClient[]>([]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Dados mockados para desenvolvimento
      const mockConsultations: RecentConsultation[] = [
        {
          id: '1',
          animal: 'Rex',
          client: 'João Almeida',
          service: 'Vacinação',
          status: 'completed',
          value: '€ 50'
        },
        {
          id: '2',
          animal: 'Nina',
          client: 'Ana Castro',
          service: 'Check-up',
          status: 'pending',
          value: '€ 75'
        },
        {
          id: '3',
          animal: 'Thor',
          client: 'Pedro Oliveira',
          service: 'Internação',
          status: 'completed',
          value: '€ 120'
        },
        {
          id: '4',
          animal: 'Bella',
          client: 'Carla Lima',
          service: 'Vacinação',
          status: 'completed',
          value: '€ 45'
        },
        {
          id: '5',
          animal: 'Luke',
          client: 'Fernanda Costa',
          service: 'Check-up',
          status: 'pending',
          value: '€ 80'
        }
      ];

      const mockTopClients: TopClient[] = [
        { id: '1', name: 'Arthur Martins', value: '€ 4.900' },
        { id: '2', name: 'Vanessa Carvalho', value: '€ 3.700' },
        { id: '3', name: 'Marina Santos', value: '€ 2.300' }
      ];

      setConsultations(mockConsultations);
      setTopClients(mockTopClients);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initDashboard = async () => {
      try {
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
        setIsLoading(false);
      } catch (error) {
        console.error('Erro na inicialização:', error);
        AuthService.clearStorage();
        router.push('/login');
      }
    };

    initDashboard();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Dados para os gráficos
  const revenueData = [
    { name: 'Jan', thisYear: 15000, lastYear: 12000 },
    { name: 'Fev', thisYear: 18000, lastYear: 14000 },
    { name: 'Mar', thisYear: 22000, lastYear: 16000 },
    { name: 'Abr', thisYear: 25000, lastYear: 18000 },
    { name: 'Mai', thisYear: 28000, lastYear: 20000 },
    { name: 'Jun', thisYear: 30000, lastYear: 22000 },
  ];

  const planData = [
    { name: 'Plano A', value: 50, color: '#3b82f6' },
    { name: 'Plano B', value: 30, color: '#8b5cf6' },
    { name: 'Plano C', value: 20, color: '#06b6d4' },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricsCard
          title="Receita"
          value={`€${stats.receita.toLocaleString()}`}
          icon={Euro}
          trend={{ value: 16.8, isPositive: true }}
        />
        <MetricsCard
          title="Faturas em aberto"
          value={`€${stats.faturasAbertas.toLocaleString()}`}
          icon={TrendingUp}
        />
        <MetricsCard
          title="Clientes Ativos"
          value={stats.clientesAtivos}
          icon={Users}
          trend={{ value: 1.2, isPositive: true }}
        />
        <MetricsCard
          title="Tratamentos"
          value="6 tipos"
          subtitle="Checkup, Vacinação, Cirurgia..."
          icon={Stethoscope}
        />
      </div>

      {/* Seção de Tratamentos */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Tratamentos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Checkup</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tratamentos.checkup}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Vacinação</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tratamentos.vacinacao}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Cirurgia</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tratamentos.cirurgia}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Odontologia</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tratamentos.odontologia}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Exames</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tratamentos.exames}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Internação</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tratamentos.internacao}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita por plano</CardTitle>
          </CardHeader>
          <CardContent>
            <PlanChart data={planData} />
          </CardContent>
        </Card>
      </div>

      {/* Tabelas de Dados Recentes */}
       <RecentTable consultations={consultations} topClients={topClients} />
    </div>
  );
}

export default DashboardPage;