import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse } from '@/types';

// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Instância do axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (tenantId) {
      config.headers['X-Tenant-Id'] = tenantId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tenantId');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Classe para gerenciar chamadas à API
export class ApiService {
  // Métodos genéricos
  static async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await api.get<ApiResponse<T>>(url);
    return response.data;
  }

  static async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await api.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  static async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await api.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  static async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await api.delete<ApiResponse<T>>(url);
    return response.data;
  }

  static async getPaginated<T>(url: string, params?: any): Promise<PaginatedResponse<T>> {
    const response = await api.get<PaginatedResponse<T>>(url, { params });
    return response.data;
  }

  // Métodos específicos para autenticação
  static async login(email: string, senha: string) {
    return this.post('/auth/login', { email, senha });
  }

  static async refreshToken(refreshToken: string) {
    return this.post('/auth/refresh', { refreshToken });
  }

  static async logout() {
    return this.post('/auth/logout');
  }

  // Métodos para clientes
  static async getClientes(page = 0, size = 20, search?: string) {
    const params = { page, size, search };
    return this.getPaginated('/clientes', params);
  }

  static async getCliente(id: string) {
    return this.get(`/clientes/${id}`);
  }

  static async createCliente(data: any) {
    return this.post('/clientes', data);
  }

  static async updateCliente(id: string, data: any) {
    return this.put(`/clientes/${id}`, data);
  }

  static async deleteCliente(id: string) {
    return this.delete(`/clientes/${id}`);
  }

  // Métodos para pets
  static async getPets(page = 0, size = 20, clienteId?: string) {
    const params = { page, size, clienteId };
    return this.getPaginated('/pets', params);
  }

  static async getPet(id: string) {
    return this.get(`/pets/${id}`);
  }

  static async createPet(data: any) {
    return this.post('/pets', data);
  }

  static async updatePet(id: string, data: any) {
    return this.put(`/pets/${id}`, data);
  }

  static async deletePet(id: string) {
    return this.delete(`/pets/${id}`);
  }

  // Métodos para usuários
  static async getUsuarios(page = 0, size = 20) {
    const params = { page, size };
    return this.getPaginated('/usuarios', params);
  }

  static async getUsuario(id: string) {
    return this.get(`/usuarios/${id}`);
  }

  static async createUsuario(data: any) {
    return this.post('/usuarios', data);
  }

  static async updateUsuario(id: string, data: any) {
    return this.put(`/usuarios/${id}`, data);
  }

  static async deleteUsuario(id: string) {
    return this.delete(`/usuarios/${id}`);
  }

  // Métodos para empresa
  static async getEmpresa() {
    return this.get('/empresa');
  }

  static async updateEmpresa(data: any) {
    return this.put('/empresa', data);
  }
}

export default api;