"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartSkeleton } from "@/components/ui/skeleton-enhanced"
import { CardError } from "@/components/ui/error-state"
import { cn } from "@/lib/utils"

// Cores do tema PetGet para gráficos
const CHART_COLORS = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  tertiary: "hsl(var(--chart-3))",
  quaternary: "hsl(var(--chart-4))",
  quinary: "hsl(var(--chart-5))"
}

const PIE_COLORS = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary, CHART_COLORS.quaternary, CHART_COLORS.quinary]

interface LineChartData {
  name: string
  value: number
  [key: string]: any
}

interface PieChartData {
  name: string
  value: number
  color?: string
}

interface RevenueLineChartProps {
  data: LineChartData[]
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  className?: string
}

/**
 * Gráfico de linha para faturamento ao longo do tempo
 */
export function RevenueLineChart({ data, isLoading = false, error, onRetry, className }: RevenueLineChartProps) {
  if (isLoading) {
    return (
      <Card className={cn("col-span-4", className)}>
        <CardHeader>
          <CardTitle>Faturamento dos Últimos 30 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("col-span-4", className)}>
        <CardHeader>
          <CardTitle>Faturamento dos Últimos 30 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          <CardError 
            type="generic"
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader>
        <CardTitle>Faturamento dos Últimos 30 Dias</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))'
              }}
              formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Faturamento']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: CHART_COLORS.primary, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface ServicesPieChartProps {
  data: PieChartData[]
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  className?: string
}

/**
 * Gráfico de pizza para distribuição de serviços
 */
export function ServicesPieChart({ data, isLoading = false, error, onRetry, className }: ServicesPieChartProps) {
  if (isLoading) {
    return (
      <Card className={cn("col-span-2", className)}>
        <CardHeader>
          <CardTitle>Serviços Mais Realizados</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("col-span-2", className)}>
        <CardHeader>
          <CardTitle>Serviços Mais Realizados</CardTitle>
        </CardHeader>
        <CardContent>
          <CardError 
            type="generic"
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("col-span-2", className)}>
      <CardHeader>
        <CardTitle>Serviços Mais Realizados</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))'
              }}
              formatter={(value: number, name: string) => [value, name]}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface RevenuePieChartProps {
  data: PieChartData[]
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  className?: string
}

/**
 * Gráfico de pizza para distribuição de receita por categoria
 */
export function RevenuePieChart({ data, isLoading = false, error, onRetry, className }: RevenuePieChartProps) {
  if (isLoading) {
    return (
      <Card className={cn("col-span-2", className)}>
        <CardHeader>
          <CardTitle>Receita por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("col-span-2", className)}>
        <CardHeader>
          <CardTitle>Receita por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <CardError 
            type="generic"
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("col-span-2", className)}>
      <CardHeader>
        <CardTitle>Receita por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))'
              }}
              formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Receita']}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}