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
    <header className="sticky top-0 z-50 bg-canvas/95 backdrop-blur border-b border-forest-100">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="font-playfair text-lg font-bold text-forest-900 hover:text-ochre-500 transition-colors shrink-0"
        >
          Wiebe Bloemena
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-widest uppercase">
          {navKeys.map((key) => {
            const href = `/${locale}${navHrefs[key]}`
            const active = pathname.startsWith(href)
            return (
              <Link
                key={key}
                href={href}
                className={`transition-colors pb-0.5 ${
                  active
                    ? 'text-ochre-500 border-b border-ochre-500'
                    : 'text-ink-muted hover:text-forest-900'
                }`}
              >
                {t(key)}
              </Link>
            )
          })}
        </nav>

        {/* Lang toggle + mobile */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={switchPath}
            className="text-xs font-medium tracking-widest uppercase px-2.5 py-1 border border-forest-200 text-ink-muted rounded-sm hover:border-ochre-500 hover:text-ochre-500 transition-colors"
          >
            {otherLocale}
          </Link>
          <button onClick={() => setOpen(!open)} className="md:hidden text-forest-900" aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-forest-100 bg-canvas">
          {navKeys.map((key) => {
            const href = `/${locale}${navHrefs[key]}`
            const active = pathname.startsWith(href)
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-5 py-3.5 text-xs uppercase tracking-widest font-medium border-b border-forest-50 ${
                  active ? 'text-ochre-500' : 'text-ink-muted'
                }`}
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
