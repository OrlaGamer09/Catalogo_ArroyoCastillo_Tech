'use client'

import { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus, ArrowLeft, CheckCircle2, XCircle, Loader2,
  Search, X, ArrowUpDown, ArrowUp, ArrowDown,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/products'
import { ProductEditSheet } from '@/components/admin/product-edit-sheet'

type StatusFilter = 'all' | 'active' | 'inactive'
type PriceSort = 'none' | 'asc' | 'desc'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({})
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())

  // Filtros
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priceSort, setPriceSort] = useState<PriceSort>('none')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/products')
        if (!res.ok) throw new Error('Error al cargar productos')
        const data = await res.json()
        setProducts(data)
        const states: Record<string, boolean> = {}
        data.forEach((p: Product) => {
          states[p.id.toString()] = p.is_active !== false
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

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products]
  )

  const filteredProducts = useMemo(() => {
    let result = products

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }

    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter)
    }

    if (statusFilter === 'active') {
      result = result.filter((p) => activeStates[p.id.toString()] !== false)
    } else if (statusFilter === 'inactive') {
      result = result.filter((p) => activeStates[p.id.toString()] === false)
    }

    if (priceSort === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (priceSort === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    return result
  }, [products, searchQuery, categoryFilter, statusFilter, priceSort, activeStates])

  const hasFilters =
    searchQuery.trim() !== '' ||
    categoryFilter !== null ||
    statusFilter !== 'all' ||
    priceSort !== 'none'

  const clearFilters = () => {
    setSearchQuery('')
    setCategoryFilter(null)
    setStatusFilter('all')
    setPriceSort('none')
  }

  const handleToggleActive = async (id: string, currentState: boolean) => {
    if (togglingIds.has(id)) return

    setTogglingIds((prev) => new Set(prev).add(id))
    setActiveStates((prev) => ({ ...prev, [id]: !currentState }))

    try {
      const res = await fetch(`/api/admin/products/${id}/toggle`, { method: 'PATCH' })

      if (!res.ok) {
        setActiveStates((prev) => ({ ...prev, [id]: currentState }))
        return
      }

      const updatedProduct = await res.json()
      setProducts((prev) =>
        prev.map((p) => (p.id.toString() === id ? updatedProduct : p))
      )
    } catch {
      setActiveStates((prev) => ({ ...prev, [id]: currentState }))
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleSaveProduct = async (product: Product) => {
    try {
      if (isCreating) {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        })
        if (!res.ok) throw new Error('Error al crear producto')
        const newProduct = await res.json()
        setProducts((prev) => [...prev, newProduct])
        setActiveStates((prev) => ({ ...prev, [newProduct.id.toString()]: true }))
      } else {
        const res = await fetch(`/api/admin/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 py-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al catálogo</span>
            </Link>
            <h1 className="text-xl font-semibold text-foreground">Panel de Administración</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Aviso móvil */}
        <div className="md:hidden mb-6 rounded-lg border border-border bg-secondary/40 px-4 py-4 text-center">
          <p className="text-sm font-medium text-foreground">Vista de escritorio requerida</p>
          <p className="mt-1 text-xs text-muted-foreground">
            La edición de productos está disponible solo desde una pantalla más grande.
          </p>
        </div>

        {/* Title + New Product */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Productos</h2>
          <Button
            onClick={() => {
              setIsCreating(true)
              setEditingProduct({} as Product)
            }}
            className="hidden md:inline-flex gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Button>
        </div>

        {/* ── Filter Bar ──────────────────────────────────── */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4 space-y-4">

          {/* Row 1: search + clear */}
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, descripción o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 bg-secondary/60 border-border/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="shrink-0 gap-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
                Limpiar filtros
              </Button>
            )}
          </div>

          {/* Row 2: Category + Status + Price sort */}
          <div className="flex flex-wrap gap-4 items-start justify-center">

            {/* Categoría */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Categoría</p>
              <div className="flex flex-wrap gap-1.5">
                <FilterPill
                  active={categoryFilter === null}
                  onClick={() => setCategoryFilter(null)}
                >
                  Todas
                </FilterPill>
                {categories.map((cat) => (
                  <FilterPill
                    key={cat}
                    active={categoryFilter === cat}
                    onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                  >
                    {cat}
                  </FilterPill>
                ))}
              </div>
            </div>

            {/* Separador */}
            <div className="hidden sm:block w-px self-stretch bg-border" />

            {/* Estado */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Estado</p>
              <div className="flex gap-1.5">
                <FilterPill active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
                  Todos
                </FilterPill>
                <FilterPill active={statusFilter === 'active'} onClick={() => setStatusFilter('active')}>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Activos
                </FilterPill>
                <FilterPill active={statusFilter === 'inactive'} onClick={() => setStatusFilter('inactive')}>
                  <XCircle className="h-3.5 w-3.5 text-red-400" />
                  Inactivos
                </FilterPill>
              </div>
            </div>

            {/* Separador */}
            <div className="hidden sm:block w-px self-stretch bg-border" />

            {/* Precio */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Precio</p>
              <div className="flex gap-1.5">
                <FilterPill active={priceSort === 'none'} onClick={() => setPriceSort('none')}>
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Sin orden
                </FilterPill>
                <FilterPill active={priceSort === 'asc'} onClick={() => setPriceSort('asc')}>
                  <ArrowUp className="h-3.5 w-3.5" />
                  Menor
                </FilterPill>
                <FilterPill active={priceSort === 'desc'} onClick={() => setPriceSort('desc')}>
                  <ArrowDown className="h-3.5 w-3.5" />
                  Mayor
                </FilterPill>
              </div>
            </div>

          </div>

          {/* Row 3: result count */}
          <p className="text-xs text-muted-foreground">
            {filteredProducts.length === products.length
              ? `${products.length} productos en total`
              : `${filteredProducts.length} de ${products.length} productos`}
          </p>
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
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground text-sm">
                      No hay productos que coincidan con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const id = product.id.toString()
                    const isActive = activeStates[id] ?? true
                    const isToggling = togglingIds.has(id)

                    return (
                      <tr
                        key={product.id}
                        className={`transition-colors duration-200 ${
                          isActive
                            ? 'hover:bg-muted/50'
                            : 'bg-muted/20 opacity-60 hover:opacity-80 hover:bg-muted/30'
                        }`}
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
                          <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
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
                          <button
                            onClick={() => handleToggleActive(id, isActive)}
                            disabled={isToggling}
                            title={isActive ? 'Activo — clic para desactivar' : 'Inactivo — clic para activar'}
                            className="flex items-center gap-1.5 group disabled:cursor-not-allowed"
                          >
                            {isToggling ? (
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            ) : isActive ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-400 group-hover:text-red-500 transition-colors" />
                            )}
                            <span
                              className={`text-xs font-medium transition-colors ${
                                isToggling
                                  ? 'text-muted-foreground'
                                  : isActive
                                  ? 'text-emerald-600 group-hover:text-emerald-500'
                                  : 'text-red-400 group-hover:text-red-500'
                              }`}
                            >
                              {isToggling ? '…' : isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsCreating(false)
                              setEditingProduct(product)
                            }}
                            className="hidden md:inline-flex hover:bg-secondary hover:text-foreground"
                          >
                            Editar
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No hay productos aún</p>
            <Button
              onClick={() => {
                setIsCreating(true)
                setEditingProduct({} as Product)
              }}
              className="hidden md:inline-flex gap-2"
            >
              <Plus className="h-4 w-4" />
              Crear primer producto
            </Button>
          </div>
        )}
      </main>

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

/* ── Micro-componente ─────────────────────────────── */

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150 border ${
        active
          ? 'bg-foreground text-background border-foreground'
          : 'bg-secondary/60 text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}
