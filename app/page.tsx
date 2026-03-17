"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { ProductCard } from "@/components/product-card"
import { CatalogHeader } from "@/components/catalog-header"
import { CategoryFilter } from "@/components/category-filter"
import { ArrowRight, MessageCircle, Zap, Shield, Truck } from "lucide-react"
import { products, categories } from "@/lib/products"

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const contactStore = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""
    window.open(`https://wa.me/${whatsappNumber}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
                <Zap className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">Arroyo Castillo Technology</span>
              </div>
              
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.1] text-balance mb-6">
                Potencia tu
                <span className="block text-primary mt-1">productividad</span>
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8">
                Accesorios tecnologicos de alta calidad para maximizar tu rendimiento. 
                Cables, cargadores y perifericos premium.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                <button
                  onClick={contactStore}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-medium shadow-lg shadow-[#25D366]/25 hover:shadow-xl hover:shadow-[#25D366]/30 transition-all duration-300"
                >
                  <MessageCircle className="h-5 w-5" />
                  Consultar por WhatsApp
                </button>
                <a
                  href="#catalogo"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-foreground font-medium hover:text-primary transition-colors group"
                >
                  Ver catalogo
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Garantia incluida</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Envio nacional</span>
                </div>
              </div>
            </div>

            {/* Right Content - Feature Cards */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Carga Rapida</h3>
                    <p className="text-sm text-muted-foreground">Tecnologia GaN hasta 100W</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Calidad Premium</h3>
                    <p className="text-sm text-muted-foreground">Productos certificados</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-primary rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center mb-4">
                      <MessageCircle className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-primary-foreground mb-2">Atencion Directa</h3>
                    <p className="text-sm text-primary-foreground/80">Consulta por WhatsApp</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Envio Seguro</h3>
                    <p className="text-sm text-muted-foreground">A todo el pais</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3" />
      </section>

      {/* Catalog Section */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 scroll-mt-24">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-foreground mb-2">
              No encontramos productos
            </p>
            <p className="text-muted-foreground">
              Intenta con otra búsqueda o categoría
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 flex-shrink-0">
                <Image
                  src="/icon.png"
                  alt="AC Tech Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-serif text-lg font-semibold text-foreground">AC Tech</p>
                <p className="text-xs text-muted-foreground">Arroyo Castillo Technology</p>
              </div>
            </div>

            <button
              onClick={contactStore}
              className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Contáctanos por WhatsApp
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 Arroyo-Castillo SAS. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
