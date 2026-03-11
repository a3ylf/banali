"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { mes: "Jan", estoque: 5200 },
  { mes: "Fev", estoque: 5800 },
  { mes: "Mar", estoque: 6100 },
  { mes: "Abr", estoque: 5900 },
  { mes: "Mai", estoque: 7200 },
  { mes: "Jun", estoque: 7800 },
  { mes: "Jul", estoque: 7500 },
  { mes: "Ago", estoque: 8100 },
  { mes: "Set", estoque: 8250 },
]

export function MonthlyOverviewChart() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-foreground">Evolucao do Estoque</CardTitle>
        <CardDescription>Total em kg nos ultimos 9 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.52 0.14 145)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="oklch(0.52 0.14 145)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="mes" className="text-xs" tick={{ fill: "oklch(0.50 0.02 60)" }} />
              <YAxis className="text-xs" tick={{ fill: "oklch(0.50 0.02 60)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.91 0.01 90)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                formatter={(value: number) => [`${value.toLocaleString("pt-BR")} kg`, "Estoque"]}
              />
              <Area
                type="monotone"
                dataKey="estoque"
                stroke="oklch(0.52 0.14 145)"
                strokeWidth={2}
                fill="url(#stockGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
