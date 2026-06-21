'use client'

import { useState, useCallback } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
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
  SelectValue
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Button as ToggleButton } from '@/components/ui/button'
import { ChevronDown, Plus, X, Upload } from 'lucide-react'
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
  const [specs, setSpecs] = useState<Record<string, string>>(product.specs?.reduce((acc: any, spec) => {
    if (typeof spec === 'object' && spec !== null) {
      Object.assign(acc, spec)
    }
    return acc
  }, {}) || {})
  const [features, setFeatures] = useState<string[]>(product.features || [])
  const [variants, setVariants] = useState<Array<{ label: string; price: number }>>(product.variants || [])
  const [newFeature, setNewFeature] = useState('')
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  const [newVariantLabel, setNewVariantLabel] = useState('')
  const [newVariantPrice, setNewVariantPrice] = useState('')
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(image || null)
  const [uploading, setUploading] = useState(false)

  // Categories from existing products (demo - should come from props)
  const categories = ['Cargadores', 'Cables', 'Periféricos']

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`/api/admin/products/${product.id}/image`, {
        method: 'POST',
        body: formData
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
    if (file) {
      // Show preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to server
      handleImageUpload(file)
    }
  }

  const handleAddSpec = () => {
    if (newSpecKey && newSpecValue) {
      setSpecs((prev) => ({
        ...prev,
        [newSpecKey]: newSpecValue
      }))
      setNewSpecKey('')
      setNewSpecValue('')
    }
  }

  const handleRemoveSpec = (key: string) => {
    setSpecs((prev) => {
      const copy = { ...prev }
      delete copy[key]
      return copy
    })
  }

  const handleAddFeature = () => {
    if (newFeature && !features.includes(newFeature)) {
      setFeatures((prev) => [...prev, newFeature])
      setNewFeature('')
    }
  }

  const handleAddVariant = () => {
    if (newVariantLabel && newVariantPrice) {
      setVariants((prev) => [
        ...prev,
        {
          label: newVariantLabel,
          price: parseFloat(newVariantPrice)
        }
      ])
      setNewVariantLabel('')
      setNewVariantPrice('')
    }
  }

  const handleSave = async () => {
    try {
      if (!name || !price) {
        alert('Nombre y precio son obligatorios')
        return
      }

      setSaving(true)

      const specsArray = Object.entries(specs).map(([key, value]) => ({
        [key]: value
      }))

      const dataToSave: Product = {
        id: product.id as any || Date.now(),
        name,
        price: parseFloat(price),
        category: newCategory || category,
        description,
        fullDescription,
        image,
        specs: specsArray,
        features,
        variants: variants.length > 0 ? variants : undefined,
        excludeFromBundleDiscount: (product as any)?.excludeFromBundleDiscount || false
      }

      await onSave(dataToSave)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isCreating ? 'Nuevo producto' : 'Editar producto'}</SheetTitle>
          <SheetDescription>
            {isCreating ? 'Crea un nuevo producto en el catálogo' : 'Modifica los detalles del producto'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Imagen</Label>
            <div className="flex gap-4">
              {imagePreview && (
                <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 flex-1">
                <label
                  htmlFor="file-input"
                  className="flex items-center justify-center gap-2 h-24 border-2 border-dashed border-border rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
                >
                  <Upload className="h-4 w-4" />
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
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del producto"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio (COP) *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              {newCategory ? (
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nueva categoría"
                  />
                  <ToggleButton
                    variant="outline"
                    size="sm"
                    onClick={() => setNewCategory('')}
                  >
                    Cancelar
                  </ToggleButton>
                </div>
              ) : (
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="__new__">+ Nueva categoría</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción corta</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción breve"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDescription">Descripción completa</Label>
            <Textarea
              id="fullDescription"
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Descripción detallada del producto"
              rows={3}
            />
          </div>

          {/* Specs */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors">
              <ChevronDown className="h-4 w-4" />
              Especificaciones técnicas
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input value={key} disabled className="text-xs" />
                    <Input value={value} disabled className="text-xs" />
                  </div>
                  <ToggleButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSpec(key)}
                  >
                    <X className="h-4 w-4" />
                  </ToggleButton>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Input
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Clave (ej: Potencia)"
                  className="text-xs"
                />
                <Input
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Valor (ej: 30W)"
                  className="text-xs"
                />
                <ToggleButton
                  variant="outline"
                  size="sm"
                  onClick={handleAddSpec}
                >
                  <Plus className="h-4 w-4" />
                </ToggleButton>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Features */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors">
              <ChevronDown className="h-4 w-4" />
              Características
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-foreground">{feature}</span>
                  <ToggleButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setFeatures((prev) => prev.filter((f) => f !== feature))}
                  >
                    <X className="h-4 w-4" />
                  </ToggleButton>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Nueva característica"
                  className="text-xs"
                />
                <ToggleButton
                  variant="outline"
                  size="sm"
                  onClick={handleAddFeature}
                >
                  <Plus className="h-4 w-4" />
                </ToggleButton>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Variants */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors">
              <ChevronDown className="h-4 w-4" />
              Variantes (opcional)
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              {variants.map((variant, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input value={variant.label} disabled className="text-xs" />
                    <Input value={`$${variant.price}`} disabled className="text-xs" />
                  </div>
                  <ToggleButton
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setVariants((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    <X className="h-4 w-4" />
                  </ToggleButton>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Input
                  value={newVariantLabel}
                  onChange={(e) => setNewVariantLabel(e.target.value)}
                  placeholder="Variante (ej: Color Rojo)"
                  className="text-xs"
                />
                <Input
                  type="number"
                  value={newVariantPrice}
                  onChange={(e) => setNewVariantPrice(e.target.value)}
                  placeholder="Precio"
                  className="text-xs"
                />
                <ToggleButton
                  variant="outline"
                  size="sm"
                  onClick={handleAddVariant}
                >
                  <Plus className="h-4 w-4" />
                </ToggleButton>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <ToggleButton
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </ToggleButton>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1"
            >
              {saving ? 'Guardando...' : isCreating ? 'Crear producto' : 'Guardar cambios'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
