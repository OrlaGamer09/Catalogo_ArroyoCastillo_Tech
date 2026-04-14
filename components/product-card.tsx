"use client"

import Image from "next/image"
import Link from "next/link"
import { Share2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const shareProduct = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const message = `Mira este producto de *AC Tech*:\n\n*${product.name}*\n${product.description}\n\nPrecio: $${product.price.toLocaleString()}\n\nConsultalo aqui: ${window.location.origin}/producto/${product.id}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const contactStore = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""
    const message = `Hola, estoy interesado en este producto de *AC Tech*:\n\n*${product.name}*\n${product.description}\n\nPrecio: $${product.price.toLocaleString()}\n\n¿Está disponible?`
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Link href={`/producto/${product.id}`}>
      <article className="group relative bg-card rounded-xl overflow-hidden border border-border transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer h-full">
        <div className="aspect-square relative overflow-hidden bg-secondary">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
          
          {/* Category Badge */}
          <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium tracking-wider uppercase bg-card/90 backdrop-blur-sm rounded-full text-foreground">
            {product.category}
          </span>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="icon"
              onClick={shareProduct}
              className="h-9 w-9 rounded-full bg-card/90 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-lg"
              aria-label={`Compartir ${product.name}`}
              title="Compartir con un amigo"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={contactStore}
              className="h-9 w-9 rounded-full bg-primary/90 backdrop-blur-sm hover:bg-primary text-primary-foreground transition-all duration-300 shadow-lg"
              aria-label={`Consultar por ${product.name}`}
              title="Consultar disponibilidad"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <h3 className="--font-poppins text-xl font-bold text-foreground leading-tight text-balance mb-3">
            {product.name}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Variant Badge */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-4 inline-block px-2 py-1 bg-accent/20 rounded-md">
              <span className="text-xs font-medium text-accent-foreground">
                {product.variants.length} tamaño{product.variants.length > 1 ? 's' : ''} disponible{product.variants.length > 1 ? 's' : ''}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="--font-poppins text-xl font-semibold text-foreground">
              ${product.price.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground tracking-wide uppercase">
              Ver detalles
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
