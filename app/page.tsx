"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "@/components/product-card"
import { CatalogHeader } from "@/components/catalog-header"
import { CategoryFilter } from "@/components/category-filter"
import { ArrowRight, MessageCircle } from "lucide-react"
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
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-medium tracking-widest uppercase text-accent mb-4">
              Arroyo Castillo Technology
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground leading-tight text-balance mb-6">
              Tecnología premium
              <span className="block text-primary">para tu vida</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
              Descubre nuestra selección curada de productos tecnológicos. Consulta disponibilidad 
              y precios directamente por WhatsApp con un solo clic.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={contactStore}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                Contactar por WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
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
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center border-2 border-accent">
                <span className="text-primary-foreground font-serif font-bold text-sm">AC</span>
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
              © 2024 Arroyo-Castillo SAS. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
