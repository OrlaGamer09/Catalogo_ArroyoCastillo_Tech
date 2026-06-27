'use client'

import { useState } from 'react'
import { ArrowRight, MessageCircle, Zap, Shield, Truck } from 'lucide-react'
import { CatalogHeader } from '@/components/catalog-header'
import { CatalogClient } from '@/components/catalog-client'
import type { Product } from '@/lib/products'

interface CatalogShellProps {
  initialProducts: Product[]
}

export function CatalogShell({ initialProducts }: CatalogShellProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Mobile hero — minimal */}
      <section className="sm:hidden relative overflow-hidden bg-gradient-to-b from-primary/5 to-background px-4 pt-4 pb-3">
        <span className="inline-flex items-center gap-1 mb-1.5 px-2 py-0.5 bg-primary/10 rounded-full text-primary text-[10px] font-semibold tracking-wide uppercase">
          Accesorios premium
        </span>
        <h2 className="--font-poppins text-2xl leading-tight font-semibold text-foreground">
          Potencia tu <span className="text-primary">productividad</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Cables, cargadores y periféricos de alta calidad.
        </p>
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-2xl -z-10 translate-x-1/3 -translate-y-1/3" />
      </section>

      {/* Desktop hero — full */}
      <section className="hidden sm:block relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="--font-poppins text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.1] text-balance mb-6">
                Potencia tu
                <span className="block text-primary mt-1">productividad</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8">
                Accesorios tecnológicos de alta calidad para maximizar tu rendimiento. Cables,
                cargadores y periféricos premium.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-10">
                <a
                  href="#catalogo"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  Ver catálogo
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Garantía incluida</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Envío nacional</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Carga Rápida</h3>
                    <p className="text-sm text-muted-foreground">Tecnología GaN hasta 100W</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Calidad Premium</h3>
                    <p className="text-sm text-muted-foreground">Productos certificados</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Atención Directa</h3>
                    <p className="text-sm text-muted-foreground">Consulta por WhatsApp</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Envío Seguro</h3>
                    <p className="text-sm text-muted-foreground">A todo el país</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3" />
      </section>

      {/* Catalog */}
      <CatalogClient initialProducts={initialProducts} searchQuery={searchQuery} />

      {/* WhatsApp CTA */}
      <section className="border-t border-border">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#25D366]/10 rounded-2xl mb-5">
            <MessageCircle className="h-7 w-7 text-[#25D366]" />
          </div>
          <h3 className="--font-poppins text-xl sm:text-2xl font-semibold text-foreground mb-2">
            ¿Tienes alguna pregunta?
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base mb-6">
            Escríbenos por WhatsApp y te ayudamos a elegir el producto ideal.
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-medium shadow-lg shadow-[#25D366]/20 hover:shadow-xl hover:shadow-[#25D366]/30 transition-all duration-300"
          >
            <MessageCircle className="h-5 w-5" />
            Consultar por WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 Arroyo Castillo SAS. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
