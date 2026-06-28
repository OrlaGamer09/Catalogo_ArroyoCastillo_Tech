"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

const CHARGER_CABLE_BUNDLE_DISCOUNT = 10000

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  variantLabel?: string
  category?: string
  excludeFromBundleDiscount?: boolean
}

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (id: number, variantLabel?: string) => void
  updateQuantity: (id: number, quantity: number, variantLabel?: string) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  bundleDiscount: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = "ac-tech-cart"

function sameLine(item: CartItem, id: number, variantLabel?: string) {
  return item.id === id && item.variantLabel === variantLabel
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, item.id, item.variantLabel))
      if (existing) {
        return prev.map((i) =>
          sameLine(i, item.id, item.variantLabel) ? { ...i, quantity: i.quantity + quantity } : i,
        )
      }
      return [...prev, { ...item, quantity }]
    })
  }

  const removeItem: CartContextValue["removeItem"] = (id, variantLabel) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, id, variantLabel)))
  }

  const updateQuantity: CartContextValue["updateQuantity"] = (id, quantity, variantLabel) => {
    if (quantity <= 0) {
      removeItem(id, variantLabel)
      return
    }
    setItems((prev) =>
      prev.map((i) => (sameLine(i, id, variantLabel) ? { ...i, quantity } : i)),
    )
  }

  const clearCart = () => setItems([])

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.quantity * i.price, 0), [items])

  const bundleDiscount = useMemo(() => {
    let chargerQty = 0
    let cableQty = 0
    for (const item of items) {
      if (item.category === "Cargadores" && !item.excludeFromBundleDiscount) {
        chargerQty += item.quantity
      } else if (item.category === "Cables") {
        cableQty += item.quantity
      }
    }
    const pairs = Math.min(chargerQty, cableQty)
    return pairs * CHARGER_CABLE_BUNDLE_DISCOUNT
  }, [items])

  const totalPrice = Math.max(subtotal - bundleDiscount, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        bundleDiscount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart debe usarse dentro de un CartProvider")
  return ctx
}
