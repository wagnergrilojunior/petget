import axios, { AxiosResponse } from 'axios';

// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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
  userInfo: UserInfo;
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
    const token = AuthService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    const tenantId = AuthService.getTenantId();
    if (tenantId) {
      config.headers['X-Tenant-Id'] = tenantId;
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
  private static readonly ACCESS_TOKEN_KEY = 'petget_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'petget_refresh_token';
  private static readonly USER_INFO_KEY = 'petget_user_info';
  
  /**
   * Realiza o login do usuário
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post('/auth/login', credentials);
      const { accessToken, refreshToken, userInfo } = response.data;
      
      // Armazena tokens e informações do usuário
      this.setTokens(accessToken, refreshToken);
      this.setUserInfo(userInfo);
      
      return response.data;
    } catch (error: unknown) {
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
    return userInfo ? JSON.parse(userInfo) : null;
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
}

// Exporta a instância configurada do axios
export { api };