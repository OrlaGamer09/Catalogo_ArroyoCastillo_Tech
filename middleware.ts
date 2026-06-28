import { updateSession } from '@/lib/supabase/proxy'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function middleware(request: NextRequest) {
  // Primero actualizar la sesión (existente)
  const response = await updateSession(request)

  // Proteger rutas /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const supabase = await createClient()
    const {
      data: { user }
    } = await supabase.auth.getUser()

    // Verificar autenticación y permisos de admin
    if (!user?.email || !isAdmin(user.email)) {
      // Redirigir a home con error
      const url = new URL('/', request.url)
      url.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
