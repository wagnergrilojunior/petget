import React from 'react';
import CardsMetrica from '@/components/dashboard/CardsMetrica';
import Graficos from '@/components/dashboard/Graficos';
import TabelaConsultas from '@/components/dashboard/TabelaConsultas';
import TabelaTopClientes from '@/components/dashboard/TabelaTopClientes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Dados mock para a seção de tratamentos
const tratamentos = [
  { nome: 'Check-up', quantidade: 282 },
  { nome: 'Vacinação', quantidade: 282 },
  { nome: 'Cirurgia', quantidade: 126 },
  { nome: 'Odontologia', quantidade: 153 },
  { nome: 'Exames', quantidade: 108 },
  { nome: 'Internação', quantidade: 58 }
];

function SecaoTratamentos() {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Tratamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tratamentos.map((tratamento, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">{tratamento.nome}</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                {tratamento.quantidade}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <CardsMetrica />
      
      {/* Gráficos */}
      <Graficos />
      
      {/* Seção inferior com tabelas e tratamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de Consultas - ocupa 2 colunas */}
        <div className="lg:col-span-2">
          <TabelaConsultas />
        </div>
        
        {/* Coluna direita com Tratamentos e Top Clientes */}
        <div className="space-y-6">
          <SecaoTratamentos />
          <TabelaTopClientes />
        </div>
      </div>
    </div>
  );
}