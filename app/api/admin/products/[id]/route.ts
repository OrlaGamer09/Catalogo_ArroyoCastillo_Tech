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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numericId = parseInt(id, 10)

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user?.email || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const db = createAdminClient()

  try {
    const updates = await request.json()

    const dbUpdates: Record<string, unknown> = {
      name: updates.name,
      price: updates.price,
      category: updates.category,
      description: updates.description,
      full_description: updates.fullDescription,
      image: updates.image,
      specs: updates.specs,
      features: updates.features,
      variants: updates.variants ?? null,
      exclude_from_bundle_discount: updates.excludeFromBundleDiscount ?? false,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await db
      .from('products')
      .update(dbUpdates)
      .eq('id', numericId)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    void db.from('product_audit_log').insert({
      product_id: numericId,
      action: 'UPDATE',
      changed_fields: updates,
      changed_by: user.id,
    })

    revalidatePath('/')
    return NextResponse.json(supabaseToProduct(data[0] as SupabaseProduct))
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al actualizar producto' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numericId = parseInt(id, 10)

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user?.email || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const db = createAdminClient()

  try {
    const { data, error } = await db
      .from('products')
      .update({
        is_active: false,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', numericId)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    void db.from('product_audit_log').insert({
      product_id: numericId,
      action: 'DELETE',
      changed_fields: { is_active: false },
      changed_by: user.id,
    })

    revalidatePath('/')
    return NextResponse.json({ success: true, message: 'Producto marcado como inactivo' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al eliminar producto' },
      { status: 500 }
    )
  }
}
