import { Settings } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export async function AdminIcon() {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  // Solo mostrar si es admin
  if (!user?.email || !isAdmin(user.email)) {
    return null
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-secondary transition-colors duration-200"
          >
            <Settings className="h-5 w-5 text-foreground" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Panel de administración</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
