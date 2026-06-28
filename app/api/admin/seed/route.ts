import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ADMIN_EMAIL_1 = process.env.NEXT_PUBLIC_ADMIN_EMAIL1
const ADMIN_EMAIL_2 = process.env.NEXT_PUBLIC_ADMIN_EMAIL2

function isAdmin(email: string | undefined): boolean {
  return email === ADMIN_EMAIL_1 || email === ADMIN_EMAIL_2
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user?.email || !isAdmin(user.email)) {
    return NextResponse.json(
      { error: 'No autorizado. Solo admins pueden hacer seed de productos.' },
      { status: 403 }
    )
  }

  try {
    const products = await request.json()

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'El body debe ser un array de productos' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: `${data?.length || 0} productos insertados exitosamente`,
      inserted: data
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al insertar productos' },
      { status: 500 }
    )
  }
}
