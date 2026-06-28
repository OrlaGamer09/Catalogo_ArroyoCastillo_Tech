"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageOff } from "lucide-react"
import { productImageUrl } from "@/lib/products"

interface ProductImageProps {
  image: string
  alt: string
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
}

export function ProductImage({ image, alt, fill, className, priority, sizes }: ProductImageProps) {
  const [failed, setFailed] = useState(false)

  const src = productImageUrl(image)

  if (failed || !src) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-secondary/80 text-muted-foreground select-none">
        <ImageOff className="h-7 w-7 opacity-40" />
        <span className="text-[10px] sm:text-xs font-medium opacity-50 text-center px-2 leading-tight">
          Imagen no en blob
        </span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      priority={priority}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  )
}
