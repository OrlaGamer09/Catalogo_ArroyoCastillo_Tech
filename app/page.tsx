"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "@/components/product-card"
import { CatalogHeader } from "@/components/catalog-header"
import { CategoryFilter } from "@/components/category-filter"
import { ArrowRight } from "lucide-react"

const products = [
  {
    id: 1,
    name: "MacBook Pro 16\" M3 Max",
    price: 3499,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop",
    description: "Potencia profesional con chip M3 Max, pantalla Liquid Retina XDR y hasta 22 horas de batería"
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max",
    price: 1199,
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop",
    description: "Titanio de grado aeroespacial, chip A17 Pro y el sistema de cámara más avanzado"
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    price: 349,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop",
    description: "Auriculares inalámbricos con cancelación de ruido líder en la industria"
  },
  {
    id: 4,
    name: "iPad Pro 12.9\" M2",
    price: 1099,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop",
    description: "Pantalla Liquid Retina XDR, chip M2 y compatibilidad con Apple Pencil Pro"
  },
  {
    id: 5,
    name: "Samsung Galaxy S24 Ultra",
    price: 1299,
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop",
    description: "Galaxy AI integrado, cámara de 200MP y S Pen incluido"
  },
  {
    id: 6,
    name: "Apple Watch Ultra 2",
    price: 799,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=800&fit=crop",
    description: "El Apple Watch más resistente y capaz, diseñado para la aventura"
  },
  {
    id: 7,
    name: "Dell XPS 15 OLED",
    price: 1899,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=800&fit=crop",
    description: "Pantalla OLED 3.5K táctil, Intel Core i7 de 13ª generación"
  },
  {
    id: 8,
    name: "AirPods Pro 2",
    price: 249,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&h=800&fit=crop",
    description: "Audio espacial personalizado, cancelación activa de ruido y chip H2"
  },
  {
    id: 9,
    name: "Samsung Galaxy Tab S9 Ultra",
    price: 1199,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1632882765546-1ee75f53becb?w=800&h=800&fit=crop",
    description: "Pantalla Dynamic AMOLED 2X de 14.6\", S Pen incluido y resistencia IP68"
  },
  {
    id: 10,
    name: "Bose QuietComfort Ultra",
    price: 429,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop",
    description: "Audio inmersivo espacial con la mejor cancelación de ruido del mundo"
  },
  {
    id: 11,
    name: "Microsoft Surface Pro 9",
    price: 1599,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&h=800&fit=crop",
    description: "Versatilidad 2 en 1, Intel Core i7 y pantalla PixelSense Flow de 13\""
  },
  {
    id: 12,
    name: "Garmin Fenix 7X Pro",
    price: 899,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop",
    description: "GPS multibanda, linterna LED integrada y métricas avanzadas de entrenamiento"
  },
]

const categories = [...new Set(products.map((p) => p.category))]

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

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Colección 2024
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground leading-tight text-balance mb-6">
              Tecnología que inspira
              <span className="block">excelencia</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Descubre nuestra selección curada de productos premium. Comparte tus favoritos 
              directamente por WhatsApp con un solo clic.
            </p>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -z-10" />
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
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-lg">T</span>
              </div>
              <div>
                <p className="font-serif text-lg font-semibold text-foreground">TechVault</p>
                <p className="text-xs text-muted-foreground">Premium Tech</p>
              </div>
            </div>
            
            <button 
              onClick={() => window.open("https://wa.me/", "_blank")}
              className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Contáctanos por WhatsApp
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 TechVault. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
