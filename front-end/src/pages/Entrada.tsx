import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, Trash2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import CommandSearch from "@/components/shared/CommandSearch";
import { api } from "@/lib/api";

interface Categoria {
  id_categoria: string;
  nome_categoria: string;
}

interface Produto {
  id_produto: string;
  nome_produto: string;
  unidade_medida: string;
  id_categoria: string;
  categoria?: Categoria; // appended on frontend
}

interface LocalEntity {
  id_local: string;
  nome_local: string;
  is_owner: boolean;
}

interface EntradaItem {
  id: string; // frontend key
  produto: Produto;
  quantidade: number;
  data_validade: string;
}

const unidades = ["un", "Kg", "g", "L", "ml", "pct", "cx"];

export default function Entrada() {
  const navigate = useNavigate();
  const [origemId, setOrigemId] = useState("");
  const [itens, setItens] = useState<EntradaItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [prodSearch, setProdSearch] = useState("");
  const [showProdList, setShowProdList] = useState(false);
  const [showNewProd, setShowNewProd] = useState(false);
  
  const [newProd, setNewProd] = useState({ nome_produto: "", id_categoria: "", unidade_medida: "un" });
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const [locais, setLocais] = useState<LocalEntity[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categoriasLista, setCategoriasLista] = useState<Categoria[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [locaisRes, prodsRes, catsRes] = await Promise.all([
          api.get("/demand/places/"),
          api.get("/demand/products/"),
          api.get("/demand/categories/"),
        ]);
        setLocais(locaisRes.data.locais || []);
        setCategoriasLista(catsRes.data.categorias || []);
        
        // Map category objects onto products for UI rendering
        const cats = catsRes.data.categorias || [];
        const loadedProds = prodsRes.data.produtos || [];
        const mappedProds = loadedProds.map((p: any) => ({
          ...p,
          categoria: cats.find((c: any) => c.id_categoria === p.id_categoria)
        }));
        setProdutos(mappedProds);
      } catch (err) {
        toast.error("Erro ao carregar dados do sistema.");
      }
    }
    loadData();
  }, []);

  const doadores = locais.filter((l) => !l.is_owner);
  const filteredProds = produtos.filter((p) =>
    p.nome_produto?.toLowerCase().includes(prodSearch.toLowerCase())
  );

  const addItem = (produto: Produto) => {
    setItens((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        produto,
        quantidade: 1,
        data_validade: "",
      },
    ]);
    setProdSearch("");
    setShowProdList(false);
  };

  const createAndAdd = async () => {
    if (!newProd.nome_produto || !newProd.id_categoria) {
      toast.error("Preencha nome e categoria do novo produto.");
      return;
    }
    
    setIsCreatingProduct(true);
    try {
      const res = await api.post("/demand/products/", {
        nome_produto: newProd.nome_produto,
        descricao: "",
        unidade_medida: newProd.unidade_medida,
        id_categoria: newProd.id_categoria
      });
      
      const categoryObj = categoriasLista.find(c => c.id_categoria === newProd.id_categoria);
      const createdProd = { ...res.data, categoria: categoryObj };
      
      setProdutos(prev => [...prev, createdProd]);
      addItem(createdProd);
      
      setShowNewProd(false);
      setNewProd({ nome_produto: "", id_categoria: "", unidade_medida: "un" });
      toast.success("Produto criado e adicionado à lista.");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Erro ao criar produto.");
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const updateItem = (id: string, field: "quantidade" | "data_validade", value: any) => {
    setItens((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const removeItem = (id: string) => {
    setItens((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSubmit = async () => {
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

    setIsSubmitting(true);
    try {
      const payload = {
        id_local_origem: origemId,
        itens: itens.map(i => ({
          id_produto: i.produto.id_produto,
          quantidade: i.quantidade,
          data_validade: i.data_validade
        }))
      };

      await api.post("/demand/movement/input", payload);
      
      toast.success("Entrada registrada com sucesso!");
      navigate("/movimentar");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Erro ao registrar entrada.");
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
            <option key={d.id_local} value={d.id_local}>{d.nome_local}</option>
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
              <span className="text-sm font-medium text-foreground">{item.produto.nome_produto}</span>
              <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 size={14} />
              </button>
            </div>

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
                  onChange={(e) => updateItem(item.id, "data_validade", e.target.value)}
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
                key={p.id_produto}
                onClick={() => addItem(p)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-hover transition-colors border-b border-border last:border-0"
              >
                <span className="text-foreground">{p.nome_produto}</span>
                <span className="text-[11px] text-muted-foreground ml-2">{p.categoria?.nome_categoria}</span>
              </button>
            ))}
            {prodSearch && (
              <button
                onClick={() => {
                  setShowProdList(false);
                  setShowNewProd(true);
                  setNewProd((prev) => ({ ...prev, nome_produto: prodSearch }));
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-primary font-medium hover:bg-surface-hover transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} />
                Criar "{prodSearch}"
              </button>
            )}
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
                value={newProd.nome_produto}
                onChange={(e) => setNewProd((p) => ({ ...p, nome_produto: e.target.value }))}
                placeholder="Nome do produto"
                className="w-full h-9 px-3 rounded-md bg-surface text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-primary/30"
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <select
                    value={newProd.id_categoria}
                    onChange={(e) => setNewProd((p) => ({ ...p, id_categoria: e.target.value }))}
                    className="w-full h-9 px-3 rounded-md bg-surface text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-primary/30 appearance-none"
                  >
                    <option value="">Selecionar categoria...</option>
                    {categoriasLista.map((c) => (
                      <option key={c.id_categoria} value={c.id_categoria}>{c.nome_categoria}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
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
              <div className="flex gap-2 mt-2">
                <button
                  onClick={createAndAdd}
                  disabled={isCreatingProduct}
                  className="flex-1 h-9 flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium"
                >
                  {isCreatingProduct ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar e Adicionar"}
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
        disabled={isSubmitting || itens.length === 0}
        className="w-full h-12 flex items-center justify-center mt-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Registrar Entrada"}
      </motion.button>
    </div>
  );
}
