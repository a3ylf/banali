import { UserPlus, PackagePlus, BarChart3 } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Crie sua conta",
    description: "Cadastre sua ONG em poucos minutos. O processo e simples e gratuito para organizacoes sociais.",
  },
  {
    number: "02",
    icon: PackagePlus,
    title: "Cadastre seu estoque",
    description: "Adicione os alimentos do seu banco com categorias, quantidades e datas de validade.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Gerencie e acompanhe",
    description: "Registre movimentacoes, receba alertas automaticos e gere relatorios para tomada de decisao.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="border-t border-border/60 bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Como Funciona
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Comece a usar em 3 passos simples
          </h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary/60">
                Passo {step.number}
              </span>
              <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
