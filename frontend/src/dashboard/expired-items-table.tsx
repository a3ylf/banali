import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const items = [
  { name: "Iogurte Natural", vencimento: "25/04/2024", quantidade: "15 un" },
  { name: "Macarrao Instantaneo", vencimento: "23/04/2024", quantidade: "30 un" },
  { name: "Pao de Forma", vencimento: "20/04/2024", quantidade: "8 un" },
  { name: "Leite em Po", vencimento: "18/04/2024", quantidade: "12 un" },
]

export function ExpiredItemsTable() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-foreground">Itens Vencidos</CardTitle>
        <CardDescription>Alimentos que ja passaram da validade</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left font-medium text-muted-foreground">Item</th>
                <th className="pb-3 text-left font-medium text-muted-foreground">Vencimento</th>
                <th className="pb-3 text-left font-medium text-muted-foreground">Qtd</th>
                <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.name} className="border-b border-border/50 last:border-0">
                  <td className="py-3 font-medium text-foreground">{item.name}</td>
                  <td className="py-3 text-muted-foreground">{item.vencimento}</td>
                  <td className="py-3 text-muted-foreground">{item.quantidade}</td>
                  <td className="py-3">
                    <Badge variant="destructive" className="text-xs">Vencido</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
