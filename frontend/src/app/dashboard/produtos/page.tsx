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
// Select component não disponível - usando select nativo
import { Search, Plus, Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { ApiClient, PaginatedResponse } from '@/lib/api';

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  marca: string;
  codigo: string;
  descricao?: string;
  preco: number;
  custo: number;
  estoque: {
    quantidade: number;
    minimo: number;
    unidade: string;
  };
  status: 'ativo' | 'inativo';
  fornecedor?: string;
  dataUltimaCompra?: string;
  dataUltimaVenda?: string;
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadProdutos();
  }, [searchTerm, selectedCategory, statusFilter, currentPage]);

  const loadProdutos = async () => {
    try {
      setLoading(true);
      
      const response: PaginatedResponse<any> = await ApiClient.getProdutos({
        page: currentPage,
        size: 10,
        search: searchTerm,
        categoria: selectedCategory !== 'todos' ? selectedCategory : undefined,
        status: statusFilter !== 'todos' ? statusFilter : undefined
      });
      
      // Mapear dados da API para o formato esperado
      const produtosMapeados: Produto[] = response.content.map((item: any) => ({
        id: item.id,
        nome: item.nome || 'Produto sem nome',
        categoria: item.categoria || 'Sem categoria',
        marca: item.marca || 'Sem marca',
        codigo: item.codigo || item.id,
        descricao: item.descricao,
        preco: item.preco || 0,
        custo: item.custo || 0,
        estoque: {
          quantidade: item.estoque?.quantidade || 0,
          minimo: item.estoque?.minimo || 0,
          unidade: item.estoque?.unidade || 'un'
        },
        status: item.status || 'ativo',
        fornecedor: item.fornecedor,
        dataUltimaCompra: item.dataUltimaCompra,
        dataUltimaVenda: item.dataUltimaVenda
      }));
      
      setProdutos(produtosMapeados);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setProdutos([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  // Como a API já faz a filtragem, usamos diretamente os produtos
  const filteredProdutos = produtos;

  const categorias = Array.from(new Set(produtos.map(p => p.categoria)));
  
  const produtosAtivos = produtos.filter(p => p.status === 'ativo').length;
  const produtosBaixoEstoque = produtos.filter(p => p.estoque.quantidade <= p.estoque.minimo).length;
  const valorTotalEstoque = produtos.reduce((total, p) => total + (p.preco * p.estoque.quantidade), 0);
  const margemMedia = produtos.length > 0 
    ? produtos.reduce((total, p) => total + ((p.preco - p.custo) / p.preco * 100), 0) / produtos.length
    : 0;

  const getEstoqueStatus = (produto: Produto) => {
    if (produto.estoque.quantidade === 0) {
      return { label: 'Sem Estoque', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
    } else if (produto.estoque.quantidade <= produto.estoque.minimo) {
      return { label: 'Baixo Estoque', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    } else {
      return { label: 'Normal', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Produtos</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie produtos e controle de estoque</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Relatório
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Produtos Ativos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{produtosAtivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Baixo Estoque</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{produtosBaixoEstoque}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Valor Estoque</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {valorTotalEstoque.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Margem Média</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {margemMedia.toFixed(1)}%
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
                placeholder="Buscar por nome, marca ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-48 h-9 px-3 py-1 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="todos">Todas Categorias</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-32 h-9 px-3 py-1 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="todos">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Produtos Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>
            {filteredProdutos.length} produto(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Carregando produtos...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Status Estoque</TableHead>
                  <TableHead>Margem</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProdutos.map((produto) => {
                  const estoqueStatus = getEstoqueStatus(produto);
                  const margem = ((produto.preco - produto.custo) / produto.preco * 100);
                  
                  return (
                    <TableRow key={produto.id}>
                      <TableCell>
                        <div className="font-mono text-sm">{produto.codigo}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{produto.nome}</div>
                          <div className="text-sm text-gray-500">{produto.marca}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{produto.categoria}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">R$ {produto.preco.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">Custo: R$ {produto.custo.toFixed(2)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {produto.estoque.quantidade} {produto.estoque.unidade}
                          </div>
                          <div className="text-sm text-gray-500">
                            Mín: {produto.estoque.minimo} {produto.estoque.unidade}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={estoqueStatus.color}>
                          {estoqueStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${
                          margem > 30 ? 'text-green-600' : 
                          margem > 15 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {margem.toFixed(1)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm">
                            Estoque
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}