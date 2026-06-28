export interface ProductSpec {
  label: string
  value: string
}

export interface ProductVariant {
  size: string
  price: number
}

export interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
  description: string
  fullDescription: string
  specs: ProductSpec[]
  features: string[]
  variants?: ProductVariant[]
  excludeFromBundleDiscount?: boolean
  is_active?: boolean
  display_order?: number
}

// Type from Supabase
export interface SupabaseProduct {
  id: number
  name: string
  price: number
  category: string
  image: string
  description: string
  full_description: string
  specs: ProductSpec[]
  features: string[]
  variants: ProductVariant[] | null
  is_active: boolean
  exclude_from_bundle_discount: boolean
  display_order: number
}

/**
 * Builds the proxy URL to display a product image from the private Vercel Blob.
 * Everything goes through /api/products/image — no local fallbacks.
 * If the blob doesn't have the file, the proxy returns 404 and the
 * ProductImage component shows a "missing" placeholder.
 */
export function productImageUrl(image: string): string {
  if (!image) return ""
  // Use directly: full URLs, data URIs (local preview before upload), blob URIs
  if (image.startsWith("http") || image.startsWith("data:") || image.startsWith("blob:")) return image
  // Strip leading slash if present (e.g. "/cargador65w.png" → "cargador65w.png")
  const pathname = image.startsWith("/") ? image.slice(1) : image
  return `/api/products/image?pathname=${encodeURIComponent(pathname)}`
}

// Convert Supabase product to app Product
export function supabaseToProduct(dbProduct: SupabaseProduct): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    price: dbProduct.price,
    category: dbProduct.category,
    image: dbProduct.image,
    description: dbProduct.description,
    fullDescription: dbProduct.full_description,
    specs: dbProduct.specs,
    features: dbProduct.features,
    variants: dbProduct.variants || undefined,
    excludeFromBundleDiscount: dbProduct.exclude_from_bundle_discount,
    is_active: dbProduct.is_active ?? false,
    display_order: dbProduct.display_order,
  }
}
