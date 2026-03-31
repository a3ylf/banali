import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppShell from "@/components/layout/AppShell";
import Index from "./pages/Index";
import Movimentar from "./pages/Movimentar";
import Entrada from "./pages/Entrada";
import Saida from "./pages/Saida";
import Locais from "./pages/Locais";
import Historico from "./pages/Historico";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex h-screen w-screen items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route path="/onboarding" element={<PublicOnlyRoute><Onboarding /></PublicOnlyRoute>} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/" element={<Index />} />
                <Route path="/movimentar" element={<Movimentar />} />
                <Route path="/movimentar/entrada" element={<Entrada />} />
                <Route path="/movimentar/saida" element={<Saida />} />
                <Route path="/locais" element={<Locais />} />
                <Route path="/historico" element={<Historico />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
