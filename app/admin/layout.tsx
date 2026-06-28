import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Double-check protection at layout level
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user?.email || !isAdmin(user.email)) {
    redirect('/?error=unauthorized')
  }

  return <>{children}</>
}
