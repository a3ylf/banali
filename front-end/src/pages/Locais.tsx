import { useEffect, useState } from "react";
import { Building2, User, Plus, X, Trash2, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import CommandSearch from "@/components/shared/CommandSearch";
import { api } from "@/lib/api";

function formatDocumento(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function getDocRaw(value: string): string {
  return value.replace(/\D/g, "").slice(0, 14);
}

interface LocalEntity {
  id_local: string;
  nome_local: string;
  cpf_local: string | null;
  cnpj_local: string | null;
}

export default function Locais() {
  const [search, setSearch] = useState("");
  const [allLocais, setAllLocais] = useState<LocalEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formNome, setFormNome] = useState("");
  const [formDoc, setFormDoc] = useState("");

  useEffect(() => {
    void loadLocais();
  }, []);

  async function loadLocais() {
    setIsLoading(true);
    try {
      const res = await api.get("/demand/places/");
      setAllLocais(res.data.locais || []);
    } catch (error) {
      toast.error("Erro ao carregar locais.");
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = allLocais.filter((local) => {
    const documento = local.cnpj_local || local.cpf_local || "";
    return (
      local.nome_local.toLowerCase().includes(search.toLowerCase()) ||
      documento.includes(getDocRaw(search))
    );
  });

  const openNew = () => {
    setEditingId(null);
    setFormNome("");
    setFormDoc("");
    setShowForm(true);
  };

  const openEdit = (local: LocalEntity) => {
    setEditingId(local.id_local);
    setFormNome(local.nome_local);
    setFormDoc(formatDocumento(local.cnpj_local || local.cpf_local || ""));
    setShowForm(true);
  };

  const handleDocChange = (value: string) => {
    const raw = getDocRaw(value);
    setFormDoc(formatDocumento(raw));
  };

  const handleSave = async () => {
    const rawDoc = getDocRaw(formDoc);

    if (!formNome.trim()) {
      toast.error("Preencha o nome do local.");
      return;
    }
    if (rawDoc.length !== 11 && rawDoc.length !== 14) {
      toast.error("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
      return;
    }

    const payload = {
      nome_local: formNome.trim(),
      cpf_local: rawDoc.length === 11 ? rawDoc : null,
      cnpj_local: rawDoc.length === 14 ? rawDoc : null,
    };

    setIsSaving(true);
    try {
      if (editingId) {
        const res = await api.put(`/demand/places/${editingId}`, payload);
        setAllLocais((prev) =>
          prev.map((local) => (local.id_local === editingId ? res.data : local))
        );
        toast.success("Local atualizado.");
      } else {
        const res = await api.post("/demand/places/", payload);
        setAllLocais((prev) => [res.data, ...prev]);
        toast.success("Local cadastrado.");
      }

      setShowForm(false);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erro ao salvar local.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeletingId(id);
    try {
      await api.delete(`/demand/places/${id}`);
      setAllLocais((prev) => prev.filter((local) => local.id_local !== id));
      toast.success("Local removido.");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erro ao remover local.");
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <PageHeader
        title="Locais"
        subtitle="Cadastro de locais e documentos"
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
                <button
                  onClick={() => void handleSave()}
                  disabled={isSaving}
                  className="flex-1 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
                >
                  {isSaving ? "Salvando..." : editingId ? "Salvar" : "Cadastrar"}
                </button>
                <button onClick={() => setShowForm(false)} className="h-9 px-4 rounded-md bg-secondary text-muted-foreground text-sm">
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">Carregando locais...</p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((local) => (
            <div
              key={local.id_local}
              className="flex items-center gap-3 py-3 px-4 rounded-lg bg-surface border border-border group"
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                local.cnpj_local ? "bg-primary/10" : "bg-muted"
              }`}>
                {local.cnpj_local ? (
                  <Building2 size={14} className="text-primary" />
                ) : (
                  <User size={14} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground block truncate">{local.nome_local}</span>
                <span className="text-[11px] text-muted-foreground">
                  {local.cnpj_local ? "CNPJ" : "CPF"} · {formatDocumento(local.cnpj_local || local.cpf_local || "")}
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
                  onClick={() => void handleDelete(local.id_local)}
                  disabled={isDeletingId === local.id_local}
                  className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-60"
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
      )}
    </div>
  );
}
