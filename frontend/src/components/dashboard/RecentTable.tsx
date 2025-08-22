'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Eye, Edit } from 'lucide-react';

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

interface RecentTableProps {
  consultations: RecentConsultation[];
  topClients: TopClient[];
}

const statusConfig = {
  completed: { label: 'Concluído', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
  pending: { label: 'Pendente', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
  cancelled: { label: 'Cancelado', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
};

const serviceConfig = {
  'Vacinação': 'bg-blue-100 text-blue-800',
  'Check-up': 'bg-purple-100 text-purple-800',
  'Internação': 'bg-orange-100 text-orange-800',
};

export function RecentTable({ consultations, topClients }: RecentTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Últimas Consultas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Últimas consultas</h3>
          <div className="flex space-x-2 text-sm text-gray-500">
            <span>Animal</span>
            <span>Cliente</span>
            <span>Status</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {consultations.map((consultation) => {
            const status = statusConfig[consultation.status];
            const serviceColor = serviceConfig[consultation.service as keyof typeof serviceConfig] || 'bg-gray-100 text-gray-800';
            
            return (
              <div key={consultation.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                      {getInitials(consultation.animal)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{consultation.animal}</span>
                      <Badge className={`text-xs ${serviceColor} border-0`}>
                        {consultation.service}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{consultation.client}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className={`${status.color} border-0`}>
                    {status.label}
                  </Badge>
                  <span className="text-sm font-medium text-gray-900">{consultation.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Clientes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Top clientes</h3>
        
        <div className="space-y-3">
          {topClients.map((client, index) => (
            <div key={client.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                  {index + 1}
                </div>
                <span className="font-medium text-gray-900">{client.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{client.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}