import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign } from 'lucide-react';

interface MetricaCardProps {
  titulo: string;
  valor: string;
  variacao?: {
    percentual: string;
    tipo: 'aumento' | 'diminuicao';
  };
  icone?: React.ReactNode;
}

function MetricaCard({ titulo, valor, variacao, icone }: MetricaCardProps) {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {titulo}
        </CardTitle>
        {icone && (
          <div className="text-gray-400">
            {icone}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-gray-900">
            {valor}
          </div>
          {variacao && (
            <div className={`flex items-center text-sm ${
              variacao.tipo === 'aumento' ? 'text-green-600' : 'text-red-600'
            }`}>
              {variacao.tipo === 'aumento' ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {variacao.percentual}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CardsMetrica() {
  const metricas = [
    {
      titulo: 'Receita',
      valor: '€23.500',
      variacao: {
        percentual: '+10.5%',
        tipo: 'aumento' as const
      },
      icone: <DollarSign className="h-5 w-5" />
    },
    {
      titulo: 'Faturas em aberto',
      valor: '€5.200',
      icone: <Calendar className="h-5 w-5" />
    },
    {
      titulo: 'Clientes Ativos',
      valor: '451',
      variacao: {
        percentual: '+1.2%',
        tipo: 'aumento' as const
      },
      icone: <Users className="h-5 w-5" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metricas.map((metrica, index) => (
        <MetricaCard
          key={index}
          titulo={metrica.titulo}
          valor={metrica.valor}
          variacao={metrica.variacao}
          icone={metrica.icone}
        />
      ))}
    </div>
  );
}