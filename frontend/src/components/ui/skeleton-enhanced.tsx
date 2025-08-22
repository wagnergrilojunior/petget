import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonProps {
  className?: string;
}

// Skeleton para cards de KPI
export function KPISkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("p-6 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

// Skeleton para gráficos
export function ChartSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("p-6 space-y-4", className)}>
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-2 w-8" />
            <Skeleton className={`h-6 w-${Math.floor(Math.random() * 40) + 20}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton para tabelas
export function TableSkeleton({ 
  rows = 5,
  columns = 4,
  className 
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex space-x-4 p-4 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 p-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className={cn(
                "h-4 flex-1",
                colIndex === 0 ? "w-8 h-8 rounded-full flex-none" : "" // Avatar na primeira coluna
              )} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Skeleton para lista de atividades
export function ActivitySkeleton({ 
  items = 5,
  className 
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-start space-x-3 p-3">
          <Skeleton className="h-8 w-8 rounded-full flex-none" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton para formulários
export function FormSkeleton({ 
  fields = 4,
  className 
}: {
  fields?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex space-x-3 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}

// Skeleton para cards de produto/serviço
export function ProductCardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("p-4 space-y-3", className)}>
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

// Skeleton para perfil de usuário
export function ProfileSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("flex items-center space-x-4 p-4", className)}>
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

// Skeleton para dashboard completo
export function DashboardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg">
            <KPISkeleton />
          </div>
        ))}
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-lg">
          <ChartSkeleton />
        </div>
        <div className="border rounded-lg">
          <ChartSkeleton />
        </div>
      </div>
      
      {/* Atividades */}
      <div className="border rounded-lg p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <ActivitySkeleton />
        </div>
      </div>
    </div>
  );
}