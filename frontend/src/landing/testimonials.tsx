const testimonials = [
  {
    quote: "O Alimenta transformou a forma como gerenciamos nosso banco de alimentos. Antes perdiamos muito alimento por validade, agora temos controle total.",
    name: "Maria Silva",
    role: "Coordenadora",
    org: "ONG Acao Solidaria",
  },
  {
    quote: "Ferramenta indispensavel para qualquer banco de alimentos. Os relatorios nos ajudam a prestar contas para doadores e parceiros.",
    name: "Carlos Oliveira",
    role: "Diretor",
    org: "Instituto Alimentar",
  },
  {
    quote: "Simples de usar e muito eficiente. Nossa equipe de voluntarios aprendeu a usar em menos de um dia. Recomendo para todas as ONGs.",
    name: "Ana Costa",
    role: "Voluntaria",
    org: "Banco de Alimentos SP",
  },
]

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="border-t border-border/60 bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Depoimentos
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            ONGs que ja transformaram sua gestao
          </h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-xl border border-border/60 bg-background p-6"
            >
              <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                {`"${t.quote}"`}
              </blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role} - {t.org}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
