import { Package, ArrowRightLeft, AlertTriangle, BarChart3, Tag, Users } from "lucide-react"

const features = [
  {
    icon: Package,
    title: "Controle de Estoque",
    description: "Gerencie todos os alimentos do seu banco com informacoes detalhadas de quantidade, categoria e validade.",
  },
  {
    icon: ArrowRightLeft,
    title: "Movimentacoes",
    description: "Registre entradas e saidas de alimentos com rastreabilidade completa e historico detalhado.",
  },
  {
    icon: AlertTriangle,
    title: "Alertas de Validade",
    description: "Receba alertas automaticos para itens proximos ao vencimento e evite desperdicio de alimentos.",
  },
  {
    icon: BarChart3,
    title: "Relatorios",
    description: "Gere relatorios completos de movimentacoes, estoque e distribuicao por categoria.",
  },
  {
    icon: Tag,
    title: "Categorias",
    description: "Organize seus alimentos em categorias personalizadas como graos, enlatados, pereciveis e mais.",
  },
  {
    icon: Users,
    title: "Operadores",
    description: "Controle de acesso para multiplos operadores com diferentes niveis de permissao.",
  },
]

export function FeaturesSection() {
  return (
    <section id="funcionalidades" className="border-t border-border/60 bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Funcionalidades
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tudo que voce precisa para gerir seu banco de alimentos
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Uma plataforma completa e intuitiva, pensada especialmente para as necessidades de organizacoes sociais.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border/60 bg-background p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
