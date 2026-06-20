import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"
import { createClient } from "@/lib/supabase/server"

// GET /api/reviews?productId=1 -> list reviews for a product
export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId")
  if (!productId) {
    return NextResponse.json({ error: "Falta productId" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", Number(productId))
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Reviews fetch error:", error)
    return NextResponse.json({ error: "No se pudieron cargar las reseñas" }, { status: 500 })
  }

  return NextResponse.json({ reviews: data ?? [] })
}

// POST /api/reviews -> create or update the current user's review for a product
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Debes iniciar sesión para dejar una reseña" }, { status: 401 })
  }

  let body: {
    productId?: number
    rating?: number
    comment?: string
    photos?: string[]
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })
  }

  const { productId, rating, comment, photos } = body

  if (typeof productId !== "number") {
    return NextResponse.json({ error: "productId inválido" }, { status: 400 })
  }
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "La calificación debe ser entre 1 y 5 estrellas" }, { status: 400 })
  }
  if (comment && comment.length > 2000) {
    return NextResponse.json({ error: "El comentario es demasiado largo" }, { status: 400 })
  }
  const safePhotos = Array.isArray(photos) ? photos.slice(0, 6) : []

  const authorName =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    user.email?.split("@")[0] ||
    "Cliente"
  const authorAvatar =
    (user.user_metadata?.avatar_url as string) || (user.user_metadata?.picture as string) || null

  const { data, error } = await supabase
    .from("reviews")
    .upsert(
      {
        product_id: productId,
        user_id: user.id,
        author_name: authorName,
        author_avatar: authorAvatar,
        rating,
        comment: comment?.trim() || null,
        photos: safePhotos,
      },
      { onConflict: "user_id,product_id" },
    )
    .select()
    .single()

  if (error) {
    console.error("[v0] Review upsert error:", error)
    return NextResponse.json({ error: "No se pudo guardar la reseña" }, { status: 500 })
  }

  return NextResponse.json({ review: data })
}

// DELETE /api/reviews?id=<reviewId> -> delete the current user's review
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const id = request.nextUrl.searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "Falta el id de la reseña" }, { status: 400 })
  }

  // Fetch the review first to clean up its photos (RLS ensures only own rows are visible for delete)
  const { data: existing } = await supabase
    .from("reviews")
    .select("photos, user_id")
    .eq("id", id)
    .single()

  const { error } = await supabase.from("reviews").delete().eq("id", id)

  if (error) {
    console.error("[v0] Review delete error:", error)
    return NextResponse.json({ error: "No se pudo eliminar la reseña" }, { status: 500 })
  }

  // Best-effort blob cleanup
  if (existing?.photos?.length) {
    try {
      await del(existing.photos)
    } catch (e) {
      console.error("[v0] Blob cleanup error:", e)
    }
  }

  return NextResponse.json({ success: true })
}
