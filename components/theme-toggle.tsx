'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-12 h-6" />

  const isDark = resolvedTheme === 'dark' || theme === 'dark'

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative inline-flex items-center h-9 w-16 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-ring/50 focus-visible:ring-2"
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <span
        className={`absolute left-1 top-1 h-7 w-7 rounded-full shadow-md transform transition-transform duration-300 ${isDark ? 'translate-x-7 bg-gradient-to-br from-[#111827] to-[#374151]' : 'translate-x-0 bg-gradient-to-br from-white to-white'}`}
      />

      <span className={`absolute left-2 pointer-events-none ${isDark ? 'text-yellow-300' : 'text-amber-700'}`} aria-hidden>
        <Sun className="h-4 w-4" />
      </span>

      <span className={`absolute right-2 pointer-events-none ${isDark ? 'text-sky-200' : 'text-slate-500'}`} aria-hidden>
        <Moon className="h-4 w-4" />
      </span>
    </button>
  )
}
