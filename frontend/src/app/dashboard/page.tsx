'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/enhanced-badge';
import { Button } from '@/components/ui/button';
import { KPICard, PetGetKPIs } from '@/components/organisms/KPICard';
import { RevenueLineChart, ServicesPieChart, RevenuePieChart } from '@/components/organisms/Charts';
import { RecentActivities, generateMockActivities } from '@/components/organisms/RecentActivities';
import { AuthService, UserInfo } from '@/services/auth';
import { ApiClient } from "@/lib/api"
import {
  Users,
  Heart,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Edit,
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

const DashboardPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
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

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carrega estatísticas do dashboard
      const dashboardStats = {
        totalClientes: 150,
        totalPets: 280,
        agendamentosHoje: 12,
        faturamentoMes: 15000,
        agendamentosPendentes: 5,
      };
      setStats(dashboardStats);
      
      // Carrega agendamentos recentes (mock data)
      const agendamentos = [
        {
          id: '1',
          cliente: 'João Silva',
          pet: 'Rex',
          servico: 'Consulta',
          horario: '14:00',
          status: 'Confirmado'
        }
      ];
      setAgendamentosRecentes(agendamentos);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Bem-vindo de volta, {user?.nome || 'Usuário'}!
          </p>
        </div>

        {/* KPIs */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <KPICard
             title="Total de Clientes"
             value={stats.totalClientes}
             icon={Users}
             trend={{ value: 12, label: "vs mês anterior", type: "up" }}
           />
           <KPICard
             title="Total de Pets"
             value={stats.totalPets}
             icon={Heart}
             trend={{ value: 8, label: "vs mês anterior", type: "up" }}
           />
           <KPICard
             title="Agendamentos Hoje"
             value={stats.agendamentosHoje}
             icon={Calendar}
             trend={{ value: 5, label: "vs ontem", type: "up" }}
           />
           <KPICard
             title="Faturamento do Mês"
             value={`R$ ${stats.faturamentoMes.toLocaleString()}`}
             icon={DollarSign}
             trend={{ value: 15, label: "vs mês anterior", type: "up" }}
           />
         </div>

        {/* Charts */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
           <Card>
             <CardHeader>
               <CardTitle>Receita dos Últimos 6 Meses</CardTitle>
             </CardHeader>
             <CardContent>
               <RevenueLineChart 
                 data={[
                   { name: 'Jan', value: 12000 },
                   { name: 'Fev', value: 15000 },
                   { name: 'Mar', value: 18000 },
                   { name: 'Abr', value: 16000 },
                   { name: 'Mai', value: 22000 },
                   { name: 'Jun', value: 25000 },
                 ]}
               />
             </CardContent>
           </Card>
           
           <Card>
             <CardHeader>
               <CardTitle>Serviços Mais Realizados</CardTitle>
             </CardHeader>
             <CardContent>
               <ServicesPieChart 
                 data={[
                   { name: 'Consultas', value: 45, color: '#3b82f6' },
                   { name: 'Vacinas', value: 25, color: '#10b981' },
                   { name: 'Banho e Tosa', value: 20, color: '#f59e0b' },
                   { name: 'Cirurgias', value: 10, color: '#ef4444' },
                 ]}
               />
             </CardContent>
           </Card>
         </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Últimas atividades do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivities activities={generateMockActivities()} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Pendentes</CardTitle>
              <CardDescription>
                {stats.agendamentosPendentes} agendamentos aguardando confirmação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agendamentosRecentes.map((agendamento) => (
                  <div key={agendamento.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">{agendamento.cliente}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {agendamento.pet} - {agendamento.servico}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{agendamento.horario}</p>
                      <Badge variant="outline">{agendamento.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;