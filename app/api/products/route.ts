import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseToProduct, type SupabaseProduct } from '@/lib/products'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true })

    if (error) throw error

    // Convertir tipos de Supabase a tipos de app
    const products = (data || []).map((p: SupabaseProduct) => supabaseToProduct(p))

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}
