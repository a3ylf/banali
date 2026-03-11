"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground font-sans">
            Alimenta
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#funcionalidades" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Funcionalidades
          </Link>
          <Link href="#como-funciona" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Como Funciona
          </Link>
          <Link href="#depoimentos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Depoimentos
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Comece Gratis</Link>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/60 bg-background px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="#funcionalidades" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
              Funcionalidades
            </Link>
            <Link href="#como-funciona" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
              Como Funciona
            </Link>
            <Link href="#depoimentos" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
              Depoimentos
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Entrar</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Comece Gratis</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
