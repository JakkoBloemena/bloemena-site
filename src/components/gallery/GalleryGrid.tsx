'use client'

import Image from 'next/image'
import { useState, useRef, useCallback, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Painting, Locale } from '@/types'

interface Props {
  paintings: Painting[]
  locale: Locale
  galleryLabels: { year: string; medium: string; dimensions: string; cm: string; forSale: string }
}

export default function GalleryGrid({ paintings, locale, galleryLabels }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)

  const t = (p: Painting) => locale === 'nl' ? p.title_nl : p.title_en
  const desc = (p: Painting) => locale === 'nl' ? p.description_nl : p.description_en
  const med = (p: Painting) => locale === 'nl' ? p.medium_nl : p.medium_en

  const prev = useCallback(() => setSelected(s => s !== null ? (s - 1 + paintings.length) % paintings.length : null), [paintings.length])
  const next = useCallback(() => setSelected(s => s !== null ? (s + 1) % paintings.length : null), [paintings.length])

  // Keyboard navigation
  useEffect(() => {
    if (selected === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, prev, next])

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev()
    touchStartX.current = null
  }

  const current = selected !== null ? paintings[selected] : null

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
        {paintings.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setSelected(i)}
            className="group relative aspect-square overflow-hidden bg-forest-200 focus:outline-none focus:ring-2 focus:ring-ochre-500"
          >
            <Image
              src={p.image_url}
              alt={t(p)}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-forest-950/0 group-hover:bg-forest-950/40 transition-colors flex items-end">
              <p className="translate-y-full group-hover:translate-y-0 transition-transform text-canvas text-xs font-medium px-3 py-2 w-full truncate">
                {t(p)}{p.year ? ` — ${p.year}` : ''}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-50 bg-forest-950/97 flex flex-col"
          onClick={() => setSelected(null)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-forest-800/60 text-canvas/70 hover:text-canvas hover:bg-forest-700 transition-colors"
            onClick={() => setSelected(null)}
            aria-label="Sluiten"
          >
            <X size={18} />
          </button>

          {/* Prev/next — desktop only */}
          <button
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-forest-800/60 text-canvas/70 hover:text-canvas hover:bg-forest-700 transition-colors"
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Vorige"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-forest-800/60 text-canvas/70 hover:text-canvas hover:bg-forest-700 transition-colors"
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Volgende"
          >
            <ChevronRight size={22} />
          </button>

          {/* Image — fills available space, centered */}
          <div
            className="flex-1 min-h-0 overflow-hidden flex items-center justify-center p-4 md:p-14 pt-14"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={current.id}
              src={current.image_url}
              alt={t(current)}
              className="object-contain select-none block"
              style={{
                maxHeight: 'calc(100vh - 220px)',
                maxWidth: 'calc(100vw - 2rem)',
                width: 'auto',
                height: 'auto',
              }}
              draggable={false}
            />
          </div>

          {/* Info strip — always below image */}
          <div
            className="shrink-0 px-5 pb-6 pt-3 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-playfair text-lg md:text-xl font-semibold text-canvas mb-1">
              {t(current)}
            </h2>

            {/* Metadata row */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-sm text-forest-300 mb-2">
              {current.year && <span>{current.year}</span>}
              {med(current) && <span>{med(current)}</span>}
              {current.width_cm && current.height_cm && (
                <span>{current.width_cm} × {current.height_cm} {galleryLabels.cm}</span>
              )}
            </div>

            {desc(current) && (
              <p className="text-forest-200/70 text-sm mb-2 max-w-lg mx-auto">{desc(current)}</p>
            )}

            {/* Price or collection */}
            {current.for_sale && current.price_eur ? (
              <p className="text-ochre-400 font-semibold text-sm">
                {galleryLabels.forSale} — € {Number(current.price_eur).toLocaleString('nl-NL')}
              </p>
            ) : current.collection_info ? (
              <p className="text-forest-400 text-xs italic">{current.collection_info}</p>
            ) : null}

            {/* Dot indicators — mobile */}
            {paintings.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3 md:hidden">
                {paintings.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`h-1.5 rounded-full transition-all ${i === selected ? 'bg-ochre-400 w-4' : 'bg-forest-600 w-1.5'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
