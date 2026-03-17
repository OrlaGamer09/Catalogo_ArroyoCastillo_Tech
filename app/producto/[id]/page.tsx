"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Share2, MessageCircle, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProductById, products } from "@/lib/products"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = getProductById(parseInt(id))

  if (!product) {
    notFound()
  }

  const shareProduct = () => {
    const message = `Mira este producto de *AC Tech*:\n\n*${product.name}*\n${product.description}\n\nPrecio: $${product.price.toLocaleString()}\n\nConsultalo aqui: ${typeof window !== "undefined" ? window.location.href : ""}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const contactStore = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""
    const message = `Hola, estoy interesado en este producto de *AC Tech*:\n\n*${product.name}*\n${product.description}\n\nPrecio: $${product.price.toLocaleString()}\n\n¿Está disponible?`
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  // Get related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al catálogo
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-accent">
                <span className="text-primary-foreground font-serif font-bold text-xs">AC</span>
              </div>
              <span className="font-serif font-semibold text-foreground hidden sm:block">AC Tech</span>
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
          <Link href={`/?category=${product.category}`} className="hover:text-foreground transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-2xl bg-secondary border border-border">
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

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4 text-balance">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.fullDescription}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-border">
              <span className="font-serif text-4xl font-bold text-foreground">
                ${product.price.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">IVA incluido</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                onClick={contactStore}
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-14 text-base"
              >
                <MessageCircle className="h-5 w-5" />
                Consultar disponibilidad
              </Button>
              <Button
                onClick={shareProduct}
                variant="outline"
                size="lg"
                className="flex-1 gap-2 h-14 text-base border-2"
              >
                <Share2 className="h-5 w-5" />
                Compartir producto
              </Button>
            </div>

            {/* Features */}
            <div className="bg-secondary/50 rounded-xl p-6 mb-8">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                Características destacadas
              </h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <section className="mt-12 lg:mt-16">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
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
                  <span className="font-medium text-foreground">{spec.label}</span>
                  <span className="text-muted-foreground text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 lg:mt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Productos relacionados
              </h2>
              <Link
                href={`/?category=${product.category}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                Ver todos
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/producto/${relatedProduct.id}`}
                  className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="aspect-video relative overflow-hidden bg-secondary">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-foreground mb-1 line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="font-serif text-lg font-semibold text-foreground">
                      ${relatedProduct.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-accent">
                <span className="text-primary-foreground font-serif font-bold text-xs">AC</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2024 Arroyo-Castillo SAS
              </p>
            </div>
            <button
              onClick={contactStore}
              className="text-sm font-medium text-foreground hover:text-accent transition-colors flex items-center gap-2"
            >
              Contáctanos por WhatsApp
              <MessageCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
