"use client"

import { useState } from "react"
import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarRating } from "@/components/reviews/star-rating"
import { photoUrl, type Review } from "@/lib/reviews"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

interface ReviewItemProps {
  review: Review
  isOwn: boolean
  onEdit: () => void
  onDelete: () => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function ReviewItem({ review, isOwn, onEdit, onDelete }: ReviewItemProps) {
  const [lightbox, setLightbox] = useState<string | null>(null)
  const initials = review.author_name.slice(0, 2).toUpperCase()

  return (
    <article className="py-6 border-b border-border last:border-b-0">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          {review.author_avatar && (
            <AvatarImage src={review.author_avatar || "/placeholder.svg"} alt={review.author_name} />
          )}
          <AvatarFallback className="bg-secondary text-foreground text-sm">{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium text-foreground flex items-center gap-2">
                {review.author_name}
                {isOwn && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">Tú</span>
                )}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <StarRating value={review.rating} size={14} />
                <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
              </div>
            </div>

            {isOwn && (
              <div className="flex items-center gap-1">
                <button
                  onClick={onEdit}
                  aria-label="Editar reseña"
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={onDelete}
                  aria-label="Eliminar reseña"
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {review.comment && (
            <p className="mt-3 text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{review.comment}</p>
          )}

          {review.photos.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {review.photos.map((p) => (
                <button
                  key={p}
                  onClick={() => setLightbox(p)}
                  className="relative h-20 w-20 overflow-hidden rounded-lg border border-border transition-opacity hover:opacity-90"
                >
                  <Image src={photoUrl(p) || "/placeholder.svg"} alt="Foto del cliente" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!lightbox} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-2xl p-2 sm:p-4">
          <DialogTitle className="sr-only">Foto de la reseña</DialogTitle>
          {lightbox && (
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image src={photoUrl(lightbox) || "/placeholder.svg"} alt="Foto del cliente ampliada" fill className="object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </article>
  )
}
