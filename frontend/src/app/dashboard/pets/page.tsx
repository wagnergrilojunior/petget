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
import { Heart, Search, Plus, Calendar, Weight } from 'lucide-react';
import { ApiClient, PaginatedResponse } from '@/lib/api';

interface Pet {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  idade: number;
  peso: number;
  cor: string;
  cliente: {
    id: string;
    nome: string;
  };
  ultimaConsulta: string;
  proximaVacina: string;
  status: 'saudavel' | 'tratamento' | 'observacao';
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // API usa 0-based pagination
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadPets();
  }, [currentPage, searchTerm]);

  const loadPets = async () => {
    try {
      setLoading(true);
      
      const response: PaginatedResponse<any> = await ApiClient.getPets({
        page: currentPage,
        size: 10,
        search: searchTerm || undefined
      });
      
      // Mapeia os dados da API para o formato esperado pelo componente
      const petsFormatados: Pet[] = response.content.map((item: any) => ({
        id: item.id,
        nome: item.nome || 'Nome não informado',
        especie: item.especie || 'Espécie não informada',
        raca: item.raca || 'Raça não informada',
        idade: item.idade || 0,
        peso: item.peso || 0,
        cor: item.cor || 'Cor não informada',
        cliente: {
          id: item.cliente?.id || '',
          nome: item.cliente?.nome || 'Cliente não informado'
        },
        ultimaConsulta: item.ultimaConsulta || new Date().toISOString(),
        proximaVacina: item.proximaVacina || new Date().toISOString(),
        status: item.status || 'saudavel'
      }));
      
      setPets(petsFormatados);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
      // Em caso de erro, mantém dados vazios
      setPets([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = pets.filter(pet =>
    pet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.raca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Pet['status']) => {
    switch (status) {
      case 'saudavel':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'tratamento':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'observacao':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: Pet['status']) => {
    switch (status) {
      case 'saudavel':
        return 'Saudável';
      case 'tratamento':
        return 'Em Tratamento';
      case 'observacao':
        return 'Observação';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pets</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie os animais de estimação dos seus clientes</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Pet
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Pets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalElements}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saudáveis</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pets.filter(p => p.status === 'saudavel').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Em Tratamento</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pets.filter(p => p.status === 'tratamento').length}
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vacinas Pendentes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
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
                placeholder="Buscar por nome do pet, espécie, raça ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pets</CardTitle>
          <CardDescription>
            {searchTerm ? `${pets.length} pet(s) encontrado(s) para "${searchTerm}"` : `${totalElements} pet(s) cadastrado(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Carregando pets...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pet</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Espécie/Raça</TableHead>
                  <TableHead>Idade/Peso</TableHead>
                  <TableHead>Última Consulta</TableHead>
                  <TableHead>Próxima Vacina</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pets.map((pet) => (
                  <TableRow key={pet.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pet.nome}</div>
                        <div className="text-sm text-gray-500">{pet.cor}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{pet.cliente.nome}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pet.especie}</div>
                        <div className="text-sm text-gray-500">{pet.raca}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {pet.idade} ano(s)
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Weight className="w-3 h-3" />
                          {pet.peso} kg
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(pet.ultimaConsulta).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{new Date(pet.proximaVacina).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(pet.status)}>
                        {getStatusLabel(pet.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          Histórico
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Página {currentPage + 1} de {totalPages}
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
                  disabled={currentPage === totalPages - 1}
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