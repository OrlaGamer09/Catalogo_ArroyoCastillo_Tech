"use client"

import Link from "next/link"
import { Share2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/products"
import { ProductImage } from "@/components/product-image"

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart()

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      excludeFromBundleDiscount: product.excludeFromBundleDiscount,
    })
  }

  const shareProduct = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const message = `Mira este producto de *AC Tech*:\n\n*${product.name}*\n${product.description}\n\nPrecio: $${product.price.toLocaleString()}\n\nConsultalo aqui: ${window.location.origin}/producto/${product.id}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <Link href={`/producto/${product.id}`}>
      <article className="group relative bg-card rounded-xl overflow-hidden border border-border transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer h-full">

        {/* Image */}
        <div className="aspect-square relative overflow-hidden bg-secondary">
          <ProductImage
            image={product.image}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />

          {/* Category Badge — hidden on mobile, visible sm+ */}
          <span className="hidden sm:block absolute top-4 left-4 px-3 py-1 text-xs font-medium tracking-wider uppercase bg-card/90 backdrop-blur-sm rounded-full text-foreground">
            {product.category}
          </span>

          {/* Share button — hover only on desktop */}
          <div className="hidden sm:flex absolute top-4 right-4 flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="icon"
              onClick={shareProduct}
              className="h-9 w-9 rounded-full bg-primary/90 backdrop-blur-sm hover:bg-primary text-primary-foreground shadow-lg"
              aria-label={`Compartir ${product.name}`}
              title="Compartir con un amigo"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5 sm:p-5">
          <h3 className="--font-poppins text-xs sm:text-base font-semibold text-foreground leading-tight line-clamp-2 mb-1 sm:mb-2">
            {product.name}
          </h3>

          {/* Description — hidden on mobile */}
          <p className="hidden sm:block text-muted-foreground text-sm mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Variant badge — hidden on mobile */}
          {product.variants && product.variants.length > 0 && (
            <div className="hidden sm:inline-block mb-3 px-2 py-1 bg-accent/20 rounded-md">
              <span className="text-xs font-medium text-accent-foreground">
                {product.variants.length} tamaño{product.variants.length > 1 ? "s" : ""} disponible{product.variants.length > 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Price + Add to cart */}
          <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-border gap-1">
            <span className="--font-poppins text-sm sm:text-lg font-bold text-foreground">
              ${product.price.toLocaleString()}
            </span>

            {/* Mobile: icon-only button */}
            <Button
              size="icon"
              onClick={addToCart}
              className="h-7 w-7 sm:hidden shrink-0"
              aria-label={`Agregar ${product.name} al carrito`}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </Button>

            {/* Desktop: full button */}
            <Button
              size="sm"
              onClick={addToCart}
              className="hidden sm:flex gap-1.5"
              aria-label={`Agregar ${product.name} al carrito`}
            >
              <ShoppingCart className="h-4 w-4" />
              Agregar
            </Button>
          </div>
        </div>
      </article>
    </Link>
  )
}
