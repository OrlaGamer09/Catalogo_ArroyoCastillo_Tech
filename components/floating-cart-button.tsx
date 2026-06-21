"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function FloatingCartButton() {
  const { totalItems, openCart } = useCart()

  return (
    <button
      onClick={openCart}
      aria-label="Abrir carrito de compras"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-200 hover:scale-105 hover:bg-primary/90"
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[oklch(0.577_0.245_27.325)] px-1 text-xs font-semibold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  )
}
