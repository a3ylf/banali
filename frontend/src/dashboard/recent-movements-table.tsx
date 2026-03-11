import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

const movements = [
  { item: "Arroz Tipo 1", tipo: "entrada", quantidade: "200 kg", data: "28/04/2024", origem: "Doacao - Supermercado BH" },
  { item: "Feijao Carioca", tipo: "saida", quantidade: "50 kg", data: "28/04/2024", origem: "Distribuicao - Comunidade Sol" },
  { item: "Leite UHT", tipo: "entrada", quantidade: "100 un", data: "27/04/2024", origem: "Doacao - Laticinios Minas" },
  { item: "Oleo de Soja", tipo: "saida", quantidade: "30 un", data: "27/04/2024", origem: "Distribuicao - Lar dos Idosos" },
  { item: "Macarrao", tipo: "entrada", quantidade: "80 kg", data: "26/04/2024", origem: "Doacao - Campanha Solidaria" },
]

export function RecentMovementsTable() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-foreground">Movimentacoes Recentes</CardTitle>
        <CardDescription>Ultimas entradas e saidas registradas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left font-medium text-muted-foreground">Item</th>
                <th className="pb-3 text-left font-medium text-muted-foreground">Tipo</th>
                <th className="pb-3 text-left font-medium text-muted-foreground">Qtd</th>
                <th className="hidden pb-3 text-left font-medium text-muted-foreground md:table-cell">Origem/Destino</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((mov, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-3 font-medium text-foreground">{mov.item}</td>
                  <td className="py-3">
                    {mov.tipo === "entrada" ? (
                      <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary text-xs">
                        <ArrowDownRight className="h-3 w-3" />
                        Entrada
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1 bg-accent/20 text-accent-foreground text-xs">
                        <ArrowUpRight className="h-3 w-3" />
                        Saida
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 text-muted-foreground">{mov.quantidade}</td>
                  <td className="hidden py-3 text-muted-foreground md:table-cell">{mov.origem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
