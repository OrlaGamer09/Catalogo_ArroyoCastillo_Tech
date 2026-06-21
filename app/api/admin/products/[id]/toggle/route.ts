import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { supabaseToProduct, type SupabaseProduct } from '@/lib/products'
import { isAdmin } from '@/lib/admin'

const ADMIN_EMAIL_1 = process.env.NEXT_PUBLIC_ADMIN_EMAIL1
const ADMIN_EMAIL_2 = process.env.NEXT_PUBLIC_ADMIN_EMAIL2

function isAdminEmail(email: string | undefined): boolean {
  return email === ADMIN_EMAIL_1 || email === ADMIN_EMAIL_2
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user?.email || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    // Get current product
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('is_active')
      .eq('id', id)
      .single()

    if (fetchError || !currentProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // Toggle is_active
    const newIsActive = !currentProduct.is_active

    const { data, error } = await supabase
      .from('products')
      .update({
        is_active: newIsActive,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    }

    // Log audit
    await supabase.from('product_audit_log').insert({
      product_id: id,
      action: 'TOGGLE_STATUS',
      changed_fields: { is_active: newIsActive },
      changed_by: user.id
    })

    const convertedProduct = supabaseToProduct(data[0] as SupabaseProduct)
    
    // Revalidate catalog
    revalidateTag('products')
    
    return NextResponse.json(convertedProduct)
  } catch (error) {
    console.error('Error toggling product status:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al cambiar estado' },
      { status: 500 }
    )
  }
}
