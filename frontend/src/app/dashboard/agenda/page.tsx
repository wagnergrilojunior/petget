'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Search, Plus, Clock, User, Heart } from 'lucide-react';
import { ApiClient, PaginatedResponse } from '@/lib/api';

interface Agendamento {
  id: string;
  cliente: {
    id: string;
    nome: string;
    telefone: string;
  };
  pet: {
    id: string;
    nome: string;
    especie: string;
  };
  servico: string;
  data: string;
  horario: string;
  duracao: number; // em minutos
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
  observacoes?: string;
  valor: number;
}

export default function AgendaPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadAgendamentos();
  }, [selectedDate, searchTerm, currentPage]);

  const loadAgendamentos = async () => {
    try {
      setLoading(true);
      
      const response: PaginatedResponse<any> = await ApiClient.getAgendamentos({
        page: currentPage,
        size: 10,
        dataInicio: selectedDate,
        dataFim: selectedDate
      });
      
      // Mapear dados da API para o formato esperado
      const agendamentosMapeados: Agendamento[] = response.content.map((item: any) => ({
        id: item.id,
        cliente: {
          id: item.cliente?.id || '',
          nome: item.cliente?.nome || 'Cliente não informado',
          telefone: item.cliente?.telefone || ''
        },
        pet: {
          id: item.pet?.id || '',
          nome: item.pet?.nome || 'Pet não informado',
          especie: item.pet?.especie || ''
        },
        servico: item.servico || 'Serviço não informado',
        data: item.dataAgendamento || selectedDate,
        horario: item.horario || '00:00',
        duracao: item.duracao || 60,
        status: item.status || 'agendado',
        observacoes: item.observacoes,
        valor: item.valor || 0
      }));
      
      setAgendamentos(agendamentosMapeados);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setAgendamentos([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgendamentos = agendamentos.filter(agendamento =>
    agendamento.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agendamento.pet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agendamento.servico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Agendamento['status']) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'confirmado':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'concluido':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: Agendamento['status']) => {
    switch (status) {
      case 'agendado':
        return 'Agendado';
      case 'confirmado':
        return 'Confirmado';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const totalAgendamentos = agendamentos.length;
  const agendamentosConfirmados = agendamentos.filter(a => a.status === 'confirmado').length;
  const agendamentosEmAndamento = agendamentos.filter(a => a.status === 'em_andamento').length;
  const faturamentoDia = agendamentos
    .filter(a => a.status !== 'cancelado')
    .reduce((total, a) => total + a.valor, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agenda</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie agendamentos e consultas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Hoje
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hoje</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAgendamentos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirmados</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{agendamentosConfirmados}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <User className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Em Andamento</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{agendamentosEmAndamento}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Faturamento</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {faturamentoDia.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Selector and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'dia' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('dia')}
                  className="rounded-r-none"
                >
                  Dia
                </Button>
                <Button
                  variant={viewMode === 'semana' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('semana')}
                  className="rounded-none"
                >
                  Semana
                </Button>
                <Button
                  variant={viewMode === 'mes' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('mes')}
                  className="rounded-l-none"
                >
                  Mês
                </Button>
              </div>
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por cliente, pet ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agendamentos Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos do Dia</CardTitle>
          <CardDescription>
            {filteredAgendamentos.length} agendamento(s) para {new Date(selectedDate).toLocaleDateString('pt-BR')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Carregando agendamentos...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Horário</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Pet</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgendamentos
                  .sort((a, b) => a.horario.localeCompare(b.horario))
                  .map((agendamento) => (
                  <TableRow key={agendamento.id}>
                    <TableCell>
                      <div className="font-medium">{agendamento.horario}</div>
                      <div className="text-sm text-gray-500">{agendamento.duracao}min</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{agendamento.cliente.nome}</div>
                        <div className="text-sm text-gray-500">{agendamento.cliente.telefone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{agendamento.pet.nome}</div>
                        <div className="text-sm text-gray-500">{agendamento.pet.especie}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{agendamento.servico}</div>
                        {agendamento.observacoes && (
                          <div className="text-sm text-gray-500">{agendamento.observacoes}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{agendamento.duracao} min</TableCell>
                    <TableCell>R$ {agendamento.valor.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(agendamento.status)}>
                        {getStatusLabel(agendamento.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {agendamento.status === 'agendado' && (
                          <Button variant="outline" size="sm">
                            Confirmar
                          </Button>
                        )}
                        {agendamento.status === 'confirmado' && (
                          <Button variant="outline" size="sm">
                            Iniciar
                          </Button>
                        )}
                        {agendamento.status === 'em_andamento' && (
                          <Button variant="outline" size="sm">
                            Finalizar
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}