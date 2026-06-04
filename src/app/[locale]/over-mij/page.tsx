import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('about')
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'over-mij')
    .single()

  const content = page ? (locale === 'nl' ? page.content_nl : page.content_en) : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-4xl font-bold mb-10">{t('title')}</h1>
      {content ? (
        <div className="prose prose-stone prose-a:text-amber-700 max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <p className="text-stone-400 italic">Inhoud wordt binnenkort toegevoegd.</p>
      )}
    </div>
  )
}
