import { useState, useMemo } from "react";
import { getEstoque, categorias } from "@/data/mock";
import CommandSearch from "@/components/shared/CommandSearch";
import PageHeader from "@/components/shared/PageHeader";
import DataStrip from "@/components/stock/DataStrip";
import AislePerspective from "@/components/stock/AislePerspective";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type FilterValidade = "todos" | "proximo" | "valido";
type ViewMode = "lista" | "categoria";

export default function Index() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("todos");
  const [validadeFilter, setValidadeFilter] = useState<FilterValidade>("todos");
  const [viewMode, setViewMode] = useState<ViewMode>("lista");
  const [showFilters, setShowFilters] = useState(false);

  const estoque = useMemo(() => getEstoque(), []);

  const filtered = useMemo(() => {
    return estoque.filter((item) => {
      const matchSearch = item.produto.nome
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchCat =
        catFilter === "todos" || item.produto.categoria_id === catFilter;
      const matchValidade =
        validadeFilter === "todos" ||
        (validadeFilter === "proximo" &&
          item.lotes.some((l) => l.status_validade === "proximo_vencimento")) ||
        (validadeFilter === "valido" &&
          item.lotes.every((l) => l.status_validade === "valido"));
      return matchSearch && matchCat && matchValidade;
    });
  }, [estoque, search, catFilter, validadeFilter]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    filtered.forEach((item) => {
      const catName = item.produto.categoria.nome;
      if (!groups[catName]) groups[catName] = [];
      groups[catName].push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const activeFilterCount =
    (catFilter !== "todos" ? 1 : 0) + (validadeFilter !== "todos" ? 1 : 0);

  const activeFilterLabel = () => {
    const parts: string[] = [];
    if (catFilter !== "todos") {
      const cat = categorias.find((c) => c.id === catFilter);
      if (cat) parts.push(cat.nome);
    }
    if (validadeFilter === "proximo") parts.push("Próx. Vencimento");
    if (validadeFilter === "valido") parts.push("Válidos");
    return parts.join(" · ");
  };

  const clearFilters = () => {
    setCatFilter("todos");
    setValidadeFilter("todos");
    setShowFilters(false);
  };

  return (
    <div className="relative min-h-screen">
      <AislePerspective />
      <div className="relative z-10 p-4 md:p-8 max-w-2xl mx-auto">
      <PageHeader
        title="Fluxo de Alimentos"
        subtitle={`${estoque.length} produtos em estoque`}
      />

      {/* Search + Filter row */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <CommandSearch
            value={search}
            onChange={setSearch}
            placeholder="Buscar produto..."
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`h-10 px-3 rounded-lg border transition-colors flex items-center gap-1.5 shrink-0 ${
            activeFilterCount > 0
              ? "bg-primary/10 border-primary/20 text-primary"
              : "bg-secondary border-border text-muted-foreground"
          }`}
        >
          <SlidersHorizontal size={14} />
          {activeFilterCount > 0 && (
            <span className="text-xs font-medium tabular-nums">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Active filter tag */}
      {activeFilterCount > 0 && !showFilters && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] text-muted-foreground px-2.5 py-1 rounded-full bg-secondary flex items-center gap-1.5">
            {activeFilterLabel()}
            <button onClick={clearFilters} className="hover:text-foreground">
              <X size={12} />
            </button>
          </span>
        </div>
      )}

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="p-4 rounded-lg bg-surface border border-border space-y-4">
              {/* View mode */}
              <div>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground block mb-2">Visualização</span>
                <div className="flex gap-2">
                  {([["lista", "Lista"], ["categoria", "Por Categoria"]] as const).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setViewMode(key)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                        viewMode === key
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground block mb-2">Categoria</span>
                <div className="relative">
                  <select
                    value={catFilter}
                    onChange={(e) => setCatFilter(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-md bg-secondary text-sm text-foreground outline-none appearance-none"
                  >
                    <option value="todos">Todas as categorias</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Validade */}
              <div>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground block mb-2">Validade</span>
                <div className="flex gap-2">
                  {([["todos", "Todos"], ["proximo", "⚠ Próx. Vencimento"], ["valido", "✓ Válidos"]] as [FilterValidade, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setValidadeFilter(key)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                        validadeFilter === key
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Limpar filtros
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-xs font-medium text-primary"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Strips */}
      {filtered.length === 0 ? (
        <div className="bg-surface rounded-lg border border-border py-16 text-center">
          <p className="text-muted-foreground text-sm">
            O estoque está vazio. Registre uma doação para começar.
          </p>
        </div>
      ) : viewMode === "lista" ? (
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          {filtered.map((item) => (
            <DataStrip key={item.produto.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByCategory.map(([catName, items]) => (
            <div key={catName}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  {catName}
                </span>
                <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                  {items.length}
                </span>
              </div>
              <div className="bg-surface rounded-lg border border-border overflow-hidden">
                {items.map((item) => (
                  <DataStrip key={item.produto.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
