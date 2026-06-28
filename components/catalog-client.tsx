'use client'

import { useState, useMemo } from 'react'
import { ProductCard } from '@/components/product-card'
import { CategoryFilter } from '@/components/category-filter'
import type { Product } from '@/lib/products'

interface CatalogClientProps {
  initialProducts: Product[]
  searchQuery: string
}

export function CatalogClient({ initialProducts, searchQuery }: CatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [...new Set(initialProducts.map((p) => p.category))]

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, initialProducts])

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-24 scroll-mt-24">
      <div className="mb-4 sm:mb-10">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <p className="text-xs sm:text-sm text-muted-foreground mt-2.5 px-0.5">
          {filteredProducts.length}{' '}
          {filteredProducts.length === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="--font-poppins text-2xl text-foreground mb-2">
            No encontramos productos
          </p>
          <p className="text-muted-foreground">Intenta con otra búsqueda o categoría</p>
        </div>
      )}
    </section>
  )
}
