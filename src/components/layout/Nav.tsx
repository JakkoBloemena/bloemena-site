'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navKeys = ['paintings', 'drawings', 'about', 'news', 'lessons', 'contact'] as const

const navHrefs: Record<string, string> = {
  paintings: '/schilderijen',
  drawings: '/tekeningen',
  about: '/over-mij',
  news: '/nieuws',
  lessons: '/schilderlessen',
  contact: '/contact',
}

export default function Nav({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const otherLocale = locale === 'nl' ? 'en' : 'nl'
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  return (
    <header className="sticky top-0 z-50 bg-stone-50/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="font-playfair text-lg font-bold tracking-wide hover:text-amber-700 transition-colors">
          Wiebe Bloemena
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium tracking-wide uppercase">
          {navKeys.map((key) => {
            const href = `/${locale}${navHrefs[key]}`
            const active = pathname.startsWith(href)
            return (
              <Link
                key={key}
                href={href}
                className={`transition-colors hover:text-amber-700 ${active ? 'text-amber-700 border-b-2 border-amber-700 pb-0.5' : 'text-stone-600'}`}
              >
                {t(key)}
              </Link>
            )
          })}
          <Link
            href={switchPath}
            className="ml-2 px-2.5 py-1 text-xs border border-stone-300 rounded hover:border-amber-600 hover:text-amber-700 transition-colors"
          >
            {otherLocale.toUpperCase()}
          </Link>
        </nav>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-3">
          <Link href={switchPath} className="text-xs px-2 py-1 border border-stone-300 rounded">
            {otherLocale.toUpperCase()}
          </Link>
          <button onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-200 bg-stone-50">
          {navKeys.map((key) => {
            const href = `/${locale}${navHrefs[key]}`
            const active = pathname.startsWith(href)
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-6 py-3 text-sm uppercase tracking-wide border-b border-stone-100 ${active ? 'text-amber-700 font-semibold' : 'text-stone-600'}`}
              >
                {t(key)}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
