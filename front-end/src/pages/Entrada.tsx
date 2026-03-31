import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import CommandSearch from "@/components/shared/CommandSearch";
import { locais, produtos, categorias, lotes, type Produto } from "@/data/mock";

interface EntradaItem {
  id: string;
  produto: Produto;
  quantidade: number;
  data_validade: string;
  isNew: boolean;
  /** If merging with existing lote, store its id */
  existingLoteId?: string;
}

const unidades = ["un", "Kg", "g", "L", "ml", "pct", "cx"];

export default function Entrada() {
  const navigate = useNavigate();
  const [origemId, setOrigemId] = useState("");
  const [itens, setItens] = useState<EntradaItem[]>([]);

  const [prodSearch, setProdSearch] = useState("");
  const [showProdList, setShowProdList] = useState(false);
  const [showNewProd, setShowNewProd] = useState(false);
  const [newProd, setNewProd] = useState({ nome: "", categoria_id: "", unidade_medida: "un" });

  const doadores = locais.filter((l) => l.tipo === "doador");
  const filteredProds = produtos.filter((p) =>
    p.nome.toLowerCase().includes(prodSearch.toLowerCase())
  );

  const addItem = (produto: Produto) => {
    setItens((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        produto,
        quantidade: 1,
        data_validade: "",
        isNew: false,
      },
    ]);
    setProdSearch("");
    setShowProdList(false);
  };

  const createAndAdd = () => {
    if (!newProd.nome || !newProd.categoria_id) {
      toast.error("Preencha nome e categoria do novo produto.");
      return;
    }
    const cat = categorias.find((c) => c.id === newProd.categoria_id)!;
    const produto: Produto = {
      id: crypto.randomUUID(),
      nome: newProd.nome,
      descricao: "",
      valor_numerico: 1,
      unidade_medida: newProd.unidade_medida,
      categoria_id: newProd.categoria_id,
      categoria: cat,
    };
    addItem(produto);
    setShowNewProd(false);
    setNewProd({ nome: "", categoria_id: "", unidade_medida: "un" });
  };

  /**
   * Check if a lote with same produto_id + data_validade already exists.
   * If so, mark for upsert (merge) instead of creating new lote.
   */
  const checkLoteUpsert = (itemId: string, dataValidade: string) => {
    const item = itens.find((i) => i.id === itemId);
    if (!item) return;

    const existingLote = lotes.find(
      (l) => l.produto_id === item.produto.id && 
        l.data_validade.toISOString().split("T")[0] === dataValidade
    );

    setItens((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? { ...i, data_validade: dataValidade, existingLoteId: existingLote?.id }
          : i
      )
    );

    if (existingLote) {
      toast.info(
        `Lote existente encontrado (${existingLote.quantidade_disponivel} unids). A quantidade será somada.`,
        { duration: 4000 }
      );
    }
  };

  const updateItem = (id: string, field: "quantidade", value: number) => {
    setItens((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const removeItem = (id: string) => {
    setItens((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSubmit = () => {
    if (!origemId) {
      toast.error("Selecione a origem.");
      return;
    }
    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item.");
      return;
    }
    const invalid = itens.find((i) => !i.quantidade || !i.data_validade);
    if (invalid) {
      toast.error("Preencha quantidade e validade de todos os itens.");
      return;
    }

    // Build payload with upsert awareness
    const mergedCount = itens.filter((i) => i.existingLoteId).length;
    const newCount = itens.length - mergedCount;

    const messages: string[] = [];
    if (newCount > 0) messages.push(`${newCount} novo(s) lote(s)`);
    if (mergedCount > 0) messages.push(`${mergedCount} lote(s) atualizado(s)`);

    toast.success(`Entrada registrada: ${messages.join(", ")}!`, {
      action: { label: "Desfazer", onClick: () => toast.info("Ação desfeita.") },
    });
    navigate("/movimentar");
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

      <PageHeader title="Registrar Entrada" subtitle="Doação ou recebimento" />

      {/* Step 1: Origem */}
      <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground block mb-2">
        Origem
      </label>
      <div className="relative mb-6">
        <select
          value={origemId}
          onChange={(e) => setOrigemId(e.target.value)}
          className="w-full h-11 px-3 pr-8 rounded-lg bg-secondary text-sm text-foreground border-0 outline-none ring-1 ring-transparent focus:ring-primary/30 appearance-none"
        >
          <option value="">Selecionar doador...</option>
          {doadores.map((d) => (
            <option key={d.id} value={d.id}>{d.nome}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>

      {/* Step 2: Items */}
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
              <span className="text-sm font-medium text-foreground">{item.produto.nome}</span>
              <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 size={14} />
              </button>
            </div>

            {/* Upsert indicator */}
            {item.existingLoteId && (
              <div className="mb-2 px-2 py-1.5 rounded-md bg-primary/5 border border-primary/15">
                <span className="text-[11px] text-primary font-medium">
                  ↑ Lote existente — quantidade será somada
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Qtd</label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={item.quantidade}
                    onChange={(e) => updateItem(item.id, "quantidade", Number(e.target.value))}
                    className="w-full h-9 px-3 pr-12 rounded-md bg-secondary text-sm text-foreground tabular-nums outline-none ring-1 ring-transparent focus:ring-primary/30"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground font-medium pointer-events-none">
                    {item.produto.unidade_medida}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Validade</label>
                <input
                  type="date"
                  value={item.data_validade}
                  onChange={(e) => checkLoteUpsert(item.id, e.target.value)}
                  className="w-full h-9 px-3 rounded-md bg-secondary text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-primary/30"
                />
              </div>
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
            setShowNewProd(false);
          }}
          placeholder="Buscar produto para adicionar..."
        />
        {showProdList && (
          <div className="absolute z-30 top-full mt-1 left-0 right-0 bg-surface border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredProds.map((p) => (
              <button
                key={p.id}
                onClick={() => addItem(p)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-hover transition-colors border-b border-border last:border-0"
              >
                <span className="text-foreground">{p.nome}</span>
                <span className="text-[11px] text-muted-foreground ml-2">{p.categoria.nome}</span>
              </button>
            ))}
            <button
              onClick={() => {
                setShowProdList(false);
                setShowNewProd(true);
                setNewProd((prev) => ({ ...prev, nome: prodSearch }));
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-primary font-medium hover:bg-surface-hover transition-colors flex items-center gap-1.5"
            >
              <Plus size={14} />
              Criar "{prodSearch}"
            </button>
          </div>
        )}
      </div>

      {/* New product form */}
      <AnimatePresence>
        {showNewProd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 rounded-lg border border-primary/20 bg-primary/5 overflow-hidden"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-primary mb-3">Novo Produto</p>
            <div className="space-y-2">
              <input
                value={newProd.nome}
                onChange={(e) => setNewProd((p) => ({ ...p, nome: e.target.value }))}
                placeholder="Nome do produto"
                className="w-full h-9 px-3 rounded-md bg-surface text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-primary/30"
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <select
                    value={newProd.categoria_id}
                    onChange={(e) => setNewProd((p) => ({ ...p, categoria_id: e.target.value }))}
                    className="w-full h-9 px-3 rounded-md bg-surface text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-primary/30 appearance-none"
                  >
                    <option value="">Categoria</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <select
                    value={newProd.unidade_medida}
                    onChange={(e) => setNewProd((p) => ({ ...p, unidade_medida: e.target.value }))}
                    className="w-full h-9 px-3 rounded-md bg-surface text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-primary/30 appearance-none"
                  >
                    {unidades.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={createAndAdd}
                  className="flex-1 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium"
                >
                  Criar e Adicionar
                </button>
                <button
                  onClick={() => setShowNewProd(false)}
                  className="h-9 px-4 rounded-md bg-secondary text-muted-foreground text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        className="w-full h-12 mt-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
      >
        Registrar Entrada
      </motion.button>
    </div>
  );
}
