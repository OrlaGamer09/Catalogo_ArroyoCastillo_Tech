'use client'

import { useState, useCallback } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import { ProductImage } from '@/components/product-image'

interface ProductEditSheetProps {
  product: Product | Partial<Product>
  isCreating: boolean
  onSave: (product: Product, pendingFile?: File) => void
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
    product.specs?.reduce((acc: Record<string, string>, spec) => {
      if (spec.label) acc[spec.label] = spec.value
      return acc
    }, {}) || {}
  )
  const [features, setFeatures] = useState<string[]>(product.features || [])
  // Internamente usamos `label` para el nombre de la variante; al guardar se mapea a `size`
  const [variants, setVariants] = useState<Array<{ label: string; price: number }>>(
    product.variants?.map((v) => ({ label: v.size, price: v.price })) || []
  )
  const [newFeature, setNewFeature] = useState('')
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  const [newVariantLabel, setNewVariantLabel] = useState('')
  const [newVariantPrice, setNewVariantPrice] = useState('')
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(image || null)
  const [uploading, setUploading] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  const categories = ['Cargadores', 'Cables', 'Periféricos']

  const handleImageUpload = useCallback(async (file: File) => {
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
  }, [product.id])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
    if (isCreating || !product.id || product.id === 0) {
      // Producto nuevo o duplicado: diferir la subida hasta después de crear el producto
      setPendingFile(file)
    } else {
      handleImageUpload(file)
    }
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
      const specsArray = Object.entries(specs).map(([label, value]) => ({ label, value }))
      onSave({
        id: (product.id as number) || 0,
        name,
        price: parseFloat(price),
        category: newCategory || category,
        description,
        fullDescription,
        image,
        specs: specsArray,
        features,
        variants: variants.length > 0 ? variants.map((v) => ({ size: v.label, price: v.price })) : undefined,
        excludeFromBundleDiscount: product.excludeFromBundleDiscount ?? false,
      }, pendingFile ?? undefined)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      {/*
        SheetContent ya tiene `inset-y-0 h-full` por su variante right,
        lo que lo hace full-height del viewport. Agregamos flex flex-col
        para apilar header / body / footer, y gap-0 para eliminar el gap-4
        por defecto.
      */}
      <SheetContent className="flex h-full w-full flex-col gap-0 sm:max-w-3xl lg:max-w-5xl">

        {/* HEADER — altura fija, nunca se encoge */}
        <SheetHeader className="shrink-0 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {isCreating ? 'Nuevo producto' : 'Editar producto'}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {isCreating ? 'Formulario para crear un nuevo producto' : `Editando: ${product.name}`}
          </SheetDescription>
        </SheetHeader>

        {/*
          BODY — ocupa todo el espacio restante y hace scroll.
          min-h-0 es esencial: en flex, el min-height por defecto es
          "auto" (contenido), lo que impide que overflow-y-auto active.
          Con min-h-0 el hijo puede encogerse y el scroll funciona.
        */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-[1fr_360px] lg:p-6">

            {/* ── Columna izquierda: imagen + info básica ── */}
            <div className="flex flex-col gap-5">

              {/* Imagen */}
              <fieldset className="overflow-hidden rounded-lg border border-border">
                <legend className="mx-4 -mb-px border-b border-border bg-secondary/40 px-0 py-2.5 w-full block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4">
                    Imagen del producto
                  </span>
                </legend>
                <div className="flex gap-4 p-4">
                  {imagePreview ? (
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                      <ProductImage image={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md border border-border bg-secondary">
                      <Package className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  )}
                  <label
                    htmlFor="file-input"
                    className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary/50 hover:bg-secondary/50"
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {uploading ? 'Subiendo…' : 'Haz clic para subir imagen'}
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
              </fieldset>

              {/* Información básica */}
              <Section title="Información básica">
                <div className="space-y-4">
                  <Field label="Nombre *">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nombre del producto"
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Precio (COP) *">
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                      />
                    </Field>

                    <Field label="Categoría">
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
                            <SelectValue placeholder="Selecciona…" />
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
                    </Field>
                  </div>

                  <Field label="Descripción corta">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Visible en las tarjetas del catálogo"
                      rows={2}
                    />
                  </Field>

                  <Field label="Descripción completa">
                    <Textarea
                      value={fullDescription}
                      onChange={(e) => setFullDescription(e.target.value)}
                      placeholder="Visible en la página detalle del producto"
                      rows={5}
                    />
                  </Field>
                </div>
              </Section>
            </div>

            {/* ── Columna derecha: specs / características / variantes ── */}
            <div className="flex flex-col gap-5">

              {/* Especificaciones */}
              <CollapseSection title="Especificaciones técnicas" defaultOpen>
                <div className="space-y-2">
                  {Object.entries(specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2"
                    >
                      <span className="w-28 shrink-0 truncate text-xs font-medium text-foreground">
                        {key}
                      </span>
                      <span className="flex-1 truncate text-xs text-muted-foreground">{value}</span>
                      <Xbtn label={key} onClick={() => handleRemoveSpec(key)} />
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
                    <AddBtn onClick={handleAddSpec} />
                  </div>
                </div>
              </CollapseSection>

              {/* Características */}
              <CollapseSection title="Características" defaultOpen>
                <div className="space-y-2">
                  {features.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2"
                    >
                      <span className="flex-1 text-xs text-foreground">{f}</span>
                      <Xbtn
                        label={f}
                        onClick={() => setFeatures((prev) => prev.filter((x) => x !== f))}
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
                    <AddBtn onClick={handleAddFeature} />
                  </div>
                </div>
              </CollapseSection>

              {/* Variantes */}
              <CollapseSection title="Variantes (opcional)">
                <div className="space-y-2">
                  {variants.map((v, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2"
                    >
                      <span className="flex-1 truncate text-xs font-medium text-foreground">
                        {v.label}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        ${v.price.toLocaleString('es-CO')}
                      </span>
                      <Xbtn
                        label={v.label}
                        onClick={() => setVariants((prev) => prev.filter((_, j) => j !== i))}
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
                      className="w-24 shrink-0 text-xs"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddVariant()}
                    />
                    <AddBtn onClick={handleAddVariant} />
                  </div>
                </div>
              </CollapseSection>
            </div>
          </div>
        </div>

        {/* FOOTER — altura fija, siempre visible */}
        <div className="shrink-0 border-t border-border p-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 hover:bg-secondary hover:text-foreground"
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} size="lg" className="flex-1">
              {saving ? 'Guardando…' : isCreating ? 'Crear producto' : 'Guardar cambios'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/* ─── Micro-componentes ──────────────────────────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="border-b border-border bg-secondary/40 px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function CollapseSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="overflow-hidden rounded-lg border border-border">
      <CollapsibleTrigger className="flex w-full items-center justify-between bg-secondary/40 px-4 py-2.5 transition-colors hover:bg-secondary data-[state=open]:border-b data-[state=open]:border-border">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">{children}</CollapsibleContent>
    </Collapsible>
  )
}

function Xbtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Eliminar ${label}`}
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      <X className="h-3 w-3" />
    </button>
  )
}

function AddBtn({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="shrink-0 hover:bg-secondary hover:text-foreground"
    >
      <Plus className="h-4 w-4" />
    </Button>
  )
}
