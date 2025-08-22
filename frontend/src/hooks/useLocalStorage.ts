'use client';

import { useState, useEffect } from 'react';
import { UserInfo } from '@/services/auth';

// Hook para gerenciar localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error: unknown) {
        console.error(`Erro ao ler localStorage key "${key}":`, error);
      }
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error: unknown) {
      console.error(`Erro ao salvar no localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error: unknown) {
      console.error(`Erro ao remover localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
}

// Hook para gerenciar autenticação
export function useAuthState() {
  const [token, setToken, removeToken] = useLocalStorage<string | null>('token', null);
  const [user, setUser, removeUser] = useLocalStorage<UserInfo | null>('user', null);
  const [tenantId, setTenantId, removeTenantId] = useLocalStorage<string | null>('tenantId', null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated = mounted && !!token && !!user;

  const clearAuth = () => {
    removeToken();
    removeUser();
    removeTenantId();
  };

  const setAuthData = (authToken: string, userData: UserInfo, userTenantId: string) => {
    setToken(authToken);
    setUser(userData);
    setTenantId(userTenantId);
  };

  return {
    token,
    user,
    tenantId,
    isAuthenticated,
    setAuthData,
    clearAuth,
  };
}