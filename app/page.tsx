import { createClient } from '@/lib/supabase/server'
import { supabaseToProduct, type SupabaseProduct } from '@/lib/products'
import { CatalogShell } from '@/components/catalog-shell'

export default async function CatalogPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: true })

  const products = (data || []).map((p) => supabaseToProduct(p as SupabaseProduct))

  return <CatalogShell initialProducts={products} />
}
