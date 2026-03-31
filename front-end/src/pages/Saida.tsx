import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import CommandSearch from "@/components/shared/CommandSearch";
import ExpiryBadge from "@/components/shared/ExpiryBadge";
import { locais, getEstoque, type Lote, type Produto } from "@/data/mock";

interface SaidaItem {
  id: string;
  produto: Produto;
  lote: Lote;
  quantidade: number;
  shaking: boolean;
}

export default function Saida() {
  const navigate = useNavigate();
  const [destinoId, setDestinoId] = useState("");
  const [itens, setItens] = useState<SaidaItem[]>([]);
  const [prodSearch, setProdSearch] = useState("");
  const [showProdList, setShowProdList] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<string | null>(null);

  const beneficiarios = locais.filter((l) => l.tipo === "beneficiario");
  const estoque = useMemo(() => getEstoque(), []);

  const filteredEstoque = estoque.filter((e) =>
    e.produto.nome.toLowerCase().includes(prodSearch.toLowerCase())
  );

  const selectProduct = (prodId: string) => {
    setSelectedProduto(prodId);
    setShowProdList(false);
    setProdSearch("");
  };

  const addLote = (produto: Produto, lote: Lote) => {
    const existing = itens.find((i) => i.lote.id === lote.id);
    if (existing) {
      toast.info("Este lote já foi adicionado.");
      return;
    }
    setItens((prev) => [
      ...prev,
      { id: crypto.randomUUID(), produto, lote, quantidade: 1, shaking: false },
    ]);
    setSelectedProduto(null);
  };

  const suggestFefo = (prodId: string) => {
    const item = estoque.find((e) => e.produto.id === prodId);
    if (!item) return;
    // Add the first expiring lot
    const availableLotes = item.lotes.filter(
      (l) => !itens.find((i) => i.lote.id === l.id)
    );
    if (availableLotes.length > 0) {
      addLote(item.produto, availableLotes[0]);
    }
  };

  const updateQuantidade = (id: string, qtd: number) => {
    const item = itens.find((i) => i.id === id);
    if (!item) return;

    if (qtd > item.lote.quantidade_disponivel) {
      setItens((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, shaking: true, quantidade: item.lote.quantidade_disponivel } : i
        )
      );
      setTimeout(() => {
        setItens((prev) =>
          prev.map((i) => (i.id === id ? { ...i, shaking: false } : i))
        );
      }, 400);
      toast.error(`Máximo disponível: ${item.lote.quantidade_disponivel}`);
      return;
    }
    setItens((prev) => prev.map((i) => (i.id === id ? { ...i, quantidade: qtd } : i)));
  };

  const removeItem = (id: string) => {
    setItens((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSubmit = () => {
    if (!destinoId) {
      toast.error("Selecione o destino.");
      return;
    }
    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item.");
      return;
    }
    toast.success("Saída registrada com sucesso!", {
      action: { label: "Desfazer", onClick: () => toast.info("Ação desfeita.") },
    });
    navigate("/movimentar");
  };

  // Get lots for selected product (sorted FEFO)
  const selectedEstoque = selectedProduto
    ? estoque.find((e) => e.produto.id === selectedProduto)
    : null;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <button
        onClick={() => navigate("/movimentar")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <PageHeader title="Registrar Saída" subtitle="Distribuição para beneficiários" />

      {/* Destino */}
      <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground block mb-2">
        Destino
      </label>
      <div className="relative mb-6">
        <select
          value={destinoId}
          onChange={(e) => setDestinoId(e.target.value)}
          className="w-full h-11 px-3 pr-8 rounded-lg bg-secondary text-sm text-foreground border-0 outline-none ring-1 ring-transparent focus:ring-primary/30 appearance-none"
        >
          <option value="">Selecionar beneficiário...</option>
          {beneficiarios.map((b) => (
            <option key={b.id} value={b.id}>{b.nome}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>

      {/* Items */}
      <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground block mb-2">
        Itens
      </label>

      <AnimatePresence>
        {itens.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 p-3 rounded-lg bg-surface border border-border overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-foreground">{item.produto.nome}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <ExpiryBadge date={item.lote.data_validade} />
                  <span className="text-[11px] text-muted-foreground">
                    {format(item.lote.data_validade, "dd MMM yyyy", { locale: ptBR })}
                  </span>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider shrink-0">Qtd</label>
              <input
                type="number"
                min={1}
                max={item.lote.quantidade_disponivel}
                value={item.quantidade}
                onChange={(e) => updateQuantidade(item.id, Number(e.target.value))}
                className={`w-24 h-9 px-3 rounded-md bg-secondary text-sm text-foreground tabular-nums outline-none ring-1 ring-transparent focus:ring-primary/30 transition-all ${
                  item.shaking ? "animate-shake ring-destructive" : ""
                }`}
              />
              <span className="text-[11px] text-muted-foreground">
                / {item.lote.quantidade_disponivel} disponível
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Product search */}
      <div className="relative mb-2">
        <CommandSearch
          value={prodSearch}
          onChange={(v) => {
            setProdSearch(v);
            setShowProdList(v.length > 0);
            setSelectedProduto(null);
          }}
          placeholder="Buscar produto para saída..."
        />
        {showProdList && (
          <div className="absolute z-30 top-full mt-1 left-0 right-0 bg-surface border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredEstoque.map((e) => (
              <button
                key={e.produto.id}
                onClick={() => selectProduct(e.produto.id)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-hover transition-colors border-b border-border last:border-0 flex items-center justify-between"
              >
                <div>
                  <span className="text-foreground">{e.produto.nome}</span>
                  <span className="text-[11px] text-muted-foreground ml-2">{e.produto.categoria.nome}</span>
                </div>
                <span className="font-mono text-sm tabular-nums text-muted-foreground">{e.total_disponivel}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lot selection (FEFO) */}
      <AnimatePresence>
        {selectedEstoque && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 rounded-lg border border-primary/20 bg-primary/5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Lotes — {selectedEstoque.produto.nome}
              </p>
              <button
                onClick={() => suggestFefo(selectedEstoque.produto.id)}
                className="text-[11px] text-primary font-medium underline underline-offset-2"
              >
                Sugerir FEFO
              </button>
            </div>
            <div className="space-y-1.5">
              {selectedEstoque.lotes.map((lote) => (
                <button
                  key={lote.id}
                  onClick={() => addLote(selectedEstoque.produto, lote)}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-md text-sm transition-colors ${
                    lote.status_validade === "proximo_vencimento"
                      ? "bg-expiry-near border border-expiry-near-border"
                      : "bg-surface border border-border"
                  } hover:bg-surface-hover`}
                >
                  <div className="flex items-center gap-2">
                    <ExpiryBadge date={lote.data_validade} />
                    <span className="text-xs text-muted-foreground">
                      {format(lote.data_validade, "dd MMM yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <span className="font-mono text-sm tabular-nums text-foreground">
                    {lote.quantidade_disponivel}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        className="w-full h-12 mt-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
      >
        Registrar Saída
      </motion.button>
    </div>
  );
}
