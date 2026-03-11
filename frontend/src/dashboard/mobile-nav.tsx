"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  Tag,
  BarChart3,
  Users,
  AlertTriangle,
  Leaf,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/estoque", icon: Package, label: "Estoque" },
  { href: "/dashboard/movimentacoes", icon: ArrowRightLeft, label: "Movimentacoes" },
  { href: "/dashboard/categorias", icon: Tag, label: "Categorias" },
  { href: "/dashboard/relatorios", icon: BarChart3, label: "Relatorios" },
  { href: "/dashboard/operadores", icon: Users, label: "Operadores" },
  { href: "/dashboard/alertas", icon: AlertTriangle, label: "Alertas" },
]

export function DashboardMobileNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Leaf className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-sidebar-foreground">Alimenta</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
