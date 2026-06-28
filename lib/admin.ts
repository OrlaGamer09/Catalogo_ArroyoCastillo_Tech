// Admin configuration - NEVER expose these in client code
export const ADMIN_EMAILS = [
  process.env.NEXT_PUBLIC_ADMIN_EMAIL1 || '',
  process.env.NEXT_PUBLIC_ADMIN_EMAIL2 || ''
].filter(Boolean)

export const isAdmin = (email?: string | null): boolean =>
  !!email && ADMIN_EMAILS.includes(email)
