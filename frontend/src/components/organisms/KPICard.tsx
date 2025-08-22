"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/enhanced-badge"
import { KPISkeleton } from "@/components/ui/skeleton-enhanced"
import { CardError } from "@/components/ui/error-state"
import { cn } from "@/lib/utils"
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    type: "up" | "down" | "neutral"
  }
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  className?: string
}

/**
 * Componente de cartão KPI para o dashboard
 * Exibe métricas importantes com ícones, tendências e estados de loading
 */
export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  isLoading = false,
  error,
  onRetry,
  className
}: KPICardProps) {
  if (isLoading) {
    return (
      <Card className={cn("relative overflow-hidden", className)}>
        <KPISkeleton />
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("relative overflow-hidden", className)}>
        <CardError 
          type="generic"
          onRetry={onRetry}
        />
      </Card>
    )
  }

  const getTrendIcon = () => {
    switch (trend?.type) {
      case "up":
        return TrendingUp
      case "down":
        return TrendingDown
      default:
        return Minus
    }
  }

  const getTrendColor = () => {
    switch (trend?.type) {
      case "up":
        return "text-green-600 dark:text-green-400"
      case "down":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  const TrendIcon = getTrendIcon()

  return (
    <Card className={cn("relative overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-foreground">
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          </div>
          
          <div className="flex items-center justify-between">
            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
            
            {trend && (
              <div className={cn("flex items-center space-x-1 text-xs", getTrendColor())}>
                <TrendIcon className="h-3 w-3" />
                <span className="font-medium">
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </span>
                <span className="text-muted-foreground">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Gradiente decorativo */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
    </Card>
  )
}

/**
 * KPIs pré-configurados para o PetGet
 */
export const PetGetKPIs = {
  faturamento: {
    title: "Faturamento",
    subtitle: "Este mês",
    format: (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  },
  clientes: {
    title: "Clientes Ativos",
    subtitle: "Total cadastrados",
    format: (value: number) => value.toString()
  },
  pets: {
    title: "Pets Cadastrados",
    subtitle: "Total no sistema",
    format: (value: number) => value.toString()
  },
  agendamentos: {
    title: "Agendamentos",
    subtitle: "Hoje",
    format: (value: number) => value.toString()
  },
  pendentes: {
    title: "Pendências",
    subtitle: "Requer atenção",
    format: (value: number) => value.toString()
  }
}