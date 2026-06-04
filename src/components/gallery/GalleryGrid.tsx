'use client'

import Image from 'next/image'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Painting } from '@/types'
import type { Locale } from '@/types'

interface Props {
  paintings: Painting[]
  locale: Locale
  galleryLabels: { year: string; medium: string; dimensions: string; cm: string; forSale: string }
}

export default function GalleryGrid({ paintings, locale, galleryLabels }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  const title = (p: Painting) => locale === 'nl' ? p.title_nl : p.title_en
  const desc = (p: Painting) => locale === 'nl' ? p.description_nl : p.description_en
  const medium = (p: Painting) => locale === 'nl' ? p.medium_nl : p.medium_en

  function prev() {
    setSelected((s) => (s !== null ? (s - 1 + paintings.length) % paintings.length : null))
  }
  function next() {
    setSelected((s) => (s !== null ? (s + 1) % paintings.length : null))
  }

  const current = selected !== null ? paintings[selected] : null

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {paintings.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setSelected(i)}
            className="group relative aspect-square overflow-hidden bg-forest-200 focus:outline-none focus:ring-2 focus:ring-ochre-500"
          >
            <Image
              src={p.image_url}
              alt={title(p)}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-forest-950/0 group-hover:bg-forest-950/40 transition-colors flex items-end">
              <p className="translate-y-full group-hover:translate-y-0 transition-transform text-canvas text-xs font-medium px-3 py-2 w-full truncate">
                {title(p)}{p.year ? ` — ${p.year}` : ''}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-50 bg-forest-950/95 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setSelected(null)}
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Previous"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next"
          >
            <ChevronRight size={36} />
          </button>

          <div
            className="flex flex-col md:flex-row gap-6 max-w-5xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[70vh] flex-shrink-0">
              <img
                src={current.image_url}
                alt={title(current)}
                className="max-h-[70vh] max-w-full object-contain rounded"
              />
            </div>
            <div className="text-white md:w-56 flex-shrink-0">
              <h2 className="font-playfair text-xl font-semibold text-canvas mb-2">{title(current)}</h2>
              {desc(current) && <p className="text-forest-200 text-sm mb-4">{desc(current)}</p>}
              <dl className="text-sm space-y-1 text-forest-400">
                {current.year && <div><dt className="inline font-medium">{galleryLabels.year}: </dt><dd className="inline">{current.year}</dd></div>}
                {medium(current) && <div><dt className="inline font-medium">{galleryLabels.medium}: </dt><dd className="inline">{medium(current)}</dd></div>}
                {current.width_cm && current.height_cm && (
                  <div>
                    <dt className="inline font-medium">{galleryLabels.dimensions}: </dt>
                    <dd className="inline">{current.width_cm} × {current.height_cm} {galleryLabels.cm}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-4 pt-4 border-t border-forest-700">
                {current.for_sale && current.price_eur ? (
                  <p className="text-ochre-400 font-semibold text-base">
                    {galleryLabels.forSale} — € {current.price_eur.toLocaleString('nl-NL')}
                  </p>
                ) : current.collection_info ? (
                  <p className="text-forest-300 text-sm italic">{current.collection_info}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
