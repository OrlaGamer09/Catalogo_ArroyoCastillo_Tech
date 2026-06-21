import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseToProduct, type SupabaseProduct } from '@/lib/products'

const ADMIN_EMAIL_1 = process.env.NEXT_PUBLIC_ADMIN_EMAIL1
const ADMIN_EMAIL_2 = process.env.NEXT_PUBLIC_ADMIN_EMAIL2

function isAdmin(email: string | undefined): boolean {
  return email === ADMIN_EMAIL_1 || email === ADMIN_EMAIL_2
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user?.email || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const updates = await request.json()
    const productId = BigInt(id)

    // Convertir nombres de app a nombres de Supabase
    const dbUpdates = { ...updates }
    if (updates.fullDescription) {
      dbUpdates.full_description = updates.fullDescription
      delete dbUpdates.fullDescription
    }
    if (updates.excludeFromBundleDiscount !== undefined) {
      dbUpdates.exclude_from_bundle_discount = updates.excludeFromBundleDiscount
      delete dbUpdates.excludeFromBundleDiscount
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        ...dbUpdates,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId.toString())
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // Log audit
    await supabase.from('product_audit_log').insert({
      product_id: productId.toString(),
      action: 'UPDATE',
      changed_fields: updates,
      changed_by: user.id
    })

    // Convertir respuesta
    const convertedProduct = supabaseToProduct(data[0] as SupabaseProduct)

    return NextResponse.json(convertedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al actualizar producto' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user?.email || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const productId = BigInt(id)

    // Soft delete: marcar como inactivo
    const { data, error } = await supabase
      .from('products')
      .update({
        is_active: false,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId.toString())
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // Log audit
    await supabase.from('product_audit_log').insert({
      product_id: productId.toString(),
      action: 'DELETE',
      changed_fields: { is_active: false },
      changed_by: user.id
    })

    return NextResponse.json({ success: true, message: 'Producto marcado como inactivo' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al eliminar producto' },
      { status: 500 }
    )
  }
}
