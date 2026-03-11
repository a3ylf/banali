import Link from "next/link"
import { Leaf } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="border-t border-border/60 bg-card py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Alimenta</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Plataforma gratuita de gestao de bancos de alimentos para ONGs.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Plataforma</h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li><Link href="#funcionalidades" className="text-sm text-muted-foreground hover:text-foreground">Funcionalidades</Link></li>
              <li><Link href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground">Como Funciona</Link></li>
              <li><Link href="#depoimentos" className="text-sm text-muted-foreground hover:text-foreground">Depoimentos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Recursos</h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link></li>
              <li><Link href="/dashboard/estoque" className="text-sm text-muted-foreground hover:text-foreground">Estoque</Link></li>
              <li><Link href="/dashboard/relatorios" className="text-sm text-muted-foreground hover:text-foreground">Relatorios</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Contato</h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li><span className="text-sm text-muted-foreground">contato@alimenta.org.br</span></li>
              <li><span className="text-sm text-muted-foreground">(11) 9999-0000</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6">
          <p className="text-center text-xs text-muted-foreground">
            2026 Alimenta. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
