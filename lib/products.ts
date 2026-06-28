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
  }
}
