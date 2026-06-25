'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/lib/products'
import { ProductEditSheet } from '@/components/admin/product-edit-sheet'
import { Toggle } from '@/components/ui/toggle'

export default function AdminPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({})

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/products')
        if (!res.ok) throw new Error('Error al cargar productos')
        const data = await res.json()
        setProducts(data)
        // Inicializar estados activos
        const states: Record<string, boolean> = {}
        data.forEach((p: Product) => {
          states[p.id.toString()] = (p as any).is_active !== false
        })
        setActiveStates(states)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      // Optimistic update
      setActiveStates((prev) => ({
        ...prev,
        [id]: !currentState
      }))

      const res = await fetch(`/api/admin/products/${id}/toggle`, {
        method: 'PATCH'
      })

      if (!res.ok) {
        // Revert optimistic update
        setActiveStates((prev) => ({
          ...prev,
          [id]: currentState
        }))
        throw new Error('Error al cambiar estado')
      }

      // Update product list
      const updatedProduct = await res.json()
      setProducts((prev) =>
        prev.map((p) => (p.id.toString() === id ? updatedProduct : p))
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveProduct = async (product: Product) => {
    try {
      if (isCreating) {
        // POST new product
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        })
        if (!res.ok) throw new Error('Error al crear producto')
        const newProduct = await res.json()
        setProducts((prev) => [...prev, newProduct])
      } else {
        // PUT update product
        const res = await fetch(`/api/admin/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        })
        if (!res.ok) throw new Error('Error al actualizar producto')
        const updated = await res.json()
        setProducts((prev) =>
          prev.map((p) => (p.id.toString() === product.id.toString() ? updated : p))
        )
      }

      setEditingProduct(null)
      setIsCreating(false)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 py-3">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Volver al catálogo</span>
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-foreground">Panel de Administración</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-foreground">Productos</h2>
          <Button
            onClick={() => {
              setIsCreating(true)
              setEditingProduct({} as Product)
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 text-destructive">
            {error}
          </div>
        )}

        {/* Products Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Imagen</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Categoría</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Precio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-muted/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-foreground">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-foreground">{product.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-foreground">
                        ${product.price.toLocaleString('es-CO')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Toggle
                          pressed={activeStates[product.id.toString()] ?? true}
                          onPressedChange={() =>
                            handleToggleActive(
                              product.id.toString(),
                              activeStates[product.id.toString()] ?? true
                            )
                          }
                          className="h-8 w-8 px-2 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
                        >
                          {activeStates[product.id.toString()] ? '✓' : '✕'}
                        </Toggle>
                        {!activeStates[product.id.toString()] && (
                          <Badge variant="outline" className="text-xs">
                            Inactivo
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsCreating(false)
                          setEditingProduct(product)
                        }}
                      >
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No hay productos aún</p>
            <Button
              onClick={() => {
                setIsCreating(true)
                setEditingProduct({} as Product)
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Crear primer producto
            </Button>
          </div>
        )}
      </main>

      {/* Edit Sheet */}
      {editingProduct && (
        <ProductEditSheet
          product={editingProduct}
          isCreating={isCreating}
          onSave={handleSaveProduct}
          onClose={() => {
            setEditingProduct(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}
