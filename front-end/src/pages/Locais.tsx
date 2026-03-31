import { useState } from "react";
import { Building2, User, Plus, X, Trash2, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import CommandSearch from "@/components/shared/CommandSearch";
import { locais as initialLocais, type Local } from "@/data/mock";

function formatDocumento(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 11) {
    // CPF: 000.000.000-00
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  // CNPJ: 00.000.000/0000-00
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function getDocRaw(value: string): string {
  return value.replace(/\D/g, "").slice(0, 14);
}

export default function Locais() {
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState<"todos" | "doador" | "beneficiario">("todos");
  const [allLocais, setAllLocais] = useState<Local[]>(initialLocais);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formNome, setFormNome] = useState("");
  const [formTipo, setFormTipo] = useState<"doador" | "beneficiario">("doador");
  const [formDoc, setFormDoc] = useState("");

  const filtered = allLocais.filter((l) => {
    const matchSearch = l.nome.toLowerCase().includes(search.toLowerCase());
    const matchTipo = tipoFilter === "todos" || l.tipo === tipoFilter;
    return matchSearch && matchTipo;
  });

  const chipClass = (active: boolean) =>
    `px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
      active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
    }`;

  const openNew = () => {
    setEditingId(null);
    setFormNome("");
    setFormTipo("doador");
    setFormDoc("");
    setShowForm(true);
  };

  const openEdit = (local: Local) => {
    setEditingId(local.id);
    setFormNome(local.nome);
    setFormTipo(local.tipo);
    setFormDoc(local.documento);
    setShowForm(true);
  };

  const handleDocChange = (value: string) => {
    const raw = getDocRaw(value);
    setFormDoc(formatDocumento(raw));
  };

  const handleSave = () => {
    const rawDoc = formDoc.replace(/\D/g, "");
    if (!formNome.trim()) {
      toast.error("Preencha o nome do local.");
      return;
    }
    if (rawDoc.length !== 11 && rawDoc.length !== 14) {
      toast.error("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
      return;
    }

    if (editingId) {
      setAllLocais((prev) =>
        prev.map((l) =>
          l.id === editingId
            ? { ...l, nome: formNome.trim(), tipo: formTipo, documento: formDoc }
            : l
        )
      );
      toast.success("Local atualizado.");
    } else {
      const novo: Local = {
        id: crypto.randomUUID(),
        nome: formNome.trim(),
        tipo: formTipo,
        documento: formDoc,
      };
      setAllLocais((prev) => [novo, ...prev]);
      toast.success("Local cadastrado.");
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setAllLocais((prev) => prev.filter((l) => l.id !== id));
    toast.success("Local removido.");
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <PageHeader
        title="Locais"
        subtitle="Doadores e beneficiários"
        action={
          <button
            onClick={openNew}
            className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5"
          >
            <Plus size={14} />
            Novo Local
          </button>
        }
      />

      <div className="mb-4">
        <CommandSearch value={search} onChange={setSearch} placeholder="Buscar local..." />
      </div>

      <div className="flex gap-2 mb-5">
        {([["todos", "Todos"], ["doador", "Doadores"], ["beneficiario", "Beneficiários"]] as const).map(
          ([key, label]) => (
            <button key={key} className={chipClass(tipoFilter === key)} onClick={() => setTipoFilter(key)}>
              {label}
            </button>
          )
        )}
      </div>

      {/* Form side panel */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 overflow-hidden"
          >
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-widest text-primary">
                  {editingId ? "Editar Local" : "Novo Local"}
                </p>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              </div>

              <input
                value={formNome}
                onChange={(e) => setFormNome(e.target.value)}
                placeholder="Nome do local"
                className="w-full h-10 px-3 rounded-md bg-surface text-sm text-foreground outline-none ring-1 ring-transparent focus:ring-primary/30"
              />

              <div className="flex gap-2">
                {([["doador", "Doador"], ["beneficiario", "Beneficiário"]] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFormTipo(key)}
                    className={chipClass(formTipo === key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                  CPF ou CNPJ
                </label>
                <input
                  value={formDoc}
                  onChange={(e) => handleDocChange(e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={18}
                  className="w-full h-10 px-3 rounded-md bg-surface text-sm text-foreground tabular-nums outline-none ring-1 ring-transparent focus:ring-primary/30"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={handleSave} className="flex-1 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium">
                  {editingId ? "Salvar" : "Cadastrar"}
                </button>
                <button onClick={() => setShowForm(false)} className="h-9 px-4 rounded-md bg-secondary text-muted-foreground text-sm">
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-1">
        {filtered.map((local) => (
          <div
            key={local.id}
            className="flex items-center gap-3 py-3 px-4 rounded-lg bg-surface border border-border group"
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
              local.tipo === "doador" ? "bg-primary/10" : "bg-muted"
            }`}>
              {local.tipo === "doador" ? (
                <Building2 size={14} className="text-primary" />
              ) : (
                <User size={14} className="text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground block truncate">{local.nome}</span>
              <span className="text-[11px] text-muted-foreground">
                {local.tipo === "doador" ? "Doador" : "Beneficiário"} · {local.documento}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                onClick={() => openEdit(local)}
                className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => handleDelete(local.id)}
                className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">Nenhum local encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
