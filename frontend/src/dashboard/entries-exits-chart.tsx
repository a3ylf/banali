"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { semana: "Sem 1", entradas: 950, saidas: 720 },
  { semana: "Sem 2", entradas: 1100, saidas: 850 },
  { semana: "Sem 3", entradas: 800, saidas: 900 },
  { semana: "Sem 4", entradas: 1300, saidas: 780 },
  { semana: "Sem 5", entradas: 1050, saidas: 920 },
  { semana: "Sem 6", entradas: 1200, saidas: 980 },
]

export function EntriesExitsChart() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-foreground">Entradas vs Saidas</CardTitle>
        <CardDescription>Ultimas 6 semanas (em kg)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="semana" className="text-xs" tick={{ fill: "oklch(0.50 0.02 60)" }} />
              <YAxis className="text-xs" tick={{ fill: "oklch(0.50 0.02 60)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.91 0.01 90)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              />
              <Legend />
              <Bar dataKey="entradas" name="Entradas" fill="oklch(0.52 0.14 145)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saidas" name="Saidas" fill="oklch(0.72 0.16 55)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
