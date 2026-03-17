"use client"

import { useState } from "react"
import { Search, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CatalogHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function CatalogHeader({ searchQuery, onSearchChange }: CatalogHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center border-2 border-accent">
              <span className="text-primary-foreground font-serif font-bold text-lg">AC</span>
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground tracking-tight">
                AC Tech
              </h1>
              <p className="text-xs text-muted-foreground tracking-widest uppercase">
                Arroyo Castillo Technology
              </p>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-11 pr-4 h-11 bg-secondary border-0 rounded-full placeholder:text-muted-foreground focus-visible:ring-accent"
              />
            </div>
          </div>

          {/* Contact Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="outline" 
              className="rounded-full border-border hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300"
              onClick={() => window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}`, "_blank")}
            >
              Contactar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Search */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-11 pr-4 h-11 bg-secondary border-0 rounded-full"
              />
            </div>
            <Button 
              variant="outline" 
              className="w-full rounded-full"
              onClick={() => window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}`, "_blank")}
            >
              Contactar por WhatsApp
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
