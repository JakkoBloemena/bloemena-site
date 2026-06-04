'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import type { Painting } from '@/types'
import type { Locale } from '@/types'

interface Props {
  paintings: Painting[]
  locale: Locale
}

export default function HeroCarousel({ paintings, locale }: Props) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = useCallback(() => setCurrent((c) => (c + 1) % paintings.length), [paintings.length])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + paintings.length) % paintings.length), [paintings.length])

  useEffect(() => {
    if (paused || paintings.length <= 1) return
    intervalRef.current = setInterval(next, 4500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [next, paused, paintings.length])

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev()
    touchStartX.current = null
  }

  if (!paintings.length) return null

  const painting = paintings[current]
  const title = locale === 'nl' ? painting.title_nl : painting.title_en

  return (
    <section
      className="relative bg-forest-950 overflow-hidden h-[min(55vh,500px)] md:h-[min(90vh,680px)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      {paintings.map((p, i) => (
        <div
          key={p.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={p.image_url}
            alt={locale === 'nl' ? p.title_nl : p.title_en}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-contain"
          />
          {/* Subtle dark vignette at edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-forest-950/20" />
        </div>
      ))}

      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-5 text-canvas">
        <p className="font-playfair text-lg md:text-xl font-semibold drop-shadow-lg">{title}</p>
        {painting.year && <p className="text-forest-200 text-xs mt-0.5">{painting.year}</p>}
      </div>

      {/* Dot indicators */}
      {paintings.length > 1 && (
        <div className="absolute bottom-5 right-6 flex gap-1.5">
          {paintings.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-ochre-400 w-4' : 'bg-canvas/40 hover:bg-canvas/70'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Prev/next arrows (desktop) */}
      {paintings.length > 1 && (
        <>
          <button
            onClick={prev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-forest-950/40 text-canvas hover:bg-forest-950/70 transition-colors"
            aria-label="Vorige"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-forest-950/40 text-canvas hover:bg-forest-950/70 transition-colors"
            aria-label="Volgende"
          >
            ›
          </button>
        </>
      )}
    </section>
  )
}
