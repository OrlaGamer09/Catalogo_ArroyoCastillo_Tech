"use client"

import { useState } from "react"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCart } from "@/lib/cart-context"

const PAYMENT_METHODS = ["Efectivo", "Transferencia", "Otro"]

function formatCurrency(value: number) {
  return `$${value.toLocaleString("es-CO")}`
}

export function CartSheet() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice, clearCart } = useCart()

  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [phone, setPhone] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Efectivo")
  const [errors, setErrors] = useState<{ address?: string; city?: string; phone?: string }>({})

  const isCartEmpty = items.length === 0

  const handleConfirm = () => {
    const newErrors: { address?: string; city?: string; phone?: string } = {}
    if (!address.trim()) newErrors.address = "La dirección de entrega es obligatoria"
    if (!city.trim()) newErrors.city = "La ciudad es obligatoria"
    if (!phone.trim()) newErrors.phone = "El teléfono de contacto es obligatorio"
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""

    const productLines = items
      .map((item) => {
        const variant = item.variantLabel ? ` (${item.variantLabel})` : ""
        return `• ${item.name}${variant} x${item.quantity} — ${formatCurrency(item.price * item.quantity)}`
      })
      .join("\n")

    const message = [
      "Hola, quiero hacer el siguiente pedido en *AC Tech*:",
      "",
      productLines,
      "",
      `*Total: ${formatCurrency(totalPrice)}*`,
      "",
      `*Dirección de entrega:* ${address.trim()}`,
      `*Ciudad:* ${city.trim()}`,
      `*Teléfono de contacto:* ${phone.trim()}`,
      `*Medio de pago:* ${paymentMethod}`,
    ].join("\n")

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Tu carrito
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {isCartEmpty ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Tu carrito está vacío. Agrega productos desde el catálogo.
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.id}-${item.variantLabel ?? ""}`}
                  className="flex items-start justify-between gap-3 border-b border-border pb-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                    {item.variantLabel && (
                      <p className="text-xs text-muted-foreground">{item.variantLabel}</p>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(item.price)}</p>

                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantLabel)}
                        aria-label="Disminuir cantidad"
                        className="hover:bg-secondary hover:text-foreground"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantLabel)}
                        aria-label="Aumentar cantidad"
                        className="hover:bg-secondary hover:text-foreground"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeItem(item.id, item.variantLabel)}
                      aria-label={`Eliminar ${item.name}`}
                      className="hover:bg-secondary hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isCartEmpty && (
          <div className="space-y-4 border-t border-border px-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">{formatCurrency(totalPrice)}</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="cart-address">Dirección de entrega</Label>
                <Input
                  id="cart-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, número, barrio, ciudad"
                  aria-invalid={!!errors.address}
                />
                {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cart-city">Ciudad</Label>
                <Input
                  id="cart-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej: Barranquilla"
                  aria-invalid={!!errors.city}
                />
                {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cart-phone">Teléfono de contacto</Label>
                <Input
                  id="cart-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: 3001234567"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cart-payment">Medio de pago</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="cart-payment" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <SheetFooter>
          <Button
            onClick={handleConfirm}
            disabled={isCartEmpty}
            className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#20BD5A]"
          >
            Confirmar pedido por WhatsApp
          </Button>
          {!isCartEmpty && (
            <Button
              variant="ghost"
              onClick={clearCart}
              className="w-full text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              Vaciar carrito
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
