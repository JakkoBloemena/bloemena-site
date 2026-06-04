import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { Locale } from '@/types'

export default async function DrawingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('drawings')
  const g = await getTranslations('gallery')
  const supabase = await createClient()

  const { data: drawings } = await supabase
    .from('paintings')
    .select('*')
    .eq('category', 'tekening')
    .order('sort_order')

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-4xl font-bold mb-10">{t('title')}</h1>
      {drawings && drawings.length > 0 ? (
        <GalleryGrid
          paintings={drawings}
          locale={locale as Locale}
          galleryLabels={{ year: g('year'), medium: g('medium'), dimensions: g('dimensions'), cm: g('cm') }}
        />
      ) : (
        <p className="text-stone-500">{t('noWork')}</p>
      )}
    </div>
  )
}
