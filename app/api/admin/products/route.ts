import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { supabaseToProduct, type SupabaseProduct } from '@/lib/products'

const ADMIN_EMAIL_1 = process.env.NEXT_PUBLIC_ADMIN_EMAIL1
const ADMIN_EMAIL_2 = process.env.NEXT_PUBLIC_ADMIN_EMAIL2

function isAdmin(email: string | undefined): boolean {
  return email === ADMIN_EMAIL_1 || email === ADMIN_EMAIL_2
}

export async function GET() {
  // Verificar auth con cliente anon
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user?.email || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    // Service role: traer TODOS los productos (activos e inactivos) sin filtro de RLS
    const db = createAdminClient()
    const { data, error } = await db
      .from('products')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error

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
    delete dbProduct.is_active

    const db = createAdminClient()

    // La tabla no tiene secuencia/DEFAULT en id: generar el siguiente manualmente
    const { data: maxRow } = await db
      .from('products')
      .select('id, display_order')
      .order('id', { ascending: false })
      .limit(1)
    const nextId = ((maxRow?.[0]?.id as number) || 0) + 1
    dbProduct.id = nextId

    // display_order: poner al final de la lista
    const { data: maxOrderRow } = await db
      .from('products')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
    dbProduct.display_order = ((maxOrderRow?.[0]?.display_order as number) || 0) + 1

    const { data, error } = await db
      .from('products')
      .insert(dbProduct)
      .select()

    if (error) throw error

    // Convertir respuesta al tipo de app
    const convertedProduct = supabaseToProduct(data?.[0])

    // Revalidate catalog
    revalidatePath('/')

    return NextResponse.json(convertedProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear producto' },
      { status: 500 }
    )
  }
}
