import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import CommandSearch from "@/components/shared/CommandSearch";
import ExpiryBadge from "@/components/shared/ExpiryBadge";
import { api } from "@/lib/api";

interface LocalEntity {
  id_local: string;
  nome_local: string;
  is_owner: boolean;
}

interface EstoqueItem {
  id_produto: string;
  produto: string;
  categoria: string;
  unidade_medida: string;
  quantidade_total: number;
}

interface Lote {
  id_lote: string;
  id_produto: string;
  quantidade_disponivel: number;
  data_validade: string;
  status_validade?: string;
  esta_valido?: boolean;
}

interface SaidaItem {
  id: string; // frontend uuid
  estoqueItem: EstoqueItem;
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
  const [selectedProduto, setSelectedProduto] = useState<EstoqueItem | null>(null);
  const [lotesProduto, setLotesProduto] = useState<Lote[]>([]);
  const [locais, setLocais] = useState<LocalEntity[]>([]);
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [locaisRes, estoqueRes] = await Promise.all([
          api.get("/demand/places/"),
          api.get("/demand/stock")
        ]);
        setLocais(locaisRes.data.locais || []);
        // API might return standard list
        setEstoque(Array.isArray(estoqueRes.data) ? estoqueRes.data : []);
      } catch (err) {
        toast.error("Erro ao carregar dados de sistema.");
      }
    }
    loadData();
  }, []);

  const beneficiarios = locais.filter((l) => !l.is_owner);

  const filteredEstoque = estoque.filter((e) =>
    e.produto?.toLowerCase().includes(prodSearch.toLowerCase())
  );

  const selectProduct = async (estItem: EstoqueItem) => {
    setSelectedProduto(estItem);
    setShowProdList(false);
    setProdSearch("");
    try {
      const res = await api.get(`/demand/products/${estItem.id_produto}/batches`);
      let loadedLotes: Lote[] = res.data.lotes || [];
      // Calculate local status_validade mimicking frontend badge logic if needed
      loadedLotes = loadedLotes.map(l => {
        const diffDays = (new Date(l.data_validade).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
        let status = "ok";
        if (diffDays <= 0) status = "vencido";
        else if (diffDays <= 30) status = "proximo_vencimento";
        return { ...l, status_validade: status };
      }).sort((a, b) => new Date(a.data_validade).getTime() - new Date(b.data_validade).getTime());
      
      setLotesProduto(loadedLotes);
    } catch (err) {
      toast.error("Erro ao carregar lotes do produto.");
      setLotesProduto([]);
    }
  };

  const addLote = (estoqueItem: EstoqueItem, lote: Lote) => {
    const existing = itens.find((i) => i.lote.id_lote === lote.id_lote);
    if (existing) {
      toast.info("Este lote já foi adicionado.");
      return;
    }
    setItens((prev) => [
      ...prev,
      { id: crypto.randomUUID(), estoqueItem, lote, quantidade: 1, shaking: false },
    ]);
    setSelectedProduto(null);
  };

  const suggestFefo = (estItem: EstoqueItem) => {
    // FEFO is already sorted by date
    const availableLotes = lotesProduto.filter(
      (l) => !itens.find((i) => i.lote.id_lote === l.id_lote) && l.quantidade_disponivel > 0
    );
    if (availableLotes.length > 0) {
      addLote(estItem, availableLotes[0]);
    } else {
      toast.info("Não há lotes disponíveis para sugerir FEFO.");
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

  const handleSubmit = async () => {
    if (!destinoId) {
      toast.error("Selecione o destino.");
      return;
    }
    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item.");
      return;
    }
    
    const invalid = itens.find(i => i.quantidade <= 0 || !i.lote.id_lote);
    if (invalid) {
      toast.error("Verifique as quantidades adicionadas e certifique-se de que são válidas.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        id_local_destino: destinoId,
        itens: itens.map(i => ({
          id_lote: i.lote.id_lote,
          quantidade: i.quantidade
        }))
      };

      await api.post("/demand/movement/output", payload);
      
      toast.success("Saída registrada com sucesso!");
      navigate("/movimentar");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Erro ao registrar saída.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <option key={b.id_local} value={b.id_local}>{b.nome_local}</option>
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
                <span className="text-sm font-medium text-foreground">{item.estoqueItem.produto}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <ExpiryBadge date={new Date(item.lote.data_validade)} />
                  <span className="text-[11px] text-muted-foreground">
                    {format(new Date(item.lote.data_validade), "dd MMM yyyy", { locale: ptBR })}
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
                / {item.lote.quantidade_disponivel} {item.estoqueItem.unidade_medida}s
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
          placeholder="Buscar produto em estoque..."
        />
        {showProdList && (
          <div className="absolute z-30 top-full mt-1 left-0 right-0 bg-surface border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredEstoque.map((e) => (
              <button
                key={e.id_produto}
                onClick={() => selectProduct(e)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-hover transition-colors border-b border-border last:border-0 flex items-center justify-between"
              >
                <div>
                  <span className="text-foreground">{e.produto}</span>
                  <span className="text-[11px] text-muted-foreground ml-2">{e.categoria}</span>
                </div>
                <span className="font-mono text-sm tabular-nums text-muted-foreground">Estoque: {e.quantidade_total}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lot selection (FEFO) */}
      <AnimatePresence>
        {selectedProduto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 rounded-lg border border-primary/20 bg-primary/5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Lotes — {selectedProduto.produto}
              </p>
              <button
                onClick={() => suggestFefo(selectedProduto)}
                className="text-[11px] text-primary font-medium underline underline-offset-2"
              >
                Sugerir FEFO
              </button>
            </div>
            <div className="space-y-1.5">
              {lotesProduto.map((lote) => {
                const disponivel = lote.quantidade_disponivel;
                if (disponivel <= 0) return null;
                
                return (
                <button
                  key={lote.id_lote}
                  onClick={() => addLote(selectedProduto, lote)}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-md text-sm transition-colors ${
                    lote.status_validade === "proximo_vencimento"
                      ? "bg-expiry-near border border-expiry-near-border"
                      : "bg-surface border border-border"
                  } hover:bg-surface-hover`}
                >
                  <div className="flex items-center gap-2">
                    <ExpiryBadge date={new Date(lote.data_validade)} />
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(lote.data_validade), "dd MMM yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <span className="font-mono text-sm tabular-nums text-foreground">
                    {disponivel} un
                  </span>
                </button>
              )})}
              {lotesProduto.filter(l => l.quantidade_disponivel > 0).length === 0 && (
                <span className="text-sm text-muted-foreground block text-center py-2">Sem lotes disponíveis</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={isSubmitting || itens.length === 0}
        className="w-full h-12 mt-4 rounded-lg flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Registrar Saída"}
      </motion.button>
    </div>
  );
}
