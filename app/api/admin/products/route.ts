import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { supabaseToProduct, type SupabaseProduct } from '@/lib/products'

const ADMIN_EMAIL_1 = process.env.NEXT_PUBLIC_ADMIN_EMAIL1
const ADMIN_EMAIL_2 = process.env.NEXT_PUBLIC_ADMIN_EMAIL2

function isAdmin(email: string | undefined): boolean {
  return email === ADMIN_EMAIL_1 || email === ADMIN_EMAIL_2
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user?.email || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })

    if (error) throw error

    // Convertir tipos
    const products = (data || []).map((p: SupabaseProduct) => supabaseToProduct(p))

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user?.email || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const product = await request.json()

    // Convertir nombres de app a nombres de Supabase
    const dbProduct = {
      ...product,
      full_description: product.fullDescription,
      exclude_from_bundle_discount: product.excludeFromBundleDiscount,
      created_by: user.id,
      updated_by: user.id
    }

    // Remover campos de app que no existen en Supabase
    delete dbProduct.fullDescription
    delete dbProduct.excludeFromBundleDiscount

    const { data, error } = await supabase
      .from('products')
      .insert(dbProduct)
      .select()

    if (error) throw error

    // Convertir respuesta al tipo de app
    const convertedProduct = supabaseToProduct(data?.[0])

    // Revalidate catalog
    revalidateTag('products')

    return NextResponse.json(convertedProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear producto' },
      { status: 500 }
    )
  }
}
