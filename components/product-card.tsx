"use client"

import Image from "next/image"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    category: string
    image: string
    description: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const shareOnWhatsApp = () => {
    const message = `¡Mira este producto! 🔥\n\n*${product.name}*\n${product.description}\n\n💰 Precio: $${product.price.toLocaleString()}\n\nConsúltalo en nuestro catálogo`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <article className="group relative bg-card rounded-xl overflow-hidden border border-border transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-1">
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
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-serif text-xl font-medium text-foreground leading-tight text-balance">
            {product.name}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={shareOnWhatsApp}
            className="shrink-0 h-9 w-9 rounded-full bg-accent/10 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            aria-label={`Compartir ${product.name} en WhatsApp`}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="font-serif text-2xl font-semibold text-foreground">
            ${product.price.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground tracking-wide uppercase">
            IVA incluido
          </span>
        </div>
      </div>
    </article>
  )
}
