import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TopCliente {
  id: string;
  nome: string;
  valor: string;
  avatar?: string;
  posicao: number;
}

// Dados mock dos top clientes
const topClientes: TopCliente[] = [
  {
    id: '1',
    nome: 'Arthur Martins',
    valor: '€4.900',
    posicao: 1
  },
  {
    id: '2',
    nome: 'Vanessa Carvalho',
    valor: '€3.700',
    posicao: 2
  },
  {
    id: '3',
    nome: 'Marina Santos',
    valor: '€2.300',
    posicao: 3
  }
];

function getInitials(nome: string): string {
  return nome
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getPosicaoColor(posicao: number): string {
  switch (posicao) {
    case 1:
      return 'bg-yellow-100 text-yellow-800';
    case 2:
      return 'bg-gray-100 text-gray-800';
    case 3:
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
}

export default function TabelaTopClientes() {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Top clientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topClientes.map((cliente) => (
            <div key={cliente.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                {/* Posição */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getPosicaoColor(cliente.posicao)}`}>
                  {cliente.posicao}
                </div>
                
                {/* Avatar e Nome */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={cliente.avatar} alt={cliente.nome} />
                    <AvatarFallback className="bg-blue-500 text-white text-xs">
                      {getInitials(cliente.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {cliente.nome}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Valor */}
              <div className="text-sm font-semibold text-gray-900">
                {cliente.valor}
              </div>
            </div>
          ))}
        </div>
        
        {/* Botão para ver mais */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Ver todos os clientes
          </button>
        </div>
      </CardContent>
    </Card>
  );
}