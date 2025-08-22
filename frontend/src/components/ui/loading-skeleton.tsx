import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "text" | "avatar" | "button"
  lines?: number
}

/**
 * Componente de skeleton para estados de carregamento
 * Suporta diferentes variantes para diferentes tipos de conteúdo
 */
function Skeleton({
  className,
  variant = "default",
  lines = 1,
  ...props
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-muted rounded-md"
  
  const variants = {
    default: "h-4 w-full",
    card: "h-32 w-full",
    text: "h-4",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24"
  }

  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              variants.text,
              i === lines - 1 ? "w-3/4" : "w-full",
              className
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(baseClasses, variants[variant], className)}
      {...props}
    />
  )
}

/**
 * Skeleton para cards de KPI do dashboard
 */
function KPISkeleton() {
  return (
    <div className="p-6 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-20" />
        <Skeleton variant="avatar" className="h-8 w-8" />
      </div>
      <Skeleton variant="text" className="w-16 h-8" />
      <Skeleton variant="text" className="w-24 h-4" />
    </div>
  )
}

/**
 * Skeleton para tabelas
 */
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex space-x-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton para gráficos
 */
function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export { Skeleton, KPISkeleton, TableSkeleton, ChartSkeleton }
export type { SkeletonProps }