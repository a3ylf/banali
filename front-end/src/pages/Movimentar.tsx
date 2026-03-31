import { useNavigate } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import PageHeader from "@/components/shared/PageHeader";
import { movimentacoes } from "@/data/mock";

export default function Movimentar() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <PageHeader title="Movimentar" subtitle="Registre entradas e saídas" />

      <div className="grid grid-cols-2 gap-3 mb-8">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/movimentar/entrada")}
          className="flex flex-col items-center gap-3 p-6 rounded-lg bg-primary/5 border border-primary/15 hover:bg-primary/10 transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ArrowDownLeft size={20} className="text-primary" />
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-foreground block">
              Nova Entrada
            </span>
            <span className="text-[11px] text-muted-foreground">
              Doações / Recebimentos
            </span>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/movimentar/saida")}
          className="flex flex-col items-center gap-3 p-6 rounded-lg bg-secondary border border-border hover:bg-surface-hover transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <ArrowUpRight size={20} className="text-muted-foreground" />
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-foreground block">
              Nova Saída
            </span>
            <span className="text-[11px] text-muted-foreground">
              Distribuição
            </span>
          </div>
        </motion.button>
      </div>

      {/* History */}
      <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">
        Histórico Recente
      </h2>
      <div className="space-y-1">
        {movimentacoes.slice(0, 5).map((mov) => (
          <div
            key={mov.id}
            className="flex items-center justify-between py-3 px-4 rounded-lg bg-surface border border-border"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  mov.tipo === "entrada"
                    ? "bg-primary/10"
                    : "bg-muted"
                }`}
              >
                {mov.tipo === "entrada" ? (
                  <ArrowDownLeft size={14} className="text-primary" />
                ) : (
                  <ArrowUpRight size={14} className="text-muted-foreground" />
                )}
              </div>
              <div>
                <span className="text-sm font-medium text-foreground block">
                  {mov.tipo === "entrada"
                    ? mov.origem?.nome
                    : mov.destino?.nome}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {mov.itens.length} {mov.itens.length === 1 ? "item" : "itens"} · {mov.usuario_nome}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {format(mov.data, "dd MMM", { locale: ptBR })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
