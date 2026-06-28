import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { supabaseToProduct, type SupabaseProduct } from '@/lib/products'

const ADMIN_EMAIL_1 = process.env.NEXT_PUBLIC_ADMIN_EMAIL1
const ADMIN_EMAIL_2 = process.env.NEXT_PUBLIC_ADMIN_EMAIL2

function isAdminEmail(email: string | undefined): boolean {
  return email === ADMIN_EMAIL_1 || email === ADMIN_EMAIL_2
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numericId = parseInt(id, 10)

  // Verificar autenticación con el cliente anon (cookie-based)
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user?.email || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  // Operaciones de BD con service role (bypasa RLS)
  const db = createAdminClient()

  try {
    const { data: current, error: fetchError } = await db
      .from('products')
      .select('is_active')
      .eq('id', numericId)
      .single()

    if (fetchError || !current) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    const newIsActive = !current.is_active

    const { data, error } = await db
      .from('products')
      .update({
        is_active: newIsActive,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', numericId)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    }

    // Audit log — fire-and-forget (no bloquea la respuesta)
    void db.from('product_audit_log').insert({
      product_id: numericId,
      action: 'TOGGLE_STATUS',
      changed_fields: { is_active: newIsActive },
      changed_by: user.id,
    })

    revalidatePath('/')

    return NextResponse.json(supabaseToProduct(data[0] as SupabaseProduct))
  } catch (error) {
    console.error('Error toggling product status:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al cambiar estado' },
      { status: 500 }
    )
  }
}
