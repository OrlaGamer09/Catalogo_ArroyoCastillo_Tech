"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Share2, Check, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { ReviewsSection } from "@/components/reviews/reviews-section"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/products"

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const { addItem } = useCart()

  const currentPrice =
    product.variants && product.variants.length > 0
      ? product.variants[selectedVariantIndex]?.price || product.price
      : product.price

  const selectedVariant = product.variants ? product.variants[selectedVariantIndex] : null

  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -120, behavior: 'smooth' })
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 120, behavior: 'smooth' })

  const addToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: currentPrice,
      image: product.image,
      variantLabel: selectedVariant?.size,
      category: product.category,
      excludeFromBundleDiscount: product.excludeFromBundleDiscount,
    })
  }

  const shareProduct = () => {
    let message = `Mira este producto de *AC Tech*:\n\n*${product.name}`
    if (selectedVariant) message += ` (${selectedVariant.size})`
    message += `*\n${product.description}\n\nPrecio: $${currentPrice.toLocaleString()}\n\nConsultalo aqui: ${
      typeof window !== "undefined" ? window.location.href : ""
    }`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex-1">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Volver al catálogo</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full overflow-hidden">
                <Image src="/icon.png" alt="AC Tech Logo" fill className="object-contain bg-transparent" />
              </div>
              <span className="--font-poppins font-semibold text-foreground hidden sm:block uppercase">
                AC Tech
              </span>
            </div>

            <div className="flex-1 flex items-center justify-end gap-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Inicio
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/?category=${product.category}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="space-y-4">
            <div
              className="relative overflow-hidden rounded-2xl bg-secondary border border-border"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <span className="absolute top-4 left-4 px-4 py-1.5 text-xs font-medium tracking-wider uppercase bg-card/90 backdrop-blur-sm rounded-full text-foreground">
                {product.category}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="--font-poppins text-3xl font-semibold text-foreground mb-4 text-balance">
                {product.name}
              </h1>
              <p className="text-l text-muted-foreground leading-relaxed">{product.fullDescription}</p>
            </div>

            {/* Price */}
            <div
              className={`flex items-baseline gap-3 pb-6 border-b border-border ${
                product.variants && product.variants.length > 0 ? "mb-8" : "mb-6"
              }`}
            >
              <span className="--font-poppins text-3xl font-bold text-foreground">
                ${currentPrice.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">IVA incluido</span>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8 pb-8 border-b border-border">
                <label className="block text-sm font-medium text-foreground mb-4">
                  Selecciona el tamaño:
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariantIndex(index)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                        selectedVariantIndex === index
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-secondary text-foreground border border-border hover:border-primary hover:shadow-md"
                      }`}
                    >
                      {variant.size}
                      {selectedVariantIndex === index && <Check className="h-4 w-4" />}
                      <span className="text-sm opacity-75">${variant.price.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                onClick={addToCart}
                size="lg"
                className="w-full sm:flex-1 gap-2 h-11 text-base"
              >
                <ShoppingCart className="h-5 w-5" />
                Agregar al carrito
              </Button>
              <Button
                onClick={shareProduct}
                variant="outline"
                size="lg"
                className="w-full sm:flex-1 gap-2 h-11 text-base border-2 hover:bg-secondary hover:text-foreground"
              >
                <Share2 className="h-5 w-5" />
                Compartir producto
              </Button>
            </div>
          </div>
        </div>

        {/* Specs */}
        <section className="mt-12 lg:mt-16">
          <h2 className="--font-poppins text-2xl font-semibold text-foreground mb-6">
            Especificaciones técnicas
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="grid sm:grid-cols-2">
              {product.specs.map((spec, index) => (
                <div
                  key={index}
                  className={`flex justify-between gap-4 px-6 py-4 ${
                    index % 2 === 0 ? "bg-secondary/30" : ""
                  } ${index < product.specs.length - 2 ? "border-b border-border" : ""}`}
                >
                  <span className="font-medium text-foreground text-md">{spec.label}</span>
                  <span className="text-muted-foreground text-right text-md">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-10 sm:mt-16 lg:mt-24">
            <div className="flex items-center justify-between mb-4 sm:mb-8">
              <h2 className="--font-poppins text-xl sm:text-2xl font-semibold text-foreground">
                Productos similares
              </h2>
              <div className="flex items-center gap-2">
                {relatedProducts.length > 3 && (
                  <div className="flex gap-1 sm:hidden">
                    <button
                      onClick={scrollLeft}
                      className="p-1.5 rounded-lg border border-border hover:bg-secondary transition-colors"
                      aria-label="Anterior"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={scrollRight}
                      className="p-1.5 rounded-lg border border-border hover:bg-secondary transition-colors"
                      aria-label="Siguiente"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <Link
                  href={`/?category=${product.category}`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <span className="sm:hidden">Todos</span>
                  <span className="hidden sm:inline">Ver todos</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Mobile: horizontal scroll carousel */}
            <div
              ref={scrollRef}
              className="sm:hidden flex overflow-x-auto gap-3 snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/producto/${related.id}`}
                  className="flex-none w-[calc(33.33%-8px)] snap-start group bg-card rounded-xl overflow-hidden border border-border active:scale-95 transition-transform duration-150"
                >
                  <div className="aspect-square relative overflow-hidden bg-secondary">
                    <Image
                      src={related.image}
                      alt={related.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-[11px] font-semibold text-foreground line-clamp-2 leading-tight mb-1">
                      {related.name}
                    </h3>
                    <p className="--font-poppins text-xs font-bold text-foreground">
                      ${related.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop: grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/producto/${related.id}`}
                  className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="aspect-video relative overflow-hidden bg-secondary">
                    <Image
                      src={related.image}
                      alt={related.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-1 line-clamp-1">{related.name}</h3>
                    <p className="--font-poppins text-base font-semibold text-foreground">
                      ${related.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <ReviewsSection productId={product.id} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Arroyo Castillo SAS. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
