'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Settings, 
  User, 
  Building, 
  Users, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Save,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: 'admin' | 'veterinario' | 'atendente';
  status: 'ativo' | 'inativo';
  ultimoAcesso?: string;
}

interface ConfiguracaoEmpresa {
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  configuracoes: {
    horarioFuncionamento: {
      abertura: string;
      fechamento: string;
    };
    intervaloConsultas: number; // em minutos
    notificacoes: {
      email: boolean;
      whatsapp: boolean;
      lembreteConsulta: boolean;
    };
  };
}

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('empresa');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [empresa, setEmpresa] = useState<ConfiguracaoEmpresa>({
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      cep: ''
    },
    configuracoes: {
      horarioFuncionamento: {
        abertura: '08:00',
        fechamento: '18:00'
      },
      intervaloConsultas: 30,
      notificacoes: {
        email: true,
        whatsapp: true,
        lembreteConsulta: true
      }
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfiguracoes();
  }, []);

  const loadConfiguracoes = async () => {
    try {
      setLoading(true);
      
      // TODO: Substituir por chamadas reais à API
      // const [empresaResponse, usuariosResponse] = await Promise.all([
      //   api.get('/empresa/configuracoes'),
      //   api.get('/usuarios')
      // ]);
      
      // Mock data por enquanto
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockEmpresa: ConfiguracaoEmpresa = {
        nome: 'Clínica Veterinária PetCare',
        cnpj: '12.345.678/0001-90',
        telefone: '(11) 99999-9999',
        email: 'contato@petcare.com.br',
        endereco: {
          logradouro: 'Rua das Flores',
          numero: '123',
          complemento: 'Sala 101',
          bairro: 'Centro',
          cidade: 'São Paulo',
          uf: 'SP',
          cep: '01234-567'
        },
        configuracoes: {
          horarioFuncionamento: {
            abertura: '08:00',
            fechamento: '18:00'
          },
          intervaloConsultas: 30,
          notificacoes: {
            email: true,
            whatsapp: true,
            lembreteConsulta: true
          }
        }
      };
      
      const mockUsuarios: Usuario[] = [
        {
          id: '1',
          nome: 'Dr. João Silva',
          email: 'joao@petcare.com.br',
          perfil: 'admin',
          status: 'ativo',
          ultimoAcesso: '2024-01-20T10:30:00'
        },
        {
          id: '2',
          nome: 'Dra. Maria Santos',
          email: 'maria@petcare.com.br',
          perfil: 'veterinario',
          status: 'ativo',
          ultimoAcesso: '2024-01-20T09:15:00'
        },
        {
          id: '3',
          nome: 'Ana Costa',
          email: 'ana@petcare.com.br',
          perfil: 'atendente',
          status: 'ativo',
          ultimoAcesso: '2024-01-19T16:45:00'
        },
        {
          id: '4',
          nome: 'Carlos Oliveira',
          email: 'carlos@petcare.com.br',
          perfil: 'veterinario',
          status: 'inativo',
          ultimoAcesso: '2024-01-15T14:20:00'
        }
      ];
      
      setEmpresa(mockEmpresa);
      setUsuarios(mockUsuarios);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmpresa = async () => {
    try {
      setSaving(true);
      
      // TODO: Substituir por chamada real à API
      // await api.put('/empresa/configuracoes', empresa);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Configurações da empresa salvas:', empresa);
      // Aqui você pode adicionar um toast de sucesso
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setSaving(false);
    }
  };

  const getPerfilColor = (perfil: Usuario['perfil']) => {
    switch (perfil) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'veterinario':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'atendente':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPerfilLabel = (perfil: Usuario['perfil']) => {
    switch (perfil) {
      case 'admin':
        return 'Administrador';
      case 'veterinario':
        return 'Veterinário';
      case 'atendente':
        return 'Atendente';
      default:
        return perfil;
    }
  };

  const getStatusColor = (status: Usuario['status']) => {
    return status === 'ativo' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const tabs = [
    { id: 'empresa', label: 'Empresa', icon: Building },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'aparencia', label: 'Aparência', icon: Palette },
    { id: 'backup', label: 'Backup', icon: Database }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie as configurações do sistema</p>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Empresa Tab */}
      {activeTab === 'empresa' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>Configure os dados básicos da sua empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome da Empresa</Label>
                  <Input
                    id="nome"
                    value={empresa.nome}
                    onChange={(e) => setEmpresa({...empresa, nome: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={empresa.cnpj}
                    onChange={(e) => setEmpresa({...empresa, cnpj: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={empresa.telefone}
                    onChange={(e) => setEmpresa({...empresa, telefone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={empresa.email}
                    onChange={(e) => setEmpresa({...empresa, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="logradouro">Logradouro</Label>
                    <Input
                      id="logradouro"
                      value={empresa.endereco.logradouro}
                      onChange={(e) => setEmpresa({
                        ...empresa, 
                        endereco: {...empresa.endereco, logradouro: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      value={empresa.endereco.numero}
                      onChange={(e) => setEmpresa({
                        ...empresa, 
                        endereco: {...empresa.endereco, numero: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      value={empresa.endereco.complemento}
                      onChange={(e) => setEmpresa({
                        ...empresa, 
                        endereco: {...empresa.endereco, complemento: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={empresa.endereco.bairro}
                      onChange={(e) => setEmpresa({
                        ...empresa, 
                        endereco: {...empresa.endereco, bairro: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={empresa.endereco.cidade}
                      onChange={(e) => setEmpresa({
                        ...empresa, 
                        endereco: {...empresa.endereco, cidade: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="uf">UF</Label>
                    <Input
                      id="uf"
                      value={empresa.endereco.uf}
                      onChange={(e) => setEmpresa({
                        ...empresa, 
                        endereco: {...empresa.endereco, uf: e.target.value}
                      })}
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={empresa.endereco.cep}
                      onChange={(e) => setEmpresa({
                        ...empresa, 
                        endereco: {...empresa.endereco, cep: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Configurações Operacionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="abertura">Horário de Abertura</Label>
                    <Input
                      id="abertura"
                      type="time"
                      value={empresa.configuracoes.horarioFuncionamento.abertura}
                      onChange={(e) => setEmpresa({
                        ...empresa,
                        configuracoes: {
                          ...empresa.configuracoes,
                          horarioFuncionamento: {
                            ...empresa.configuracoes.horarioFuncionamento,
                            abertura: e.target.value
                          }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fechamento">Horário de Fechamento</Label>
                    <Input
                      id="fechamento"
                      type="time"
                      value={empresa.configuracoes.horarioFuncionamento.fechamento}
                      onChange={(e) => setEmpresa({
                        ...empresa,
                        configuracoes: {
                          ...empresa.configuracoes,
                          horarioFuncionamento: {
                            ...empresa.configuracoes.horarioFuncionamento,
                            fechamento: e.target.value
                          }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="intervalo">Intervalo entre Consultas (min)</Label>
                    <Input
                      id="intervalo"
                      type="number"
                      min="15"
                      max="120"
                      value={empresa.configuracoes.intervaloConsultas}
                      onChange={(e) => setEmpresa({
                        ...empresa,
                        configuracoes: {
                          ...empresa.configuracoes,
                          intervaloConsultas: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveEmpresa} disabled={saving} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Usuários Tab */}
      {activeTab === 'usuarios' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Usuários do Sistema</CardTitle>
                  <CardDescription>Gerencie os usuários e suas permissões</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Usuário
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="font-medium">{usuario.nome}</div>
                        </div>
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Badge className={getPerfilColor(usuario.perfil)}>
                          {getPerfilLabel(usuario.perfil)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(usuario.status)}>
                          {usuario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {usuario.ultimoAcesso ? (
                          <div className="text-sm">
                            {new Date(usuario.ultimoAcesso).toLocaleDateString('pt-BR')}
                            <br />
                            <span className="text-gray-500">
                              {new Date(usuario.ultimoAcesso).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Nunca</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Outras tabs - placeholder */}
      {activeTab !== 'empresa' && activeTab !== 'usuarios' && (
        <Card>
          <CardHeader>
            <CardTitle>Em Desenvolvimento</CardTitle>
            <CardDescription>
              Esta seção está em desenvolvimento e será implementada em breve.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}