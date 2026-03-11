"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Graos", value: 35, color: "oklch(0.52 0.14 145)" },
  { name: "Enlatados", value: 25, color: "oklch(0.72 0.16 55)" },
  { name: "Pereciveis", value: 20, color: "oklch(0.60 0.10 30)" },
  { name: "Laticinios", value: 12, color: "oklch(0.65 0.12 180)" },
  { name: "Outros", value: 8, color: "oklch(0.55 0.08 280)" },
]

export function CategoryDistributionChart() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-foreground">Distribuicao por Categoria</CardTitle>
        <CardDescription>Percentual do estoque total</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.91 0.01 90)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground">{item.name} {item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
