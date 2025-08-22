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
import { Search, Plus, DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { ApiClient, PaginatedResponse } from '@/lib/api';

interface Transacao {
  id: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  status: 'pago' | 'pendente' | 'vencido';
  cliente?: {
    id: string;
    nome: string;
  };
  formaPagamento?: string;
  observacoes?: string;
}

interface ResumoFinanceiro {
  receitasMes: number;
  despesasMes: number;
  saldoMes: number;
  contasReceber: number;
  contasPagar: number;
  fluxoCaixa: number;
}

export default function FinanceiroPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [resumo, setResumo] = useState<ResumoFinanceiro>({
    receitasMes: 0,
    despesasMes: 0,
    saldoMes: 0,
    contasReceber: 0,
    contasPagar: 0,
    fluxoCaixa: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('mes_atual');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadFinanceiro();
  }, [searchTerm, selectedPeriod, tipoFilter, currentPage]);

  const loadFinanceiro = async () => {
    try {
      setLoading(true);
      
      // Carregar transações com paginação
      const transacoesParams = {
        page: currentPage,
        size: 10,
        ...(tipoFilter !== 'todos' && { tipo: tipoFilter }),
        ...(selectedPeriod === 'mes_atual' && {
          dataInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
          dataFim: new Date().toISOString().split('T')[0]
        })
      };
      
      const [transacoesResponse, resumoResponse] = await Promise.all([
        ApiClient.getTransacoesFinanceiras(transacoesParams),
        ApiClient.getResumoFinanceiro({
          dataInicio: selectedPeriod === 'mes_atual' 
            ? new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
            : undefined,
          dataFim: selectedPeriod === 'mes_atual'
            ? new Date().toISOString().split('T')[0]
            : undefined
        })
      ]);
      
      // Mapear dados das transações
      const transacoesMapeadas = transacoesResponse.content.map((item: any) => ({
        id: item.id,
        tipo: item.tipo,
        categoria: item.categoria,
        descricao: item.descricao,
        valor: item.valor,
        data: item.data,
        status: item.status,
        cliente: item.cliente,
        formaPagamento: item.formaPagamento,
        observacoes: item.observacoes
      }));
      
      setTransacoes(transacoesMapeadas);
      setTotalPages(transacoesResponse.totalPages);
      setTotalElements(transacoesResponse.totalElements);
      setResumo(resumoResponse);
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
      setTransacoes([]);
      setTotalPages(0);
      setTotalElements(0);
      setResumo({
        receitasMes: 0,
        despesasMes: 0,
        saldoMes: 0,
        contasReceber: 0,
        contasPagar: 0,
        fluxoCaixa: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Como a API já faz a filtragem, usamos diretamente as transações
  const filteredTransacoes = transacoes;

  const getStatusColor = (status: Transacao['status']) => {
    switch (status) {
      case 'pago':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'vencido':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: Transacao['status']) => {
    switch (status) {
      case 'pago':
        return 'Pago';
      case 'pendente':
        return 'Pendente';
      case 'vencido':
        return 'Vencido';
      default:
        return status;
    }
  };

  const getTipoColor = (tipo: Transacao['tipo']) => {
    return tipo === 'receita' 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financeiro</h1>
          <p className="text-gray-600 dark:text-gray-400">Controle financeiro e fluxo de caixa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Relatório
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Receitas</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  R$ {resumo.receitasMes.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Despesas</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  R$ {resumo.despesasMes.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saldo Mês</p>
                <p className={`text-2xl font-bold ${
                  resumo.saldoMes >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  R$ {resumo.saldoMes.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">A Receber</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {resumo.contasReceber.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">A Pagar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {resumo.contasPagar.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fluxo Caixa</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {resumo.fluxoCaixa.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por descrição, categoria ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full sm:w-48 h-9 px-3 py-1 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="mes_atual">Mês Atual</option>
              <option value="mes_anterior">Mês Anterior</option>
              <option value="trimestre">Último Trimestre</option>
              <option value="ano">Ano Atual</option>
            </select>
            <select 
              value={tipoFilter} 
              onChange={(e) => setTipoFilter(e.target.value)}
              className="w-full sm:w-32 h-9 px-3 py-1 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="todos">Todos</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Transações Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>
            {filteredTransacoes.length} transação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Carregando transações...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransacoes
                  .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                  .map((transacao) => (
                  <TableRow key={transacao.id}>
                    <TableCell>
                      {new Date(transacao.data).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={transacao.tipo === 'receita' ? 'border-green-500' : 'border-red-500'}
                      >
                        {transacao.tipo === 'receita' ? 'Receita' : 'Despesa'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{transacao.categoria}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transacao.descricao}</div>
                        {transacao.observacoes && (
                          <div className="text-sm text-gray-500">{transacao.observacoes}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {transacao.cliente ? (
                        <div className="font-medium">{transacao.cliente.nome}</div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className={`font-bold ${getTipoColor(transacao.tipo)}`}>
                        {transacao.tipo === 'receita' ? '+' : '-'} R$ {transacao.valor.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transacao.status)}>
                        {getStatusLabel(transacao.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transacao.formaPagamento ? (
                        <div className="text-sm">{transacao.formaPagamento}</div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {transacao.status === 'pendente' && (
                          <Button variant="outline" size="sm">
                            Confirmar
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