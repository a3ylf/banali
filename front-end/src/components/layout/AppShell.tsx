import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Package, ArrowLeftRight, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import UserProfileMenu from "@/components/layout/UserProfileMenu";

const tabs = [
  { path: "/", icon: Package, label: "Estoque" },
  { path: "/movimentar", icon: ArrowLeftRight, label: "Movimentar" },
  { path: "/locais", icon: MapPin, label: "Locais" },
  { path: "/historico", icon: Clock, label: "Histórico" },
];

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* Top header with avatar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-12 px-4 max-w-2xl mx-auto">
          <UserProfileMenu />
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Alimentar
          </span>
          <div className="w-8" /> {/* spacer for centering */}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-[var(--tab-bar-height)]">
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border pb-safe">
        <div className="flex items-center justify-around h-[var(--tab-bar-height)] max-w-lg mx-auto">
          {tabs.map((tab) => {
            const active = isActive(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center gap-1 py-2 px-4 transition-colors"
              >
                {active && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-px left-2 right-2 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <tab.icon
                  size={20}
                  className={active ? "text-primary" : "text-muted-foreground"}
                  strokeWidth={active ? 2 : 1.5}
                />
                <span
                  className={`text-[11px] tracking-wide ${
                    active ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
