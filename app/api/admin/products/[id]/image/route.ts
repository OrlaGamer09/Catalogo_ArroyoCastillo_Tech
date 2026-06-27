import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { supabaseToProduct, type SupabaseProduct } from '@/lib/products'

const ADMIN_EMAIL_1 = process.env.NEXT_PUBLIC_ADMIN_EMAIL1
const ADMIN_EMAIL_2 = process.env.NEXT_PUBLIC_ADMIN_EMAIL2

function isAdmin(email: string | undefined): boolean {
  return email === ADMIN_EMAIL_1 || email === ADMIN_EMAIL_2
}

export async function POST(
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
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Archivo demasiado grande' }, { status: 400 })
    }

    // Upload to Vercel Blob
    const fileName = `products/${id}/${Date.now()}-${file.name}`
    const blob = await put(fileName, file, { access: 'public' })

    const numericId = parseInt(id, 10)
    const db = createAdminClient()

    // Update product with new image URL
    const { data, error } = await db
      .from('products')
      .update({
        image: blob.url,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', numericId)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // Audit log — fire-and-forget
    void db.from('product_audit_log').insert({
      product_id: numericId,
      action: 'UPDATE_IMAGE',
      changed_fields: { image: blob.url },
      changed_by: user.id,
    })

    const convertedProduct = supabaseToProduct(data[0] as SupabaseProduct)

    revalidatePath('/')

    return NextResponse.json({
      imageUrl: blob.url,
      product: convertedProduct
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al subir imagen' },
      { status: 500 }
    )
  }
}
