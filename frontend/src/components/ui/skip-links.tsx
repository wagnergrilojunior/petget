'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkipLinksProps {
  className?: string;
}

/**
 * Componente de links de navegação rápida para acessibilidade
 * Permite que usuários de teclado pulem diretamente para o conteúdo principal
 */
export function SkipLinks({ className }: SkipLinksProps) {
  return (
    <div className={cn('sr-only focus-within:not-sr-only', className)}>
      <a 
        href="#main-content" 
        className="skip-link"
        tabIndex={1}
      >
        Pular para o conteúdo principal
      </a>
      <a 
        href="#main-navigation" 
        className="skip-link"
        tabIndex={2}
      >
        Pular para a navegação
      </a>
      <a 
        href="#search" 
        className="skip-link"
        tabIndex={3}
      >
        Pular para a busca
      </a>
    </div>
  );
}

/**
 * Hook para gerenciar foco programático
 * Útil para direcionar foco após ações do usuário
 */
export function useFocusManagement() {
  const focusElement = React.useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      // Scroll suave para o elemento se necessário
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, []);

  const focusFirstError = React.useCallback(() => {
    const firstError = document.querySelector('[aria-invalid="true"]') as HTMLElement;
    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, []);

  const announceLiveRegion = React.useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = message;
    
    document.body.appendChild(liveRegion);
    
    // Remove após 1 segundo
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  }, []);

  return {
    focusElement,
    focusFirstError,
    announceLiveRegion
  };
}

/**
 * Componente de região live para anúncios dinâmicos
 * Usado para comunicar mudanças de estado para leitores de tela
 */
interface LiveRegionProps {
  message?: string;
  priority?: 'polite' | 'assertive';
  className?: string;
}

export function LiveRegion({ 
  message, 
  priority = 'polite', 
  className 
}: LiveRegionProps) {
  return (
    <div 
      aria-live={priority}
      aria-atomic="true"
      className={cn('sr-only', className)}
    >
      {message}
    </div>
  );
}

/**
 * Componente para indicar carregamento de forma acessível
 */
interface AccessibleLoadingProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
}

export function AccessibleLoading({ 
  isLoading, 
  loadingText = 'Carregando...', 
  children, 
  className 
}: AccessibleLoadingProps) {
  return (
    <div className={className}>
      {isLoading && (
        <LiveRegion 
          message={loadingText} 
          priority="polite" 
        />
      )}
      <div aria-busy={isLoading} aria-live="polite">
        {children}
      </div>
    </div>
  );
}