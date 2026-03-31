import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, UserPlus, Check, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { api } from "@/lib/api";

type Step = 1 | 2;
type View = "login" | "register";

interface OngData {
  nome: string;
  cnpj: string;
  endereco: string;
}

interface AdminData {
  nome: string;
  email: string;
  senha: string;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [view, setView] = useState<View>("login");
  const [step, setStep] = useState<Step>(1);
  const [ong, setOng] = useState<OngData>({ nome: "", cnpj: "", endereco: "" });
  const [admin, setAdmin] = useState<AdminData>({ nome: "", email: "", senha: "" });
  const [loginData, setLoginData] = useState({ email: "", senha: "" });
  const [isLoading, setIsLoading] = useState(false);

  const canAdvanceRegister = step === 1
    ? ong.nome.trim() && ong.cnpj.trim()
    : admin.nome.trim() && admin.email.trim() && admin.senha.length >= 6;

  const canLogin = loginData.email.trim() && loginData.senha.length >= 6;

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.post("/authentication/login", {
        email: loginData.email,
        senha: loginData.senha
      });
      await login(data.access_token);
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error) {
      toast.error("Credenciais inválidas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      // Aqui integraria a criação da ONG
      // Por enquanto vamos apenas criar o usuário
      await api.post("/authentication/register", {
        nome: admin.nome,
        email: admin.email,
        senha: admin.senha
      });
      
      toast.success("Conta criada! Por favor, faça login.");
      setView("login");
      setLoginData({ email: admin.email, senha: "" });
    } catch (error) {
      toast.error("Erro ao criar conta. Verifique os dados ou tente outro e-mail.");
    } finally {
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Alimentar<span className="text-primary">OS</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Gestão inteligente de alimentos
          </p>
        </motion.div>

        {/* View Switcher Tabs */}
        <div className="flex bg-secondary p-1 rounded-lg mb-8">
          <button
            onClick={() => setView("login")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              view === "login" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => {
              setView("register");
              setStep(1);
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              view === "register" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Criar conta
          </button>
        </div>

        {view === "register" && (
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                    s < step
                      ? "bg-primary text-primary-foreground"
                      : s === step
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {s < step ? <Check size={14} /> : s}
                </div>
                {s < 2 && (
                  <div
                    className={`w-12 h-px transition-colors duration-300 ${
                      step > 1 ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step content */}
        <div className="bg-surface rounded-xl border border-border p-6 min-h-[320px] relative overflow-hidden flex flex-col">
          <AnimatePresence mode="wait" custom={view === "login" ? 1 : step}>
            {view === "login" ? (
              <motion.div
                key="login"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-6">
                  <LogIn size={18} className="text-primary" />
                  <h2 className="text-lg font-medium text-foreground">Acesse sua conta</h2>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                      E-mail
                    </label>
                    <Input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="email@ong.org.br"
                      className="h-12 text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                      Senha
                    </label>
                    <Input
                      type="password"
                      value={loginData.senha}
                      onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                      placeholder="Sua senha"
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={!canLogin || isLoading}
                  className="w-full h-11 mt-6"
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </motion.div>
            ) : step === 1 ? (
              <motion.div
                key="step1"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Building2 size={18} className="text-primary" />
                  <h2 className="text-lg font-medium text-foreground">Dados da ONG</h2>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                      Nome da organização
                    </label>
                    <Input
                      value={ong.nome}
                      onChange={(e) => setOng({ ...ong, nome: e.target.value })}
                      placeholder="Ex: Instituto Alimentar"
                      className="h-12 text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                      CNPJ
                    </label>
                    <Input
                      value={ong.cnpj}
                      onChange={(e) => setOng({ ...ong, cnpj: e.target.value })}
                      placeholder="00.000.000/0000-00"
                      className="h-12 text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                      Endereço <span className="text-muted-foreground/50">(opcional)</span>
                    </label>
                    <Input
                      value={ong.endereco}
                      onChange={(e) => setOng({ ...ong, endereco: e.target.value })}
                      placeholder="Rua, número, cidade"
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end mt-6">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!canAdvanceRegister}
                    className="h-11 px-6 gap-2 w-full"
                  >
                    Próximo <ArrowRight size={16} />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-6">
                  <UserPlus size={18} className="text-primary" />
                  <h2 className="text-lg font-medium text-foreground">Administrador</h2>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                      Nome completo
                    </label>
                    <Input
                      value={admin.nome}
                      onChange={(e) => setAdmin({ ...admin, nome: e.target.value })}
                      placeholder="Seu nome"
                      className="h-12 text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                      E-mail
                    </label>
                    <Input
                      type="email"
                      value={admin.email}
                      onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                      placeholder="email@ong.org.br"
                      className="h-12 text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                      Senha
                    </label>
                    <Input
                      type="password"
                      value={admin.senha}
                      onChange={(e) => setAdmin({ ...admin, senha: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Voltar
                  </button>

                  <Button
                    onClick={handleRegister}
                    disabled={!canAdvanceRegister || isLoading}
                    className="h-11 px-6 gap-2"
                  >
                    {isLoading ? "Criando..." : <>Criar conta <Check size={16} /></>}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
