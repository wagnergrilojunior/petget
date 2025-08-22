import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Consulta {
  id: string;
  animal: string;
  cliente: string;
  status: 'internacao' | 'vacinacao' | 'checkup' | 'cirurgia' | 'emergencia';
  data: string;
  hora: string;
}

// Dados mock das últimas consultas
const consultasRecentes: Consulta[] = [
  {
    id: '1',
    animal: 'Rex',
    cliente: 'João Almeida',
    status: 'vacinacao',
    data: '15/12/2024',
    hora: '09:30'
  },
  {
    id: '2',
    animal: 'Nina',
    cliente: 'Ana Castro',
    status: 'checkup',
    data: '15/12/2024',
    hora: '10:15'
  },
  {
    id: '3',
    animal: 'Thor',
    cliente: 'Pedro Oliveira',
    status: 'internacao',
    data: '15/12/2024',
    hora: '11:00'
  },
  {
    id: '4',
    animal: 'Bella',
    cliente: 'Carla Lima',
    status: 'internacao',
    data: '15/12/2024',
    hora: '14:30'
  },
  {
    id: '5',
    animal: 'Luke',
    cliente: 'Fernanda Costa',
    status: 'cirurgia',
    data: '15/12/2024',
    hora: '15:45'
  }
];

function getStatusBadge(status: Consulta['status']) {
  const statusConfig = {
    internacao: {
      label: 'Internação',
      variant: 'default' as const,
      className: 'bg-green-100 text-green-800 hover:bg-green-100'
    },
    vacinacao: {
      label: 'Vacinação',
      variant: 'secondary' as const,
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    },
    checkup: {
      label: 'Check-up',
      variant: 'outline' as const,
      className: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    },
    cirurgia: {
      label: 'Cirurgia',
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-800 hover:bg-red-100'
    },
    emergencia: {
      label: 'Emergência',
      variant: 'destructive' as const,
      className: 'bg-orange-100 text-orange-800 hover:bg-orange-100'
    }
  };

  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={config.variant}
      className={config.className}
    >
      {config.label}
    </Badge>
  );
}

export default function TabelaConsultas() {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Últimas consultas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="text-gray-600 font-medium">Animal</TableHead>
              <TableHead className="text-gray-600 font-medium">Cliente</TableHead>
              <TableHead className="text-gray-600 font-medium">Status</TableHead>
              <TableHead className="text-gray-600 font-medium text-right">Data/Hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultasRecentes.map((consulta) => (
              <TableRow key={consulta.id} className="border-gray-100 hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">
                  {consulta.animal}
                </TableCell>
                <TableCell className="text-gray-600">
                  {consulta.cliente}
                </TableCell>
                <TableCell>
                  {getStatusBadge(consulta.status)}
                </TableCell>
                <TableCell className="text-right text-gray-600">
                  <div className="text-sm">
                    <div>{consulta.data}</div>
                    <div className="text-gray-400">{consulta.hora}</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}