import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const items = [
  { name: "Leite em Caixa", validade: "01/05/2024", dias: 3, status: "critico" },
  { name: "Arroz Integral", validade: "03/05/2024", dias: 5, status: "alerta" },
  { name: "Feijao Preto", validade: "05/05/2024", dias: 7, status: "alerta" },
  { name: "Macarrao Espaguete", validade: "06/05/2024", dias: 8, status: "proximo" },
  { name: "Oleo de Soja", validade: "08/05/2024", dias: 10, status: "proximo" },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "critico":
      return <Badge variant="destructive" className="text-xs">Critico</Badge>
    case "alerta":
      return <Badge className="bg-accent text-accent-foreground text-xs">Alerta</Badge>
    case "proximo":
      return <Badge variant="secondary" className="text-xs">Proximo</Badge>
    default:
      return null
  }
}

export function ExpirationTable() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-foreground">Validade Proxima (7 dias)</CardTitle>
        <CardDescription>Itens que vencem em breve</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left font-medium text-muted-foreground">Item</th>
                <th className="pb-3 text-left font-medium text-muted-foreground">Validade</th>
                <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.name} className="border-b border-border/50 last:border-0">
                  <td className="py-3 font-medium text-foreground">{item.name}</td>
                  <td className="py-3 text-muted-foreground">{item.validade}</td>
                  <td className="py-3">{getStatusBadge(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
