import { Package, TrendingUp, TrendingDown, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Total em Estoque",
    value: "8.250",
    unit: "kg",
    change: "+12%",
    trend: "up" as const,
    icon: Package,
    description: "vs. mes anterior",
  },
  {
    title: "Entradas da Semana",
    value: "1.200",
    unit: "kg",
    change: "+8%",
    trend: "up" as const,
    icon: TrendingUp,
    description: "vs. semana anterior",
  },
  {
    title: "Saidas da Semana",
    value: "980",
    unit: "kg",
    change: "+15%",
    trend: "up" as const,
    icon: TrendingDown,
    description: "vs. semana anterior",
  },
  {
    title: "Alertas de Validade",
    value: "5",
    unit: "itens",
    change: "-2",
    trend: "down" as const,
    icon: AlertTriangle,
    description: "vs. semana anterior",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/60">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.unit}</span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-primary" />
              )}
              <span className="text-xs font-medium text-primary">{stat.change}</span>
              <span className="text-xs text-muted-foreground">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
