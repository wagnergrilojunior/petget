import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400",
        warning: "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
        info: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
        purple: "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400",
        pink: "border-transparent bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900/20 dark:text-pink-400",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge melhorado com mais variantes de cores e tamanhos
 * Ideal para status, categorias e labels
 */
function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

/**
 * Badges pré-configurados para o PetGet
 */
export const StatusBadges = {
  agendamento: {
    agendado: { variant: "info" as const, children: "Agendado" },
    confirmado: { variant: "success" as const, children: "Confirmado" },
    cancelado: { variant: "destructive" as const, children: "Cancelado" },
    concluido: { variant: "success" as const, children: "Concluído" },
    pendente: { variant: "warning" as const, children: "Pendente" },
  },
  pagamento: {
    pago: { variant: "success" as const, children: "Pago" },
    pendente: { variant: "warning" as const, children: "Pendente" },
    vencido: { variant: "destructive" as const, children: "Vencido" },
    cancelado: { variant: "destructive" as const, children: "Cancelado" },
  },
  produto: {
    disponivel: { variant: "success" as const, children: "Disponível" },
    baixoEstoque: { variant: "warning" as const, children: "Baixo Estoque" },
    semEstoque: { variant: "destructive" as const, children: "Sem Estoque" },
  },
  servico: {
    consulta: { variant: "info" as const, children: "Consulta" },
    vacina: { variant: "success" as const, children: "Vacina" },
    cirurgia: { variant: "purple" as const, children: "Cirurgia" },
    banho: { variant: "pink" as const, children: "Banho & Tosa" },
    emergencia: { variant: "destructive" as const, children: "Emergência" },
  }
}

export { Badge, badgeVariants }