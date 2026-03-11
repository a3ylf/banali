const stats = [
  { value: "150+", label: "ONGs cadastradas" },
  { value: "2.5M", label: "kg de alimentos gerenciados" },
  { value: "98%", label: "reducao de desperdicio" },
  { value: "50k+", label: "familias atendidas" },
]

export function StatsSection() {
  return (
    <section className="border-t border-border/60 bg-primary py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-primary-foreground/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
