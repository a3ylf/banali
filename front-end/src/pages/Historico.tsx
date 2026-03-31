import { useState, useMemo } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, eachWeekOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/shared/PageHeader";
import { movimentacoes, categorias } from "@/data/mock";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Tab = "transacoes" | "analises";

export default function Historico() {
  const [tab, setTab] = useState<Tab>("transacoes");
  const [tipoFilter, setTipoFilter] = useState<"todos" | "entrada" | "saida">("todos");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = movimentacoes.filter(
    (m) => tipoFilter === "todos" || m.tipo === tipoFilter
  );

  const chipClass = (active: boolean) =>
    `px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
      active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
    }`;

  const tabClass = (active: boolean) =>
    `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
      active
        ? "border-primary text-foreground"
        : "border-transparent text-muted-foreground hover:text-foreground"
    }`;

  // Analytics data
  const weeklyData = useMemo(() => {
    const now = new Date();
    const weeks = eachWeekOfInterval({
      start: subDays(now, 42),
      end: now,
    });

    return weeks.map((weekStart) => {
      const weekEnd = endOfWeek(weekStart);
      const weekLabel = format(weekStart, "dd/MM", { locale: ptBR });

      let entradas = 0;
      let saidas = 0;
      movimentacoes.forEach((m) => {
        if (m.data >= weekStart && m.data <= weekEnd) {
          const total = m.itens.reduce((s, i) => s + i.quantidade, 0);
          if (m.tipo === "entrada") entradas += total;
          else saidas += total;
        }
      });

      return { semana: weekLabel, Entradas: entradas, Saídas: saidas };
    });
  }, []);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    movimentacoes
      .filter((m) => m.tipo === "saida")
      .forEach((m) => {
        m.itens.forEach((item) => {
          // Try to match product name to a category
          const cat = findCategoryForProduct(item.produto_nome);
          counts[cat] = (counts[cat] || 0) + item.quantidade;
        });
      });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  const donutColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const lineChartConfig = {
    Entradas: { label: "Entradas", color: "hsl(var(--chart-1))" },
    Saídas: { label: "Saídas", color: "hsl(var(--chart-3))" },
  };

  const donutChartConfig = categoryData.reduce((acc, item, i) => {
    acc[item.name] = { label: item.name, color: donutColors[i % donutColors.length] };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <PageHeader title="Histórico" subtitle="Movimentações e análises" />

      {/* Tabs */}
      <div className="flex border-b border-border mb-5">
        <button className={tabClass(tab === "transacoes")} onClick={() => setTab("transacoes")}>
          Transações
        </button>
        <button className={tabClass(tab === "analises")} onClick={() => setTab("analises")}>
          Análises
        </button>
      </div>

      {tab === "transacoes" ? (
        <>
          <div className="flex gap-2 mb-5">
            {([["todos", "Todos"], ["entrada", "Entradas"], ["saida", "Saídas"]] as const).map(
              ([key, label]) => (
                <button key={key} className={chipClass(tipoFilter === key)} onClick={() => setTipoFilter(key)}>
                  {label}
                </button>
              )
            )}
          </div>

          <div className="space-y-1">
            {filtered.map((mov) => (
              <div key={mov.id}>
                <button
                  onClick={() => setExpandedId(expandedId === mov.id ? null : mov.id)}
                  className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-surface border border-border text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      mov.tipo === "entrada" ? "bg-primary/10" : "bg-muted"
                    }`}>
                      {mov.tipo === "entrada" ? (
                        <ArrowDownLeft size={14} className="text-primary" />
                      ) : (
                        <ArrowUpRight size={14} className="text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground block">
                        {mov.tipo === "entrada" ? mov.origem?.nome : mov.destino?.nome}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {mov.itens.length} {mov.itens.length === 1 ? "item" : "itens"} · {mov.usuario_nome}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {format(mov.data, "dd MMM yyyy", { locale: ptBR })}
                  </span>
                </button>

                <AnimatePresence>
                  {expandedId === mov.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3 pt-1 ml-11 space-y-1">
                        {mov.itens.map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-1.5 text-sm">
                            <span className="text-muted-foreground">{item.produto_nome}</span>
                            <span className="font-mono tabular-nums text-foreground">{item.quantidade}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-8">
          {/* Line chart — Entries vs Exits by week */}
          <div className="bg-surface rounded-xl border border-border p-5">
            <h3 className="text-sm font-medium text-foreground mb-1">Entradas vs Saídas</h3>
            <p className="text-[11px] text-muted-foreground mb-4">Volume por semana (últimas 6 semanas)</p>
            <ChartContainer config={lineChartConfig} className="h-52 w-full aspect-auto">
              <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="semana"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="Entradas"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(var(--chart-1))" }}
                />
                <Line
                  type="monotone"
                  dataKey="Saídas"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(var(--chart-3))" }}
                />
              </LineChart>
            </ChartContainer>
          </div>

          {/* Donut chart — Categories distributed */}
          <div className="bg-surface rounded-xl border border-border p-5">
            <h3 className="text-sm font-medium text-foreground mb-1">Categorias distribuídas</h3>
            <p className="text-[11px] text-muted-foreground mb-4">Proporção por categoria nas saídas</p>
            <ChartContainer config={donutChartConfig} className="h-56 w-full aspect-auto">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={donutColors[index % donutColors.length]} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper: match product name to category name from mock data
function findCategoryForProduct(produtoNome: string): string {
  const map: Record<string, string> = {
    "Arroz Branco": "Grãos e Cereais",
    "Feijão Carioca": "Grãos e Cereais",
    "Macarrão Espaguete": "Grãos e Cereais",
    "Açúcar Refinado": "Grãos e Cereais",
    "Leite Integral": "Laticínios",
    "Milho em Conserva": "Enlatados",
    "Sabonete": "Higiene",
    "Banana Prata": "Hortifruti",
    "Suco de Laranja": "Bebidas",
  };
  return map[produtoNome] || "Outros";
}
