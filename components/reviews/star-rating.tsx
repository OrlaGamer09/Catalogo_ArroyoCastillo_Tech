"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number
  /** When provided, the component becomes interactive */
  onChange?: (value: number) => void
  size?: number
  className?: string
}

export function StarRating({ value, onChange, size = 16, className }: StarRatingProps) {
  const [hover, setHover] = useState(0)
  const interactive = typeof onChange === "function"
  const display = hover || value

  return (
    <div className={cn("flex items-center gap-0.5", className)} role={interactive ? "radiogroup" : undefined}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display
        const StarIcon = (
          <Star
            style={{ width: size, height: size }}
            className={cn(
              "transition-colors",
              filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground/40",
            )}
          />
        )

        if (!interactive) {
          return <span key={star}>{StarIcon}</span>
        }

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} ${star === 1 ? "estrella" : "estrellas"}`}
            className="cursor-pointer rounded-sm p-0.5 focus-visible:outline-2 focus-visible:outline-ring"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            {StarIcon}
          </button>
        )
      })}
    </div>
  )
}
