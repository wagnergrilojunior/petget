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
import { Users, Search, Plus, Phone, Mail } from 'lucide-react';
import { ApiClient, PaginatedResponse } from '@/lib/api';

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  endereco: string;
  totalPets: number;
  ultimaVisita: string;
  status: 'ativo' | 'inativo';
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // API usa 0-based pagination
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadClientes();
  }, [currentPage, searchTerm]);

  const loadClientes = async () => {
    try {
      setLoading(true);
      
      const response: PaginatedResponse<any> = await ApiClient.getClientes({
        page: currentPage,
        size: 10,
        search: searchTerm || undefined,
        status: 'ativo'
      });
      
      // Mapeia os dados da API para o formato esperado pelo componente
      const clientesFormatados: Cliente[] = response.content.map((item: any) => ({
        id: item.id,
        nome: item.nome || 'Nome não informado',
        email: item.email || 'Email não informado',
        telefone: item.telefone || 'Telefone não informado',
        cpfCnpj: item.cpfCnpj || 'CPF/CNPJ não informado',
        endereco: `${item.endereco?.logradouro || ''}, ${item.endereco?.numero || ''} - ${item.endereco?.cidade || ''}`.trim(),
        totalPets: item.pets?.length || 0,
        ultimaVisita: item.ultimaVisita || new Date().toISOString(),
        status: item.ativo ? 'ativo' : 'inativo'
      }));
      
      setClientes(clientesFormatados);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      // Em caso de erro, mantém dados vazios
      setClientes([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpfCnpj.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clientes</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie seus clientes e informações de contato</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalElements}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clientes Ativos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {clientes.filter(c => c.status === 'ativo').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Novos este Mês</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome, email ou CPF/CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clientes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {searchTerm ? filteredClientes.length : totalElements} cliente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Carregando clientes...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Pets</TableHead>
                  <TableHead>Última Visita</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(searchTerm ? filteredClientes : clientes).map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{cliente.nome}</div>
                        <div className="text-sm text-gray-500">{cliente.endereco}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{cliente.email}</div>
                        <div className="text-sm text-gray-500">{cliente.telefone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{cliente.cpfCnpj}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{cliente.totalPets} pet(s)</Badge>
                    </TableCell>
                    <TableCell>{new Date(cliente.ultimaVisita).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge variant={cliente.status === 'ativo' ? 'default' : 'secondary'}>
                        {cliente.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          Ver Pets
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {/* Paginação */}
          {!searchTerm && totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-gray-500">
                Página {currentPage + 1} de {totalPages} ({totalElements} total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}