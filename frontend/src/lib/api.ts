import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Estender o tipo para incluir a propriedade _retry
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Instância principal do axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Mudará para true quando necessário
});

// Função para obter token do localStorage (client-side only)
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Função para obter tenant ID do localStorage (client-side only)
const getTenantId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('tenantId');
};

// Função para limpar dados de autenticação
const clearAuthData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tenantId');
  localStorage.removeItem('user');
};

// Interceptor para adicionar token de autenticação e tenant ID
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    const tenantId = getTenantId();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (tenantId) {
      config.headers['X-Tenant-Id'] = tenantId;
    }
    
    return config;
  },
  (error) => {
    console.error('Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      
      if (refreshToken && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Tentar renovar o token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          const { token: newToken } = response.data;
          
          if (newToken) {
            localStorage.setItem('token', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('Erro ao renovar token:', refreshError);
        }
      }
      
      // Se não conseguiu renovar ou não tem refresh token, limpar dados e redirecionar
      clearAuthData();
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    // Tratar outros erros
    if (error.response) {
      if (error.response.status === 403) {
        console.error('Acesso negado:', error.response.data);
        // Aqui você pode mostrar um toast de erro
      }
      
      if (error.response.status >= 500) {
        console.error('Erro interno do servidor:', error.response.data);
        // Aqui você pode mostrar um toast de erro
      }
    }
    
    return Promise.reject(error);
  }
);

// Tipos para as respostas da API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Cliente API principal
export class ApiClient {
  // Métodos genéricos
  static async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await api.get<T>(url, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro GET ${url}:`, error);
      throw error;
    }
  }

  static async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await api.post<T>(url, data);
      return response.data;
    } catch (error) {
      console.error(`Erro POST ${url}:`, error);
      throw error;
    }
  }

  static async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await api.put<T>(url, data);
      return response.data;
    } catch (error) {
      console.error(`Erro PUT ${url}:`, error);
      throw error;
    }
  }

  static async delete<T>(url: string): Promise<T> {
    try {
      const response = await api.delete<T>(url);
      return response.data;
    } catch (error) {
      console.error(`Erro DELETE ${url}:`, error);
      throw error;
    }
  }

  static async patch<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await api.patch<T>(url, data);
      return response.data;
    } catch (error) {
      console.error(`Erro PATCH ${url}:`, error);
      throw error;
    }
  }

  // Métodos específicos para diferentes módulos
  
  // Dashboard
  static async getDashboardMetrics(): Promise<any> {
    return this.get('/metrics/resumo');
  }

  // Clientes
  static async getClientes(params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<any>> {
    return this.get('/clientes', params);
  }

  static async getCliente(id: string): Promise<any> {
    return this.get(`/clientes/${id}`);
  }

  static async createCliente(data: any): Promise<any> {
    return this.post('/clientes', data);
  }

  static async updateCliente(id: string, data: any): Promise<any> {
    return this.put(`/clientes/${id}`, data);
  }

  static async deleteCliente(id: string): Promise<any> {
    return this.delete(`/clientes/${id}`);
  }

  // Pets
  static async getPets(params?: {
    page?: number;
    size?: number;
    clienteId?: string;
    search?: string;
  }): Promise<PaginatedResponse<any>> {
    return this.get('/pets', params);
  }

  static async getPet(id: string): Promise<any> {
    return this.get(`/pets/${id}`);
  }

  static async createPet(data: any): Promise<any> {
    return this.post('/pets', data);
  }

  static async updatePet(id: string, data: any): Promise<any> {
    return this.put(`/pets/${id}`, data);
  }

  static async deletePet(id: string): Promise<any> {
    return this.delete(`/pets/${id}`);
  }

  // Agendamentos
  static async getAgendamentos(params?: {
    page?: number;
    size?: number;
    dataInicio?: string;
    dataFim?: string;
    status?: string;
  }): Promise<PaginatedResponse<any>> {
    return this.get('/agendamentos', params);
  }

  static async getAgendamento(id: string): Promise<any> {
    return this.get(`/agendamentos/${id}`);
  }

  static async createAgendamento(data: any): Promise<any> {
    return this.post('/agendamentos', data);
  }

  static async updateAgendamento(id: string, data: any): Promise<any> {
    return this.put(`/agendamentos/${id}`, data);
  }

  static async deleteAgendamento(id: string): Promise<any> {
    return this.delete(`/agendamentos/${id}`);
  }

  // Produtos
  static async getProdutos(params?: {
    page?: number;
    size?: number;
    search?: string;
    categoria?: string;
    status?: string;
  }): Promise<PaginatedResponse<any>> {
    return this.get('/produtos', params);
  }

  static async getProduto(id: string): Promise<any> {
    return this.get(`/produtos/${id}`);
  }

  static async createProduto(data: any): Promise<any> {
    return this.post('/produtos', data);
  }

  static async updateProduto(id: string, data: any): Promise<any> {
    return this.put(`/produtos/${id}`, data);
  }

  static async deleteProduto(id: string): Promise<any> {
    return this.delete(`/produtos/${id}`);
  }

  // Financeiro
  static async getTransacoesFinanceiras(params?: {
    page?: number;
    size?: number;
    dataInicio?: string;
    dataFim?: string;
    tipo?: string;
    status?: string;
  }): Promise<PaginatedResponse<any>> {
    return this.get('/financeiro/transacoes', params);
  }

  static async getResumoFinanceiro(params?: {
    dataInicio?: string;
    dataFim?: string;
  }): Promise<any> {
    return this.get('/financeiro/resumo', params);
  }

  static async getFaturas(params?: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<PaginatedResponse<any>> {
    return this.get('/financeiro/faturas', params);
  }

  // Configurações
  static async getConfiguracaoEmpresa(): Promise<any> {
    return this.get('/empresa/configuracoes');
  }

  static async updateConfiguracaoEmpresa(data: any): Promise<any> {
    return this.put('/empresa/configuracoes', data);
  }

  static async getUsuarios(params?: {
    page?: number;
    size?: number;
    search?: string;
  }): Promise<PaginatedResponse<any>> {
    return this.get('/usuarios', params);
  }

  static async createUsuario(data: any): Promise<any> {
    return this.post('/usuarios', data);
  }

  static async updateUsuario(id: string, data: any): Promise<any> {
    return this.put(`/usuarios/${id}`, data);
  }

  static async deleteUsuario(id: string): Promise<any> {
    return this.delete(`/usuarios/${id}`);
  }
}

// Exportar a instância do axios para uso direto quando necessário
export default api;

// Exportar funções utilitárias
export { clearAuthData, getToken, getTenantId };