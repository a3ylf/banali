import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import type { ProdutoEstoque } from "@/data/mock";
import { getLoteHistorico } from "@/data/mock";
import ExpiryBadge from "@/components/shared/ExpiryBadge";
import LoteSparkline from "@/components/stock/LoteSparkline";

interface DataStripProps {
  item: ProdutoEstoque;
}

export default function DataStrip({ item }: DataStripProps) {
  const [open, setOpen] = useState(false);
  const hasNearExpiry = item.lotes.some(
    (l) => l.status_validade === "proximo_vencimento"
  );

  const historico = getLoteHistorico(item.produto.id);

  return (
    <motion.div layout className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 px-4 active:bg-surface-hover transition-colors text-left"
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[14px] font-medium tracking-tight text-foreground truncate">
            {item.produto.nome}
          </span>
          <span className="text-[11px] text-muted-foreground uppercase tracking-widest">
            {item.produto.categoria.nome}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          {hasNearExpiry && (
            <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
          )}
          <div className="text-right">
            <span className="font-mono text-lg tabular-nums text-foreground block leading-tight">
              {item.volume_total}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {item.total_disponivel} {item.total_disponivel === 1 ? "unid" : "unids"}
            </span>
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} className="text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Lots */}
              <div className="space-y-1.5">
                {item.lotes.map((lote) => {
                  const daysLeft = differenceInDays(lote.data_validade, new Date());
                  return (
                    <div
                      key={lote.id}
                      className={`flex items-center justify-between py-2 px-3 rounded-md text-sm ${
                        lote.status_validade === "proximo_vencimento"
                          ? "bg-expiry-near border border-expiry-near-border"
                          : "bg-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ExpiryBadge date={lote.data_validade} />
                        <span className="text-xs text-muted-foreground">
                          {daysLeft >= 0
                            ? `Vence em ${daysLeft} ${daysLeft === 1 ? "dia" : "dias"}`
                            : `Vencido há ${Math.abs(daysLeft)} dias`}
                        </span>
                      </div>
                      <span className="font-mono text-sm tabular-nums text-foreground">
                        {lote.quantidade_disponivel}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Sparkline micro-chart */}
              {historico.length > 1 && (
                <div className="pt-2 border-t border-border">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
                    Entradas de lotes
                  </span>
                  <LoteSparkline data={historico} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
