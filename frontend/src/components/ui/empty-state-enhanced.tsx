import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Users, 
  Calendar, 
  Package, 
  FileText, 
  Heart, 
  DollarSign,
  Inbox,
  Filter
} from 'lucide-react';

interface EmptyStateProps {
  type?: 'clients' | 'pets' | 'appointments' | 'products' | 'invoices' | 'search' | 'filter' | 'generic';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const emptyStateConfigs = {
  clients: {
    icon: Users,
    title: 'Nenhum cliente cadastrado',
    description: 'Comece adicionando seu primeiro cliente para gerenciar pets e agendamentos.',
    actionText: 'Adicionar Cliente',
    color: 'text-blue-500'
  },
  pets: {
    icon: Heart,
    title: 'Nenhum pet cadastrado',
    description: 'Adicione pets para seus clientes e mantenha o histórico médico organizado.',
    actionText: 'Adicionar Pet',
    color: 'text-pink-500'
  },
  appointments: {
    icon: Calendar,
    title: 'Nenhum agendamento',
    description: 'Sua agenda está vazia. Que tal agendar uma consulta ou procedimento?',
    actionText: 'Novo Agendamento',
    color: 'text-green-500'
  },
  products: {
    icon: Package,
    title: 'Nenhum produto cadastrado',
    description: 'Adicione produtos ao seu estoque para controlar vendas e inventário.',
    actionText: 'Adicionar Produto',
    color: 'text-orange-500'
  },
  invoices: {
    icon: DollarSign,
    title: 'Nenhuma fatura encontrada',
    description: 'Não há faturas para o período selecionado.',
    actionText: 'Nova Fatura',
    color: 'text-emerald-500'
  },
  search: {
    icon: Search,
    title: 'Nenhum resultado encontrado',
    description: 'Tente ajustar os termos de busca ou filtros para encontrar o que procura.',
    actionText: 'Limpar Busca',
    color: 'text-gray-500'
  },
  filter: {
    icon: Filter,
    title: 'Nenhum item corresponde aos filtros',
    description: 'Tente ajustar ou remover alguns filtros para ver mais resultados.',
    actionText: 'Limpar Filtros',
    color: 'text-purple-500'
  },
  generic: {
    icon: Inbox,
    title: 'Nada por aqui',
    description: 'Não há itens para exibir no momento.',
    actionText: 'Atualizar',
    color: 'text-gray-500'
  }
};

const sizeClasses = {
  sm: {
    container: 'p-4',
    icon: 'w-12 h-12',
    iconContainer: 'w-16 h-16',
    title: 'text-base',
    description: 'text-sm',
    spacing: 'space-y-2'
  },
  md: {
    container: 'p-8',
    icon: 'w-16 h-16',
    iconContainer: 'w-20 h-20',
    title: 'text-lg',
    description: 'text-sm',
    spacing: 'space-y-4'
  },
  lg: {
    container: 'p-12',
    icon: 'w-20 h-20',
    iconContainer: 'w-24 h-24',
    title: 'text-xl',
    description: 'text-base',
    spacing: 'space-y-6'
  }
};

export function EmptyState({
  type = 'generic',
  title,
  description,
  actionText,
  onAction,
  className,
  showIcon = true,
  size = 'md'
}: EmptyStateProps) {
  const config = emptyStateConfigs[type];
  const sizeConfig = sizeClasses[size];
  const Icon = config.icon;
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      sizeConfig.container,
      sizeConfig.spacing,
      className
    )}>
      {showIcon && (
        <div className={cn(
          "rounded-full bg-muted/50 flex items-center justify-center mb-2",
          sizeConfig.iconContainer
        )}>
          <Icon className={cn(
            sizeConfig.icon,
            config.color
          )} />
        </div>
      )}
      
      <div className={cn("space-y-2", size === 'sm' ? 'max-w-xs' : 'max-w-md')}>
        <h3 className={cn(
          "font-semibold text-foreground",
          sizeConfig.title
        )}>
          {title || config.title}
        </h3>
        <p className={cn(
          "text-muted-foreground",
          sizeConfig.description
        )}>
          {description || config.description}
        </p>
      </div>
      
      {onAction && (
        <Button 
          onClick={onAction}
          className="mt-4"
          size={size === 'sm' ? 'sm' : 'default'}
        >
          <Plus className="w-4 h-4 mr-2" />
          {actionText || config.actionText}
        </Button>
      )}
    </div>
  );
}

// Componente de estado vazio para páginas inteiras
export function PageEmpty({ 
  type = 'generic',
  onAction,
  className 
}: {
  type?: EmptyStateProps['type'];
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn(
      "flex items-center justify-center min-h-[400px] w-full",
      className
    )}>
      <EmptyState 
        type={type}
        onAction={onAction}
        size="lg"
      />
    </div>
  );
}

// Componente de estado vazio para cards
export function CardEmpty({ 
  type = 'generic',
  onAction,
  className 
}: {
  type?: EmptyStateProps['type'];
  onAction?: () => void;
  className?: string;
}) {
  return (
    <EmptyState 
      type={type}
      onAction={onAction}
      size="sm"
      className={className}
    />
  );
}

// Componente de estado vazio para tabelas
export function TableEmpty({ 
  type = 'search',
  onAction,
  className 
}: {
  type?: EmptyStateProps['type'];
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn(
      "flex items-center justify-center py-12",
      className
    )}>
      <EmptyState 
        type={type}
        onAction={onAction}
        size="md"
        showIcon={false}
      />
    </div>
  );
}

// Componente de estado vazio para listas
export function ListEmpty({ 
  type = 'generic',
  title,
  description,
  onAction,
  actionText,
  className 
}: {
  type?: EmptyStateProps['type'];
  title?: string;
  description?: string;
  onAction?: () => void;
  actionText?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-8 px-4",
      className
    )}>
      <EmptyState 
        type={type}
        title={title}
        description={description}
        onAction={onAction}
        actionText={actionText}
        size="sm"
      />
    </div>
  );
}