"use client"

import type React from "react"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/reviews/star-rating"
import { photoUrl, type Review } from "@/lib/reviews"

interface ReviewFormProps {
  productId: number
  existing?: Review | null
  onSaved: () => void
  onCancel?: () => void
}

const MAX_PHOTOS = 6

export function ReviewForm({ productId, existing, onSaved, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(existing?.rating ?? 0)
  const [comment, setComment] = useState(existing?.comment ?? "")
  const [photos, setPhotos] = useState<string[]>(existing?.photos ?? [])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ""
    if (files.length === 0) return

    const remaining = MAX_PHOTOS - photos.length
    if (remaining <= 0) {
      toast.error(`Máximo ${MAX_PHOTOS} fotos por reseña`)
      return
    }

    setUploading(true)
    try {
      const toUpload = files.slice(0, remaining)
      for (const file of toUpload) {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch("/api/reviews/photo", { method: "POST", body: formData })
        const data = await res.json()
        if (!res.ok) {
          toast.error(data.error || "No se pudo subir la imagen")
          continue
        }
        setPhotos((prev) => [...prev, data.pathname])
      }
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = (pathname: string) => {
    setPhotos((prev) => prev.filter((p) => p !== pathname))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1) {
      toast.error("Selecciona una calificación de 1 a 5 estrellas")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment, photos }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "No se pudo guardar la reseña")
        return
      }
      toast.success(existing ? "Reseña actualizada" : "¡Gracias por tu reseña!")
      onSaved()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 sm:p-6">
      <div className="mb-5">
        <span className="block text-sm font-medium text-foreground mb-2">Tu calificación</span>
        <StarRating value={rating} onChange={setRating} size={28} />
      </div>

      <div className="mb-5">
        <label htmlFor="review-comment" className="block text-sm font-medium text-foreground mb-2">
          Tu opinión <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Cuéntanos qué te pareció el producto, qué tal la calidad, el envío..."
          rows={4}
          maxLength={2000}
          className="resize-none"
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">{comment.length}/2000</p>
      </div>

      <div className="mb-6">
        <span className="block text-sm font-medium text-foreground mb-2">
          Fotos <span className="text-muted-foreground font-normal">(opcional, hasta {MAX_PHOTOS})</span>
        </span>
        <div className="flex flex-wrap gap-3">
          {photos.map((p) => (
            <div key={p} className="relative h-20 w-20 overflow-hidden rounded-lg border border-border">
              <Image src={photoUrl(p) || "/placeholder.svg"} alt="Foto de la reseña" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(p)}
                aria-label="Quitar foto"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/70 text-background hover:bg-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-xs">Subir</span>
                </>
              )}
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFiles}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="sm:flex-1 bg-transparent">
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={submitting || uploading} className="sm:flex-1 gap-2">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {existing ? "Actualizar reseña" : "Publicar reseña"}
        </Button>
      </div>
    </form>
  )
}
