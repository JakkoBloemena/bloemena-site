import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { Locale, Painting } from '@/types'

export default async function OpZnPlekPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()

  const [{ data: page }, { data: photos }] = await Promise.all([
    supabase.from('pages').select('*').eq('slug', 'op-zn-plek').single(),
    supabase.from('op_zn_plek_photos').select('id, image_url, created_at').order('sort_order').order('created_at'),
  ])

  const content = page ? (locale === 'nl' ? page.content_nl : page.content_en) : null
  const backHref = locale === 'nl' ? '/over-mij' : '/en/over-mij'

  // Map photos to the Painting shape GalleryGrid expects
  const paintings: Painting[] = (photos ?? []).map(p => ({
    id: p.id,
    title_nl: '',
    title_en: '',
    description_nl: null,
    description_en: null,
    image_url: p.image_url,
    category: 'schilderij',
    year: null,
    width_cm: null,
    height_cm: null,
    medium_nl: null,
    medium_en: null,
    featured: false,
    sort_order: 999,
    for_sale: false,
    price_eur: null,
    collection_info: null,
    created_at: p.created_at,
  }))

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <Link href={backHref} className="text-xs text-ochre-500 hover:underline uppercase tracking-widest mb-6 block">
        ← Over mij
      </Link>
      <h1 className="font-playfair text-4xl font-bold text-forest-900 mb-10">Op z&apos;n plek</h1>

      {content && (
        <div
          className="prose prose-stone prose-headings:font-playfair prose-a:text-ochre-500 max-w-3xl mb-10"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {paintings.length > 0 ? (
        <GalleryGrid
          paintings={paintings}
          locale={locale as Locale}
          galleryLabels={{ year: '', medium: '', dimensions: '', cm: '', forSale: '' }}
        />
      ) : (
        <p className="text-ink-muted italic">Foto&apos;s worden binnenkort toegevoegd.</p>
      )}
    </div>
  )
}
