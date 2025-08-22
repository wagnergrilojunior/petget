import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary"
  }
  className?: string
}

/**
 * Componente para exibir estados vazios de forma elegante
 * Usado quando não há dados para mostrar em listas, tabelas, etc.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      {Icon && (
        <div className="mb-4 p-3 rounded-full bg-muted">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
      )}
      
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || "default"}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

/**
 * Estados vazios pré-configurados para o PetGet
 */
export const EmptyStates = {
  clientes: {
    title: "Nenhum cliente encontrado",
    description: "Comece cadastrando seu primeiro cliente para gerenciar pets e agendamentos."
  },
  pets: {
    title: "Nenhum pet cadastrado",
    description: "Adicione pets aos seus clientes para começar a agendar serviços."
  },
  agendamentos: {
    title: "Nenhum agendamento hoje",
    description: "Sua agenda está livre! Que tal aproveitar para organizar outras tarefas?"
  },
  produtos: {
    title: "Nenhum produto encontrado",
    description: "Cadastre produtos para controlar seu estoque e vendas."
  },
  financeiro: {
    title: "Nenhuma movimentação financeira",
    description: "Quando houver receitas ou despesas, elas aparecerão aqui."
  },
  search: {
    title: "Nenhum resultado encontrado",
    description: "Tente ajustar os filtros ou usar termos diferentes na busca."
  }
}