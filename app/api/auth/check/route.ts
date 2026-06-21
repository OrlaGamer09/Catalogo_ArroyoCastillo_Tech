import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user }
    } = await supabase.auth.getUser()

    return NextResponse.json({
      isAdmin: user?.email ? isAdmin(user.email) : false,
      email: user?.email || null
    })
  } catch (error) {
    return NextResponse.json({
      isAdmin: false,
      email: null
    })
  }
}
