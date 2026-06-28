import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { supabaseToProduct, type SupabaseProduct } from "@/lib/products"
import { ProductDetail } from "@/components/product-detail"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Producto principal
  const { data: productData, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", parseInt(id))
    .single()

  if (error || !productData || productData.is_active === false) {
    notFound()
  }

  const product = supabaseToProduct(productData as SupabaseProduct)

  // Productos relacionados de la misma categoría
  const { data: relatedData } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(3)

  const relatedProducts = (relatedData || []).map((p: SupabaseProduct) =>
    supabaseToProduct(p)
  )

  return <ProductDetail product={product} relatedProducts={relatedProducts} />
}
