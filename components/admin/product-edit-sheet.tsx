'use client'

import { useState, useCallback } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown, Plus, X, Upload, Package } from 'lucide-react'
import type { Product } from '@/lib/products'
import Image from 'next/image'

interface ProductEditSheetProps {
  product: Product | Partial<Product>
  isCreating: boolean
  onSave: (product: Product) => void
  onClose: () => void
}

export function ProductEditSheet({ product, isCreating, onSave, onClose }: ProductEditSheetProps) {
  const [name, setName] = useState(product.name || '')
  const [price, setPrice] = useState(product.price?.toString() || '')
  const [category, setCategory] = useState(product.category || '')
  const [newCategory, setNewCategory] = useState('')
  const [description, setDescription] = useState(product.description || '')
  const [fullDescription, setFullDescription] = useState(product.fullDescription || '')
  const [image, setImage] = useState(product.image || '')
  const [specs, setSpecs] = useState<Record<string, string>>(
    product.specs?.reduce((acc: any, spec) => {
      if (typeof spec === 'object' && spec !== null) Object.assign(acc, spec)
      return acc
    }, {}) || {}
  )
  const [features, setFeatures] = useState<string[]>(product.features || [])
  const [variants, setVariants] = useState<Array<{ label: string; price: number }>>(
    product.variants || []
  )
  const [newFeature, setNewFeature] = useState('')
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  const [newVariantLabel, setNewVariantLabel] = useState('')
  const [newVariantPrice, setNewVariantPrice] = useState('')
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(image || null)
  const [uploading, setUploading] = useState(false)

  const categories = ['Cargadores', 'Cables', 'Periféricos']

  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch(`/api/admin/products/${product.id}/image`, {
          method: 'POST',
          body: formData,
        })
        if (!res.ok) throw new Error('Error al subir imagen')
        const { imageUrl } = await res.json()
        setImage(imageUrl)
        setImagePreview(imageUrl)
      } catch (err) {
        console.error('Error uploading image:', err)
      } finally {
        setUploading(false)
      }
    },
    [product.id]
  )

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
    handleImageUpload(file)
  }

  const handleAddSpec = () => {
    if (!newSpecKey || !newSpecValue) return
    setSpecs((prev) => ({ ...prev, [newSpecKey]: newSpecValue }))
    setNewSpecKey('')
    setNewSpecValue('')
  }

  const handleRemoveSpec = (key: string) => {
    setSpecs((prev) => {
      const copy = { ...prev }
      delete copy[key]
      return copy
    })
  }

  const handleAddFeature = () => {
    if (!newFeature || features.includes(newFeature)) return
    setFeatures((prev) => [...prev, newFeature])
    setNewFeature('')
  }

  const handleAddVariant = () => {
    if (!newVariantLabel || !newVariantPrice) return
    setVariants((prev) => [
      ...prev,
      { label: newVariantLabel, price: parseFloat(newVariantPrice) },
    ])
    setNewVariantLabel('')
    setNewVariantPrice('')
  }

  const handleSave = async () => {
    if (!name || !price) {
      alert('Nombre y precio son obligatorios')
      return
    }
    try {
      setSaving(true)
      const specsArray = Object.entries(specs).map(([key, value]) => ({ [key]: value }))
      const dataToSave: Product = {
        id: (product.id as any) || Date.now(),
        name,
        price: parseFloat(price),
        category: newCategory || category,
        description,
        fullDescription,
        image,
        specs: specsArray,
        features,
        variants: variants.length > 0 ? variants : undefined,
        excludeFromBundleDiscount: (product as any)?.excludeFromBundleDiscount || false,
      }
      await onSave(dataToSave)
    } finally {
      setSaving(false)
    }
  }

  const leftColumn = (
    <>
      {/* Imagen */}
      <SectionCard title="Imagen del producto">
        <div className="flex gap-4">
          {imagePreview ? (
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md border border-border bg-secondary">
              <Package className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}
          <label
            htmlFor="file-input"
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary/50 hover:bg-secondary/60"
          >
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {uploading ? 'Subiendo...' : 'Haz clic para subir imagen'}
            </span>
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            disabled={uploading}
            className="hidden"
          />
        </div>
      </SectionCard>

      {/* Info básica */}
      <SectionCard title="Información básica">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del producto"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Precio (COP) *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Categoría</Label>
              {newCategory ? (
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nueva categoría"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewCategory('')}
                    className="shrink-0 hover:bg-secondary hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="hover:bg-secondary hover:text-foreground">
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="focus:bg-secondary focus:text-foreground"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem
                      value="__new__"
                      className="focus:bg-secondary focus:text-foreground"
                    >
                      + Nueva categoría
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción corta</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción breve visible en el catálogo"
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fullDescription">Descripción completa</Label>
            <Textarea
              id="fullDescription"
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Descripción detallada visible en la página del producto"
              rows={5}
            />
          </div>
        </div>
      </SectionCard>
    </>
  )

  const rightColumn = (
    <>
      {/* Especificaciones */}
      <CollapsibleSection title="Especificaciones técnicas" defaultOpen>
        {Object.entries(specs).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2"
          >
            <span className="w-28 shrink-0 truncate text-xs font-medium text-foreground">
              {key}
            </span>
            <span className="flex-1 truncate text-xs text-muted-foreground">{value}</span>
            <RemoveBtn label={`Eliminar ${key}`} onClick={() => handleRemoveSpec(key)} />
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          <Input
            value={newSpecKey}
            onChange={(e) => setNewSpecKey(e.target.value)}
            placeholder="Clave (ej: Potencia)"
            className="text-xs"
            onKeyDown={(e) => e.key === 'Enter' && handleAddSpec()}
          />
          <Input
            value={newSpecValue}
            onChange={(e) => setNewSpecValue(e.target.value)}
            placeholder="Valor (ej: 30W)"
            className="text-xs"
            onKeyDown={(e) => e.key === 'Enter' && handleAddSpec()}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSpec}
            className="shrink-0 hover:bg-secondary hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CollapsibleSection>

      {/* Características */}
      <CollapsibleSection title="Características" defaultOpen>
        {features.map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2"
          >
            <span className="flex-1 text-xs text-foreground">{feature}</span>
            <RemoveBtn
              label={`Eliminar ${feature}`}
              onClick={() => setFeatures((prev) => prev.filter((f) => f !== feature))}
            />
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Nueva característica"
            className="text-xs"
            onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddFeature}
            className="shrink-0 hover:bg-secondary hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CollapsibleSection>

      {/* Variantes */}
      <CollapsibleSection
        title={
          <>
            Variantes{' '}
            <span className="normal-case font-normal text-muted-foreground/70">(opcional)</span>
          </>
        }
      >
        {variants.map((variant, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2"
          >
            <span className="flex-1 truncate text-xs font-medium text-foreground">
              {variant.label}
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">
              ${variant.price.toLocaleString('es-CO')}
            </span>
            <RemoveBtn
              label={`Eliminar ${variant.label}`}
              onClick={() => setVariants((prev) => prev.filter((_, i) => i !== idx))}
            />
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          <Input
            value={newVariantLabel}
            onChange={(e) => setNewVariantLabel(e.target.value)}
            placeholder="Nombre (ej: Color Rojo)"
            className="text-xs"
            onKeyDown={(e) => e.key === 'Enter' && handleAddVariant()}
          />
          <Input
            type="number"
            value={newVariantPrice}
            onChange={(e) => setNewVariantPrice(e.target.value)}
            placeholder="Precio"
            className="w-28 shrink-0 text-xs"
            onKeyDown={(e) => e.key === 'Enter' && handleAddVariant()}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddVariant}
            className="shrink-0 hover:bg-secondary hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CollapsibleSection>
    </>
  )

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      {/*
        h-full viene del SheetContent base (inset-y-0).
        flex flex-col + gap-0 apila header / body / footer sin gaps.
      */}
      <SheetContent className="flex h-full w-full flex-col gap-0 sm:max-w-3xl lg:max-w-5xl">
        {/* ── Header ── */}
        <SheetHeader className="shrink-0 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {isCreating ? 'Nuevo producto' : 'Editar producto'}
          </SheetTitle>
        </SheetHeader>

        {/* ── Body ─────────────────────────────────────────────────
            min-h-0 es obligatorio en flex para que overflow-y-auto
            funcione: sin él el hijo nunca puede ser más chico que
            su contenido y el scroll jamás se activa.
        ─────────────────────────────────────────────────────────── */}
        <div className="min-h-0 flex-1 overflow-y-auto lg:overflow-hidden">

          {/* Móvil: columna única con scroll */}
          <div className="flex flex-col gap-4 p-4 lg:hidden">
            {leftColumn}
            {rightColumn}
          </div>

          {/* Desktop: dos columnas, cada una con scroll propio */}
          <div className="hidden h-full lg:flex lg:flex-row">
            {/* Columna izquierda */}
            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto border-r border-border px-6 py-6">
              {leftColumn}
            </div>

            {/* Columna derecha */}
            <div className="flex min-h-0 w-[400px] shrink-0 flex-col gap-6 overflow-y-auto px-6 py-6">
              {rightColumn}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 border-t border-border p-4 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 hover:bg-secondary hover:text-foreground"
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving} size="lg" className="flex-1">
            {saving ? 'Guardando...' : isCreating ? 'Crear producto' : 'Guardar cambios'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/* ─── Helpers ────────────────────────────────────────────────── */

function RemoveBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      <X className="h-3 w-3" />
    </button>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-lg border border-border">
      <div className="border-b border-border bg-secondary/40 px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="overflow-hidden rounded-lg border border-border">
      <CollapsibleTrigger className="flex w-full items-center justify-between bg-secondary/40 px-4 py-2.5 transition-colors hover:bg-secondary data-[state=open]:border-b data-[state=open]:border-border">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 p-4">{children}</CollapsibleContent>
    </Collapsible>
  )
}
