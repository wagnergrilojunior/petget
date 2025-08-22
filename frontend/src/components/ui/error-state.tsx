import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  RefreshCw, 
  Wifi, 
  Server, 
  ShieldAlert,
  FileX,
  Clock
} from 'lucide-react';

interface ErrorStateProps {
  type?: 'network' | 'server' | 'permission' | 'notFound' | 'timeout' | 'generic';
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
  showIcon?: boolean;
}

const errorConfigs = {
  network: {
    icon: Wifi,
    title: 'Problema de Conexão',
    description: 'Verifique sua conexão com a internet e tente novamente.',
    color: 'text-orange-500'
  },
  server: {
    icon: Server,
    title: 'Erro no Servidor',
    description: 'Nossos servidores estão temporariamente indisponíveis.',
    color: 'text-red-500'
  },
  permission: {
    icon: ShieldAlert,
    title: 'Acesso Negado',
    description: 'Você não tem permissão para acessar este recurso.',
    color: 'text-yellow-500'
  },
  notFound: {
    icon: FileX,
    title: 'Não Encontrado',
    description: 'O recurso que você está procurando não foi encontrado.',
    color: 'text-gray-500'
  },
  timeout: {
    icon: Clock,
    title: 'Tempo Esgotado',
    description: 'A operação demorou mais que o esperado.',
    color: 'text-blue-500'
  },
  generic: {
    icon: AlertTriangle,
    title: 'Algo deu errado',
    description: 'Ocorreu um erro inesperado. Tente novamente.',
    color: 'text-destructive'
  }
};

export function ErrorState({
  type = 'generic',
  title,
  description,
  onRetry,
  retryText = 'Tentar Novamente',
  className,
  showIcon = true
}: ErrorStateProps) {
  const config = errorConfigs[type];
  const Icon = config.icon;
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center space-y-4",
      className
    )}>
      {showIcon && (
        <div className={cn(
          "w-16 h-16 rounded-full bg-muted flex items-center justify-center",
          config.color
        )}>
          <Icon className="w-8 h-8" />
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          {title || config.title}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {description || config.description}
        </p>
      </div>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="mt-4"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {retryText}
        </Button>
      )}
    </div>
  );
}

// Componente de erro para páginas inteiras
export function PageError({ 
  type = 'generic',
  onRetry,
  className 
}: {
  type?: ErrorStateProps['type'];
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn(
      "flex items-center justify-center min-h-[400px] w-full",
      className
    )}>
      <ErrorState 
        type={type}
        onRetry={onRetry}
      />
    </div>
  );
}

// Componente de erro para cards
export function CardError({ 
  type = 'generic',
  onRetry,
  className 
}: {
  type?: ErrorStateProps['type'];
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-6 text-center",
      className
    )}>
      <ErrorState 
        type={type}
        onRetry={onRetry}
        showIcon={false}
      />
    </div>
  );
}

// Componente de erro inline
export function InlineError({ 
  message,
  onRetry,
  className 
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn(
      "flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 rounded-lg",
      className
    )}>
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-destructive" />
        <span className="text-sm text-destructive">{message}</span>
      </div>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          <RefreshCw className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}