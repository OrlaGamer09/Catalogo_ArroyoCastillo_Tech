"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ShoppingCart } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
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
import { useCart, type CartItem } from "@/lib/cart-context"

const PAYMENT_METHODS = ["Efectivo", "Transferencia"]

function formatCurrency(value: number) {
  return `$${value.toLocaleString("es-CO")}`
}

interface DeliveryFormValues {
  address: string
  city: string
  phone: string
  paymentMethod: string
}

interface DeliveryFormErrors {
  address?: string
  city?: string
  phone?: string
}

function DeliveryFormFields({
  values,
  errors,
  onChange,
}: {
  values: DeliveryFormValues
  errors: DeliveryFormErrors
  onChange: (field: keyof DeliveryFormValues, value: string) => void
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="cart-address">Dirección de entrega</Label>
        <Input
          id="cart-address"
          value={values.address}
          onChange={(e) => onChange("address", e.target.value)}
          placeholder="Calle, número, barrio"
          aria-invalid={!!errors.address}
        />
        {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cart-city">Ciudad</Label>
        <Input
          id="cart-city"
          value={values.city}
          onChange={(e) => onChange("city", e.target.value)}
          placeholder="Ej: Barranquilla"
          aria-invalid={!!errors.city}
        />
        {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cart-phone">Teléfono de contacto</Label>
        <Input
          id="cart-phone"
          value={values.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="Ej: 3001234567"
          aria-invalid={!!errors.phone}
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cart-payment">Medio de pago</Label>
        <Select value={values.paymentMethod} onValueChange={(v) => onChange("paymentMethod", v)}>
          <SelectTrigger id="cart-payment" className="w-full hover:bg-secondary hover:text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_METHODS.map((method) => (
              <SelectItem
                key={method}
                value={method}
                className="hover:bg-secondary hover:text-foreground focus:bg-secondary focus:text-foreground data-highlighted:bg-secondary data-highlighted:text-foreground"
              >
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function QuantityStepper({
  item,
  onChange,
}: {
  item: CartItem
  onChange: (quantity: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onChange(item.quantity - 1)}
        aria-label="Disminuir cantidad"
        className="hover:bg-secondary hover:text-foreground"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-6 text-center text-sm">{item.quantity}</span>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onChange(item.quantity + 1)}
        aria-label="Aumentar cantidad"
        className="hover:bg-secondary hover:text-foreground"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}

export function CartSheet() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, bundleDiscount, totalPrice, clearCart } =
    useCart()

  const [mobileStep, setMobileStep] = useState<"cart" | "info">("cart")
  const [values, setValues] = useState<DeliveryFormValues>({
    address: "",
    city: "",
    phone: "",
    paymentMethod: "Efectivo",
  })
  const [errors, setErrors] = useState<DeliveryFormErrors>({})

  const isCartEmpty = items.length === 0

  useEffect(() => {
    if (isOpen) setMobileStep("cart")
  }, [isOpen])

  const handleFieldChange = (field: keyof DeliveryFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleConfirm = () => {
    const newErrors: DeliveryFormErrors = {}
    if (!values.address.trim()) newErrors.address = "La dirección de entrega es obligatoria"
    if (!values.city.trim()) newErrors.city = "La ciudad es obligatoria"
    if (!values.phone.trim()) newErrors.phone = "El teléfono de contacto es obligatorio"
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
      `Subtotal: ${formatCurrency(subtotal)}`,
      ...(bundleDiscount > 0 ? [`Descuento cargador + cable: -${formatCurrency(bundleDiscount)}`] : []),
      `*Total: ${formatCurrency(totalPrice)}*`,
      "",
      `*Dirección de entrega:* ${values.address.trim()}`,
      `*Ciudad:* ${values.city.trim()}`,
      `*Teléfono de contacto:* ${values.phone.trim()}`,
      `*Medio de pago:* ${values.paymentMethod}`,
    ].join("\n")

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 sm:max-w-3xl lg:max-w-5xl"
      >
        <SheetHeader className="border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Tu carrito
          </SheetTitle>
        </SheetHeader>

        {isCartEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Tu carrito está vacío. Agrega productos desde el catálogo.
            </p>
            <Button onClick={closeCart} variant="outline" className="hover:bg-secondary hover:text-foreground">
              Volver a la tienda
            </Button>
          </div>
        ) : (
          <>
            {/* Mobile wizard: dos pantallas secuenciales */}
            <div className="flex flex-1 flex-col overflow-y-auto lg:hidden">
              {mobileStep === "cart" ? (
                <div className="flex flex-1 flex-col gap-4 px-4 py-4">
                  <h3 className="--font-poppins text-lg font-semibold text-foreground">
                    Confirmar productos
                  </h3>

                  <ul className="flex flex-col gap-4">
                    {items.map((item) => (
                      <li
                        key={`${item.id}-${item.variantLabel ?? ""}`}
                        className="flex gap-3 border-b border-border pb-4 last:border-0"
                      >
                        <Link
                          href={`/producto/${item.id}`}
                          onClick={closeCart}
                          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-secondary"
                        >
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/producto/${item.id}`}
                              onClick={closeCart}
                              className="line-clamp-2 text-sm font-medium text-foreground hover:underline"
                            >
                              {item.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.id, item.variantLabel)}
                              aria-label={`Eliminar ${item.name}`}
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          {item.variantLabel && (
                            <p className="text-xs text-muted-foreground">{item.variantLabel}</p>
                          )}
                          <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>

                          <div className="flex items-center justify-between">
                            <QuantityStepper
                              item={item}
                              onChange={(q) => updateQuantity(item.id, q, item.variantLabel)}
                            />
                            <span className="text-sm font-semibold text-foreground">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto space-y-3 border-t border-border pt-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">{formatCurrency(subtotal)}</span>
                      </div>
                      {bundleDiscount > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Descuento cargador + cable</span>
                          <span className="text-primary">-{formatCurrency(bundleDiscount)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">Total</span>
                        <span className="text-lg font-bold text-foreground">{formatCurrency(totalPrice)}</span>
                      </div>
                    </div>

                    <Button onClick={() => setMobileStep("info")} size="lg" className="w-full">
                      Continuar
                    </Button>
                    <Button
                      onClick={closeCart}
                      variant="outline"
                      className="w-full hover:bg-secondary hover:text-foreground"
                    >
                      Volver a la tienda
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 flex-col gap-4 px-4 py-4">
                  <h3 className="--font-poppins text-lg font-semibold text-foreground">
                    Confirmar información
                  </h3>

                  <DeliveryFormFields values={values} errors={errors} onChange={handleFieldChange} />

                  <div className="mt-auto space-y-3 border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="text-lg font-bold text-foreground">{formatCurrency(totalPrice)}</span>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => setMobileStep("cart")}
                        variant="outline"
                        className="flex-1 hover:bg-secondary hover:text-foreground"
                      >
                        Atrás
                      </Button>
                      <Button onClick={handleConfirm} className="flex-1">
                        Confirmar pedido
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop: resumen y total en dos columnas */}
            <div className="hidden flex-1 grid-cols-1 gap-6 overflow-y-auto px-4 py-4 lg:grid lg:grid-cols-[1fr_320px]">
              {/* Left column — Resumen del carrito */}
              <div className="flex flex-col gap-4">
                <h3 className="--font-poppins text-lg font-semibold text-foreground">
                  Resumen del carrito
                </h3>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="w-8 px-2 py-3"></th>
                        <th className="px-2 py-3">
                          <span className="block text-center">Producto</span>
                        </th>
                        <th className="px-2 py-3">
                          <span className="block text-center">Precio</span>
                        </th>
                        <th className="px-2 py-3">
                          <span className="block text-center">Cantidad</span>
                        </th>
                        <th className="px-2 py-3">
                          <span className="block text-center">Subtotal</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr
                          key={`${item.id}-${item.variantLabel ?? ""}`}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-2 py-3 align-middle">
                            <button
                              onClick={() => removeItem(item.id, item.variantLabel)}
                              aria-label={`Eliminar ${item.name}`}
                              className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </td>
                          <td className="px-2 py-3 align-middle">
                            <Link
                              href={`/producto/${item.id}`}
                              onClick={closeCart}
                              className="flex items-center gap-3 min-w-45"
                            >
                              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                              </div>
                              <div className="min-w-0">
                                <span className="line-clamp-2 text-sm font-medium text-foreground hover:underline">
                                  {item.name}
                                </span>
                                {item.variantLabel && (
                                  <p className="text-xs text-muted-foreground">{item.variantLabel}</p>
                                )}
                              </div>
                            </Link>
                          </td>
                          <td className="px-2 py-3 align-middle whitespace-nowrap text-foreground">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-2 py-3 align-middle">
                            <div className="flex justify-center">
                              <QuantityStepper
                                item={item}
                                onChange={(q) => updateQuantity(item.id, q, item.variantLabel)}
                              />
                            </div>
                          </td>
                          <td className="px-2 py-3 align-middle whitespace-nowrap text-right font-semibold text-foreground">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    onClick={closeCart}
                    variant="outline"
                    className="hover:bg-secondary hover:text-foreground"
                  >
                    Volver a la tienda
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={clearCart}
                    className="text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    Vaciar carrito
                  </Button>
                </div>
              </div>

              {/* Right column — Total del carrito */}
              <div className="h-fit space-y-4 rounded-lg border border-border p-4">
                <h3 className="--font-poppins text-lg font-semibold text-foreground">
                  Total del carrito
                </h3>

                <div className="space-y-2 border-b border-border pb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatCurrency(subtotal)}</span>
                  </div>
                  {bundleDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Descuento cargador + cable</span>
                      <span className="text-primary">-{formatCurrency(bundleDiscount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-lg font-bold text-foreground">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                <DeliveryFormFields values={values} errors={errors} onChange={handleFieldChange} />

                <Button onClick={handleConfirm} disabled={isCartEmpty} size="lg" className="w-full">
                  Confirmar pedido WhatsApp
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
