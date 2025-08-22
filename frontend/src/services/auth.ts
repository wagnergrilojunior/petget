import axios, { AxiosResponse } from 'axios';

// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
console.log('🔧 AuthService - API_BASE_URL:', API_BASE_URL);

// Tipos para autenticação
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface UserInfo {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  tenantId: string;
  empresaNome: string | null;
  ultimoLogin: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    console.log('🔍 Axios Request - URL:', config.url);
    console.log('🔍 Axios Request - baseURL:', config.baseURL);
    console.log('🔍 Axios Request - Full URL:', `${config.baseURL}${config.url}`);
    // Só adiciona headers se estivermos no cliente
    if (typeof window !== 'undefined') {
      const token = AuthService.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      const tenantId = AuthService.getTenantId();
      if (tenantId) {
        config.headers['X-Tenant-Id'] = tenantId;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e renovar token automaticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = AuthService.getRefreshToken();
        if (refreshToken) {
          const response = await AuthService.refreshToken({ refreshToken });
          AuthService.setTokens(response.accessToken, refreshToken);
          
          // Retry da requisição original
          originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
          return api(originalRequest);
        }
      } catch {
        AuthService.logout();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Serviço de autenticação para gerenciar login, logout e tokens JWT
 */
export class AuthService {
  static async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await api.get('/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
  private static readonly ACCESS_TOKEN_KEY = 'petget_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'petget_refresh_token';
  private static readonly USER_INFO_KEY = 'petget_user_info';
  
  /**
   * Realiza o login do usuário
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('🚀 AuthService.login - Iniciando login...');
      console.log('🚀 AuthService.login - API_BASE_URL:', API_BASE_URL);
      console.log('🚀 AuthService.login - URL completa:', `${API_BASE_URL}/auth/login`);
      console.log('🚀 AuthService.login - Credenciais:', { email: credentials.email, senha: '***' });
      
      console.log('🚀 AuthService.login - Fazendo requisição POST...');
      const response: AxiosResponse<LoginResponse> = await api.post('/auth/login', credentials);
      
      console.log('🚀 AuthService.login - Resposta recebida:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data ? 'Dados recebidos' : 'Sem dados'
      });
      
      const { accessToken, refreshToken, user } = response.data;
      
      // Armazena tokens e informações do usuário
      this.setTokens(accessToken, refreshToken);
      this.setUserInfo(user);
      
      console.log('🚀 AuthService.login - Login realizado com sucesso!');
      return response.data;
    } catch (error: unknown) {
      console.error('❌ AuthService.login - Erro no login:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('❌ AuthService.login - Detalhes do erro:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          url: axiosError.config?.url,
          method: axiosError.config?.method
        });
      }
      
      const errorMessage = error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? String(error.response.data.message)
        : 'Erro ao fazer login';
      throw new Error(errorMessage);
    }
  }
  
  /**
   * Renova o token de acesso
   */
  static async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const response: AxiosResponse<RefreshTokenResponse> = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        request
      );
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? String(error.response.data.message)
        : 'Erro ao renovar token';
      throw new Error(errorMessage);
    }
  }
  
  /**
   * Realiza o logout do usuário
   */
  static async logout(): Promise<void> {
    try {
      const token = this.getAccessToken();
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      this.clearStorage();
    }
  }
  
  /**
   * Valida se o token é válido
   */
  static async validateToken(): Promise<boolean> {
    try {
      const token = this.getAccessToken();
      if (!token) return false;
      
      const response = await api.get('/auth/validate');
      return response.status === 200;
    } catch {
      return false;
    }
  }
  
  /**
   * Verifica se o usuário está autenticado
   */
  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const userInfo = this.getUserInfo();
    return !!(token && userInfo);
  }
  
  /**
   * Obtém o token de acesso
   */
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
  
  /**
   * Obtém o refresh token
   */
  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
  
  /**
   * Obtém as informações do usuário
   */
  static getUserInfo(): UserInfo | null {
    if (typeof window === 'undefined') return null;
    const userInfo = localStorage.getItem(this.USER_INFO_KEY);
    if (!userInfo || userInfo === 'undefined' || userInfo === 'null') {
      return null;
    }
    try {
      return JSON.parse(userInfo);
    } catch (error) {
      console.error('🔥 AuthService - Erro ao fazer parse do userInfo:', error);
      // Limpa o valor inválido do localStorage
      localStorage.removeItem(this.USER_INFO_KEY);
      return null;
    }
  }
  
  /**
   * Obtém o tenant ID do usuário
   */
  static getTenantId(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo?.tenantId || null;
  }
  
  /**
   * Armazena os tokens
   */
  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }
  
  /**
   * Armazena as informações do usuário
   */
  static setUserInfo(userInfo: UserInfo): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
  }
  
  /**
   * Limpa o armazenamento local
   */
  static clearStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
  }

  /**
   * Debug: Mostra informações do token e localStorage
   */
  static debugTokenInfo(): void {
    if (typeof window === 'undefined') return;
    
    const token = this.getAccessToken();
    const userInfo = this.getUserInfo();
    
    console.log('=== DEBUG TOKEN INFO ===');
    console.log('Token:', token ? token.substring(0, 50) + '...' : 'null');
    console.log('UserInfo:', userInfo);
    console.log('TenantId from localStorage:', userInfo?.tenantId);
    
    if (token) {
      try {
        // Decodifica o payload do JWT (sem validação)
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('Token tenantId:', payload.tenantId);
      } catch (e) {
        console.error('Erro ao decodificar token:', e);
      }
    }
    console.log('========================');
  }

  /**
   * Força logout e limpeza completa
   */
  static forceLogout(): void {
    console.log('Forçando logout e limpeza...');
    this.clearStorage();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

// Exporta a instância configurada do axios
export { api };