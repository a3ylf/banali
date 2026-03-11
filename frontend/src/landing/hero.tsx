import Link from "next/link"
import { ArrowRight, BarChart3, Package, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,oklch(0.90_0.08_145),transparent)]" />
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Plataforma gratuita para ONGs
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Gestao inteligente de{" "}
            <span className="text-primary">bancos de alimentos</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Controle seu estoque, acompanhe validades, gerencie movimentacoes e gere relatorios.
            Tudo o que sua ONG precisa para alimentar mais pessoas com menos desperdicio.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/dashboard">
                Comece Agora
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 px-8" asChild>
              <Link href="#como-funciona">
                Saiba mais
              </Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="rounded-xl border border-border/80 bg-card p-1 shadow-2xl shadow-primary/5">
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2 pb-4">
                <div className="h-3 w-3 rounded-full bg-destructive/40" />
                <div className="h-3 w-3 rounded-full bg-accent/60" />
                <div className="h-3 w-3 rounded-full bg-primary/40" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-lg bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total em Estoque</p>
                    <p className="text-xl font-bold text-foreground">8.250 kg</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entradas da Semana</p>
                    <p className="text-xl font-bold text-foreground">1.200 kg</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Alertas de Validade</p>
                    <p className="text-xl font-bold text-foreground">5 itens</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
