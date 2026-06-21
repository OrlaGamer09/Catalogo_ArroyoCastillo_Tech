'use client'

import { useEffect, useState } from 'react'
import type { Product } from '@/lib/products'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/products')
        if (!res.ok) throw new Error('Error al cargar productos')
        const data = await res.json()
        setProducts(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        // Fallback a hardcoded si falla
        const { products: fallback } = await import('@/lib/products')
        setProducts(fallback)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/products`, {
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch products')
    return res.json()
  } catch (err) {
    console.error('Error fetching products:', err)
    // Return empty array so app doesn't crash
    return []
  }
}
