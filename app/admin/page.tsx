'use client'

import { useEffect, useState, useMemo, type ReactNode } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus, ArrowLeft, CheckCircle2, XCircle, Loader2,
  Search, X, ArrowUpDown, ArrowUp, ArrowDown, Copy, Trash2, Check,
  GripVertical, Pencil,
} from 'lucide-react'
import Link from 'next/link'
import type { Product } from '@/lib/products'
import { ProductImage } from '@/components/product-image'
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
  const [savingOrder, setSavingOrder] = useState(false)
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  // Filtros
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priceSort, setPriceSort] = useState<PriceSort>('none')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

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
    } else {
      result = [...result].sort((a, b) => (a.display_order ?? 9999) - (b.display_order ?? 9999))
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

  const handleDragStart = (event: DragStartEvent) => {
    const product = filteredProducts.find((p) => p.id.toString() === event.active.id)
    setActiveProduct(product ?? null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveProduct(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = filteredProducts.findIndex((p) => p.id.toString() === active.id)
    const newIndex = filteredProducts.findIndex((p) => p.id.toString() === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    // Recoger los display_order actuales en el rango afectado
    const minIdx = Math.min(oldIndex, newIndex)
    const maxIdx = Math.max(oldIndex, newIndex)
    const oldOrders = filteredProducts.slice(minIdx, maxIdx + 1).map((p) => p.display_order ?? p.id)

    // Nueva posición de los productos tras el drag
    const newArr = arrayMove(filteredProducts, oldIndex, newIndex)

    // Asignar los valores de orden del rango anterior a las nuevas posiciones
    const updates: { id: number; display_order: number }[] = []
    for (let i = minIdx; i <= maxIdx; i++) {
      updates.push({ id: newArr[i].id, display_order: oldOrders[i - minIdx] })
    }

    // Actualizar estado local de forma optimista
    setProducts((prev) => {
      const orderMap = new Map(updates.map((u) => [u.id, u.display_order]))
      return prev.map((p) =>
        orderMap.has(p.id) ? { ...p, display_order: orderMap.get(p.id) } : p
      )
    })

    // Persistir en Supabase
    setSavingOrder(true)
    try {
      await Promise.all(
        updates.map(({ id, display_order }) =>
          fetch(`/api/admin/products/${id}/order`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ display_order }),
          })
        )
      )
    } catch {
      // silent — la UI optimista queda igual
    } finally {
      setSavingOrder(false)
    }
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

  const handleDeleteProduct = async (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id))
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id.toString() !== id))
        setActiveStates((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
        setConfirmingDeleteId(null)
      }
    } catch {
      // silent
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleSaveProduct = async (product: Product, pendingFile?: File) => {
    try {
      if (isCreating) {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        })
        if (!res.ok) throw new Error('Error al crear producto')
        let newProduct = await res.json()

        if (pendingFile) {
          const formData = new FormData()
          formData.append('file', pendingFile)
          const imgRes = await fetch(`/api/admin/products/${newProduct.id}/image`, {
            method: 'POST',
            body: formData,
          })
          if (imgRes.ok) {
            const { imageUrl, product: updatedProduct } = await imgRes.json()
            newProduct = { ...newProduct, image: imageUrl, ...updatedProduct }
          }
        }

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
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-foreground">Productos</h2>
            {savingOrder && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Guardando orden…
              </span>
            )}
          </div>
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
                <FilterPill active={categoryFilter === null} onClick={() => setCategoryFilter(null)}>
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
          <p className="text-xs text-muted-foreground text-center">
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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredProducts.map((p) => p.id.toString())} strategy={verticalListSortingStrategy}>
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-4 py-4 w-12">
                        {priceSort === 'none' && <GripVertical className="h-4 w-4 text-muted-foreground/40 mx-auto" />}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Imagen</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nombre</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Categoría</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Precio</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estado</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-16 text-center text-muted-foreground text-sm">
                          No hay productos que coincidan con los filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => {
                        const id = product.id.toString()
                        const isActive = activeStates[id] ?? true
                        const isToggling = togglingIds.has(id)

                        return (
                          <SortableRow
                            key={id}
                            id={id}
                            className={`transition-colors duration-200 ${
                              isActive
                                ? 'hover:bg-muted/50'
                                : 'bg-muted/20 opacity-60 hover:opacity-80 hover:bg-muted/30'
                            }`}
                          >
                            {(dragHandleListeners) => (
                              <>
                                <td className="px-4 py-4 w-12">
                                  {priceSort === 'none' ? (
                                    <button
                                      {...dragHandleListeners}
                                      className="cursor-grab active:cursor-grabbing p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors touch-none"
                                      title="Arrastrar para reordenar"
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </button>
                                  ) : (
                                    <span className="block text-center text-xs text-muted-foreground/30">—</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                                    <ProductImage image={product.image} alt={product.name} fill className="object-cover" />
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
                                    <span className={`text-xs font-medium transition-colors ${
                                      isToggling ? 'text-muted-foreground'
                                      : isActive ? 'text-emerald-600 group-hover:text-emerald-500'
                                      : 'text-red-400 group-hover:text-red-500'
                                    }`}>
                                      {isToggling ? '…' : isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                  </button>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="hidden md:flex items-center justify-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => { setIsCreating(false); setEditingProduct(product) }}
                                      className="gap-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                      Editar
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      title="Crear nuevo producto basado en este"
                                      onClick={() => {
                                        setIsCreating(true)
                                        setEditingProduct({ ...product, id: 0, name: `${product.name} (copia)`, image: '', is_active: true })
                                      }}
                                      className="gap-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary"
                                    >
                                      <Copy className="h-3.5 w-3.5" />
                                      Duplicar
                                    </Button>
                                    {confirmingDeleteId === id ? (
                                      <div className="flex items-center gap-1">
                                        <span className="text-xs text-destructive font-medium whitespace-nowrap">¿Eliminar?</span>
                                        <button
                                          onClick={() => handleDeleteProduct(id)}
                                          disabled={deletingIds.has(id)}
                                          title="Confirmar eliminación"
                                          className="p-1 rounded text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                                        >
                                          {deletingIds.has(id)
                                            ? <Loader2 className="h-4 w-4 animate-spin" />
                                            : <Check className="h-4 w-4" />}
                                        </button>
                                        <button
                                          onClick={() => setConfirmingDeleteId(null)}
                                          title="Cancelar"
                                          className="p-1 rounded text-muted-foreground hover:bg-secondary transition-colors"
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                      </div>
                                    ) : (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setConfirmingDeleteId(id)}
                                        className="gap-1.5 text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Eliminar
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </>
                            )}
                          </SortableRow>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </SortableContext>
          <DragOverlay dropAnimation={null}>
            {activeProduct ? (
              <div className="flex items-center gap-4 bg-card border border-primary shadow-2xl shadow-primary/10 rounded-xl px-4 py-3 cursor-grabbing opacity-95">
                <GripVertical className="h-4 w-4 text-primary shrink-0" />
                <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted shrink-0">
                  <ProductImage image={activeProduct.image} alt={activeProduct.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{activeProduct.name}</div>
                  <div className="text-xs text-muted-foreground">{activeProduct.category}</div>
                </div>
                <div className="text-sm font-semibold text-foreground shrink-0">
                  ${activeProduct.price.toLocaleString('es-CO')}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No hay productos aún</p>
            <Button
              onClick={() => { setIsCreating(true); setEditingProduct({} as Product) }}
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
          onClose={() => { setEditingProduct(null); setIsCreating(false) }}
        />
      )}
    </div>
  )
}

/* ── SortableRow ─────────────────────────────── */

function SortableRow({
  id,
  className,
  children,
}: {
  id: string
  className?: string
  children: (dragHandleListeners: Record<string, unknown> | undefined) => ReactNode
}) {
  const { attributes, listeners, setNodeRef, transition, isDragging } = useSortable({ id })

  return (
    <tr
      ref={setNodeRef}
      style={{ transition }}
      {...attributes}
      className={`${className ?? ''} ${isDragging ? 'opacity-0' : ''}`}
    >
      {children(listeners as Record<string, unknown> | undefined)}
    </tr>
  )
}

/* ── FilterPill ─────────────────────────────── */

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
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
