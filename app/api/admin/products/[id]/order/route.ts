import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ADMIN_EMAIL_1 = process.env.NEXT_PUBLIC_ADMIN_EMAIL1
const ADMIN_EMAIL_2 = process.env.NEXT_PUBLIC_ADMIN_EMAIL2

function isAdmin(email: string | undefined): boolean {
  return email === ADMIN_EMAIL_1 || email === ADMIN_EMAIL_2
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user?.email || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { display_order } = await request.json()
  if (typeof display_order !== 'number' || !Number.isInteger(display_order)) {
    return NextResponse.json({ error: 'display_order debe ser un número entero' }, { status: 400 })
  }

  const db = createAdminClient()
  const { error } = await db
    .from('products')
    .update({ display_order })
    .eq('id', parseInt(id, 10))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath('/')
  return NextResponse.json({ success: true })
}
