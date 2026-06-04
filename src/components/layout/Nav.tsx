'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState, useRef } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

const mainNavKeys = ['paintings', 'drawings', 'lessons', 'contact'] as const

const navHrefs: Record<string, string> = {
  paintings:  '/schilderijen',
  drawings:   '/tekeningen',
  lessons:    '/schilderlessen',
  contact:    '/contact',
}

const aboutSubmenu = [
  { key: 'exhibitions', href: '/over-mij/tentoonstellingen', label: 'TENTOONSTELLINGEN' },
  { key: 'publications', href: '/over-mij/publicaties',      label: 'PUBLICATIES' },
  { key: 'projects',    href: '/over-mij/projecten',         label: 'PROJECTEN' },
  { key: 'collections', href: '/over-mij/collecties',        label: 'COLLECTIES' },
  { key: 'reviews',     href: '/over-mij/recensies',         label: 'RECENSIES' },
  { key: 'opznplek',   href: '/over-mij/op-zn-plek',        label: "OP Z'N PLEK" },
]

function localePath(locale: string, path: string) {
  return locale === 'nl' ? path : `/en${path}`
}

export default function Nav({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
  const aboutRef = useRef<HTMLDivElement>(null)

  const otherLocale = locale === 'nl' ? 'en' : 'nl'
  // Switch locale: strip /en prefix for NL, add /en prefix for EN
  const switchPath = locale === 'nl'
    ? `/en${pathname}`
    : pathname.replace(/^\/en/, '') || '/'

  const isAboutActive = pathname.includes('/over-mij')

  return (
    <header className="sticky top-0 z-50 bg-canvas/95 backdrop-blur border-b border-forest-100">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href={localePath(locale, '/')} className="font-playfair text-lg font-bold text-forest-900 hover:text-ochre-500 transition-colors shrink-0">
          Wiebe Bloemena
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium tracking-widest">

          {/* Schilderijen, Tekeningen */}
          {(['paintings', 'drawings'] as const).map((key) => {
            const href = localePath(locale, navHrefs[key])
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={key} href={href}
                className={`transition-colors pb-0.5 uppercase ${active ? 'text-ochre-500 border-b border-ochre-500' : 'text-ink-muted hover:text-forest-900'}`}>
                {t(key)}
              </Link>
            )
          })}

          {/* OVER MIJ with dropdown */}
          <div ref={aboutRef} className="relative group">
            <Link
              href={localePath(locale, '/over-mij')}
              className={`flex items-center gap-1 transition-colors pb-0.5 ${
                isAboutActive ? 'text-ochre-500 border-b border-ochre-500' : 'text-ink-muted hover:text-forest-900'
              }`}
            >
              OVER MIJ <ChevronDown size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </Link>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <div className="bg-canvas border border-forest-100 shadow-lg rounded-sm min-w-[220px] py-1">
                {aboutSubmenu.map((item) => (
                  <Link key={item.key} href={localePath(locale, item.href)}
                    className="block px-4 py-2.5 text-xs tracking-widest text-ink-muted hover:text-forest-900 hover:bg-forest-50 transition-colors">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Schilderlessen, Contact */}
          {(['lessons', 'contact'] as const).map((key) => {
            const href = localePath(locale, navHrefs[key])
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={key} href={href}
                className={`transition-colors pb-0.5 uppercase ${active ? 'text-ochre-500 border-b border-ochre-500' : 'text-ink-muted hover:text-forest-900'}`}>
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
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-forest-900" aria-label="Menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-forest-100 bg-canvas">
          {/* Schilderijen, Tekeningen */}
          {(['paintings', 'drawings'] as const).map((key) => {
            const href = localePath(locale, navHrefs[key])
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={key} href={href} onClick={() => setMobileOpen(false)}
                className={`block px-5 py-3.5 text-xs uppercase tracking-widest font-medium border-b border-forest-50 ${active ? 'text-ochre-500' : 'text-ink-muted'}`}>
                {t(key)}
              </Link>
            )
          })}

          {/* Over mij + submenu */}
          <button onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
            className={`flex items-center justify-between w-full px-5 py-3.5 text-xs uppercase tracking-widest font-medium border-b border-forest-50 ${isAboutActive ? 'text-ochre-500' : 'text-ink-muted'}`}>
            OVER MIJ <ChevronDown size={12} className={`transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} />
          </button>
          {mobileAboutOpen && (
            <div className="bg-forest-50 border-b border-forest-100">
              <Link href={localePath(locale, '/over-mij')} onClick={() => setMobileOpen(false)}
                className="block px-8 py-3 text-xs tracking-widest text-ink-muted hover:text-forest-900">
                OVER MIJ
              </Link>
              {aboutSubmenu.map((item) => (
                <Link key={item.key} href={localePath(locale, item.href)} onClick={() => setMobileOpen(false)}
                  className="block px-8 py-3 text-xs tracking-widest text-ink-muted hover:text-forest-900 border-t border-forest-100">
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Schilderlessen, Contact */}
          {(['lessons', 'contact'] as const).map((key) => {
            const href = localePath(locale, navHrefs[key])
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={key} href={href} onClick={() => setMobileOpen(false)}
                className={`block px-5 py-3.5 text-xs uppercase tracking-widest font-medium border-b border-forest-50 ${active ? 'text-ochre-500' : 'text-ink-muted'}`}>
                {t(key)}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
