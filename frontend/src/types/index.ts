// Tipos básicos do sistema PetGet

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
}

export interface Empresa extends BaseEntity {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  ativo: boolean;
  logoUrl?: string;
  observacoes?: string;
}

export interface Usuario extends BaseEntity {
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  ativo: boolean;
  ultimoLogin?: string;
  telefone?: string;
  fotoUrl?: string;
  empresa: Empresa;
}

export interface Cliente extends BaseEntity {
  nome: string;
  cpfCnpj: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  pets: Pet[];
}

export interface Pet extends BaseEntity {
  nome: string;
  especie: EspeciePet;
  raca?: string;
  sexo: SexoPet;
  dataNascimento?: string;
  peso?: number;
  cor?: string;
  fotoUrl?: string;
  observacoes?: string;
  ativo: boolean;
  microchip?: string;
  pedigree?: string;
  cliente: Cliente;
}

// Enums
export enum PerfilUsuario {
  ADMIN_EMPRESA = 'ADMIN_EMPRESA',
  VETERINARIO = 'VETERINARIO',
  ATENDENTE = 'ATENDENTE',
  FINANCEIRO = 'FINANCEIRO',
  USUARIO = 'USUARIO'
}

export enum EspeciePet {
  CACHORRO = 'CACHORRO',
  GATO = 'GATO',
  PASSARO = 'PASSARO',
  PEIXE = 'PEIXE',
  HAMSTER = 'HAMSTER',
  COELHO = 'COELHO',
  TARTARUGA = 'TARTARUGA',
  IGUANA = 'IGUANA',
  CHINCHILA = 'CHINCHILA',
  FERRET = 'FERRET',
  OUTRO = 'OUTRO'
}

export enum SexoPet {
  MACHO = 'MACHO',
  FEMEA = 'FEMEA',
  INDEFINIDO = 'INDEFINIDO'
}

// DTOs para API
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  usuario: Usuario;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Tipos para formulários
export interface ClienteFormData {
  nome: string;
  cpfCnpj: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
}

export interface PetFormData {
  nome: string;
  especie: EspeciePet;
  raca?: string;
  sexo: SexoPet;
  dataNascimento?: string;
  peso?: number;
  cor?: string;
  observacoes?: string;
  microchip?: string;
  pedigree?: string;
  clienteId: string;
}