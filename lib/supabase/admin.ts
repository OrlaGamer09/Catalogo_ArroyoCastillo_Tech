import { createClient } from '@supabase/supabase-js'

/**
 * Service-role client — bypasses RLS.
 * ONLY use server-side in API routes after verifying the user is an admin.
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
