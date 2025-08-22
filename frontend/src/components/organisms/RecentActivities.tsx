"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge, StatusBadges } from "@/components/ui/enhanced-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ActivitySkeleton } from "@/components/ui/skeleton-enhanced"
import { CardError } from "@/components/ui/error-state"
import { ListEmpty } from "@/components/ui/empty-state-enhanced"
import { cn } from "@/lib/utils"
import { Calendar, Clock, User, PawPrint } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Activity {
  id: string
  type: "agendamento" | "pagamento" | "cliente" | "pet"
  title: string
  description: string
  timestamp: Date
  status?: "agendado" | "confirmado" | "cancelado" | "concluido" | "pendente" | "pago" | "vencido"
  user?: {
    name: string
    avatar?: string
  }
  metadata?: {
    clientName?: string
    petName?: string
    serviceName?: string
    amount?: number
  }
}

interface RecentActivitiesProps {
  activities: Activity[]
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  className?: string
}

/**
 * Componente para exibir atividades recentes no dashboard
 * Mostra agendamentos, pagamentos, novos clientes, etc.
 */
export function RecentActivities({ activities, isLoading = false, error, onRetry, className }: RecentActivitiesProps) {
  if (isLoading) {
    return (
      <Card className={cn("col-span-4", className)}>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivitySkeleton items={5} />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("col-span-4", className)}>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
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

  if (activities.length === 0) {
    return (
      <Card className={cn("col-span-4", className)}>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <ListEmpty 
            type="generic"
            title="Nenhuma atividade recente"
            description="Quando houver atividades, elas aparecerão aqui."
          />
        </CardContent>
      </Card>
    )
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case "agendamento":
        return Calendar
      case "pagamento":
        return Clock
      case "cliente":
        return User
      case "pet":
        return PawPrint
      default:
        return Clock
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case "agendamento":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20"
      case "pagamento":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20"
      case "cliente":
        return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20"
      case "pet":
        return "text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/20"
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20"
    }
  }

  const getStatusBadge = (type: Activity['type'], status?: string) => {
    if (!status) return null

    switch (type) {
      case "agendamento":
        return StatusBadges.agendamento[status as keyof typeof StatusBadges.agendamento]
      case "pagamento":
        return StatusBadges.pagamento[status as keyof typeof StatusBadges.pagamento]
      default:
        return null
    }
  }

  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type)
            const statusBadge = getStatusBadge(activity.type, activity.status)
            
            return (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                {/* Ícone da atividade */}
                <div className={cn("p-2 rounded-full", getActivityColor(activity.type))}>
                  <Icon className="h-4 w-4" />
                </div>
                
                {/* Conteúdo */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">
                      {activity.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {statusBadge && (
                        <Badge {...statusBadge} size="sm" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {format(activity.timestamp, "HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  
                  {/* Metadados */}
                  {activity.metadata && (
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      {activity.metadata.clientName && (
                        <span>Cliente: {activity.metadata.clientName}</span>
                      )}
                      {activity.metadata.petName && (
                        <span>Pet: {activity.metadata.petName}</span>
                      )}
                      {activity.metadata.serviceName && (
                        <span>Serviço: {activity.metadata.serviceName}</span>
                      )}
                      {activity.metadata.amount && (
                        <span className="font-medium text-green-600 dark:text-green-400">
                          R$ {activity.metadata.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Avatar do usuário */}
                {activity.user && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback className="text-xs">
                      {activity.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Função utilitária para gerar atividades de exemplo
 */
export function generateMockActivities(): Activity[] {
  const now = new Date()
  
  return [
    {
      id: "1",
      type: "agendamento",
      title: "Novo agendamento criado",
      description: "Consulta veterinária agendada",
      timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 min atrás
      status: "agendado",
      metadata: {
        clientName: "Maria Silva",
        petName: "Rex",
        serviceName: "Consulta"
      },
      user: {
        name: "Dr. João",
        avatar: "/avatars/dr-joao.jpg"
      }
    },
    {
      id: "2",
      type: "pagamento",
      title: "Pagamento recebido",
      description: "Pagamento de consulta processado",
      timestamp: new Date(now.getTime() - 15 * 60 * 1000), // 15 min atrás
      status: "pago",
      metadata: {
        clientName: "Ana Costa",
        amount: 150.00
      }
    },
    {
      id: "3",
      type: "cliente",
      title: "Novo cliente cadastrado",
      description: "Cliente adicionado ao sistema",
      timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 min atrás
      metadata: {
        clientName: "Pedro Santos"
      }
    },
    {
      id: "4",
      type: "pet",
      title: "Novo pet cadastrado",
      description: "Pet adicionado ao cliente",
      timestamp: new Date(now.getTime() - 45 * 60 * 1000), // 45 min atrás
      metadata: {
        clientName: "Pedro Santos",
        petName: "Bella"
      }
    },
    {
      id: "5",
      type: "agendamento",
      title: "Agendamento confirmado",
      description: "Cliente confirmou presença",
      timestamp: new Date(now.getTime() - 60 * 60 * 1000), // 1h atrás
      status: "confirmado",
      metadata: {
        clientName: "Carlos Lima",
        petName: "Mimi",
        serviceName: "Banho e Tosa"
      }
    }
  ]
}