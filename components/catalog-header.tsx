"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, Menu, X, Settings } from "lucide-react"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CatalogHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function CatalogHeader({ searchQuery, onSearchChange }: CatalogHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/auth/check')
        const data = await res.json()
        setIsAdmin(data.isAdmin)
      } catch (error) {
        setIsAdmin(false)
      }
    }

    checkAdmin()
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 shrink-0">
              <Image
                src="/icon.png"
                alt="AC Tech Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="--font-poppins text-xl font-semibold text-foreground tracking-tight uppercase">
                AC Tech
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
                Arroyo Castillo Technology
              </p>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className={`relative w-full transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${searchFocused ? 'text-primary' : 'text-muted-foreground'}`} />
              <Input
                type="search"
                placeholder="Buscar productos, categorías..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="pl-11 pr-4 h-12 bg-secondary/80 border border-border/50 rounded-xl placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 focus-visible:bg-background transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Theme Toggle + Admin Icon */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/admin"
                      className="inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-secondary transition-colors duration-200"
                    >
                      <Settings className="h-5 w-5 text-foreground" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Panel de administración</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Search */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-11 pr-10 h-12 bg-secondary/80 border border-border/50 rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-center gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-secondary transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5 text-foreground" />
                </Link>
              )}
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
