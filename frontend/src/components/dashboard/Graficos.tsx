import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Dados mock para o gráfico de receita mensal
const dadosReceitaMensal = [
  { mes: 'Jan', anoAtual: 15000, anoPassado: 12000 },
  { mes: 'Fev', anoAtual: 18000, anoPassado: 14000 },
  { mes: 'Mar', anoAtual: 22000, anoPassado: 16000 },
  { mes: 'Abr', anoAtual: 25000, anoPassado: 18000 },
  { mes: 'Mai', anoAtual: 28000, anoPassado: 20000 },
  { mes: 'Jun', anoAtual: 32000, anoPassado: 22000 },
  { mes: 'Jul', anoAtual: 35000, anoPassado: 25000 },
  { mes: 'Ago', anoAtual: 38000, anoPassado: 28000 },
  { mes: 'Set', anoAtual: 42000, anoPassado: 30000 },
  { mes: 'Nov', anoAtual: 45000, anoPassado: 32000 },
  { mes: 'Dez', anoAtual: 48000, anoPassado: 35000 }
];

// Dados mock para o gráfico de receita por plano
const dadosReceitaPlano = [
  { nome: 'Plano A', valor: 50, cor: '#3b82f6' },
  { nome: 'Plano B', valor: 30, cor: '#60a5fa' },
  { nome: 'Plano C', valor: 20, cor: '#93c5fd' }
];

function GraficoReceitaMensal() {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Receita Mensal
        </CardTitle>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-gray-600">Este ano</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
            <span className="text-gray-600">Ano passado</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosReceitaMensal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="mes" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickFormatter={(value) => `€${value / 1000}k`}
              />
              <Tooltip 
                formatter={(value: number) => [`€${value.toLocaleString()}`, '']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="anoAtual" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="anoPassado" 
                stroke="#93c5fd" 
                strokeWidth={3}
                dot={{ fill: '#93c5fd', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#93c5fd', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function GraficoReceitaPlano() {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Receita por plano
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dadosReceitaPlano}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="valor"
              >
                {dadosReceitaPlano.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Participação']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legenda personalizada */}
        <div className="mt-4 space-y-2">
          {dadosReceitaPlano.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.cor }}
                ></div>
                <span className="text-sm text-gray-600">{item.nome}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{item.valor}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Graficos() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GraficoReceitaMensal />
      <GraficoReceitaPlano />
    </div>
  );
}