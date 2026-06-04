import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { Locale } from '@/types'

export default async function PaintingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('paintings')
  const g = await getTranslations('gallery')
  const supabase = await createClient()

  const { data: paintings } = await supabase
    .from('paintings')
    .select('*')
    .eq('category', 'schilderij')
    .order('year', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-5 py-12 bg-forest-50">
      <h1 className="font-playfair text-4xl font-bold text-forest-900 mb-10">{t('title')}</h1>
      {paintings && paintings.length > 0 ? (
        <GalleryGrid
          paintings={paintings}
          locale={locale as Locale}
          galleryLabels={{ year: g('year'), medium: g('medium'), dimensions: g('dimensions'), cm: g('cm') }}
        />
      ) : (
        <p className="text-stone-500">{t('noWork')}</p>
      )}
    </div>
  )
}
