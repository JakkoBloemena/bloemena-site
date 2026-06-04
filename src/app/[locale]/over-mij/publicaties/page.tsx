import { createClient } from '@/lib/supabase/server'
import ContentPage from '@/components/layout/ContentPage'

export default async function PublicatiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('pages').select('*').eq('slug', 'publicaties').single()
  const content = data ? (locale === 'nl' ? data.content_nl : data.content_en) : null
  return <ContentPage title="Publicaties" content={content} backHref={locale === 'nl' ? '/over-mij' : '/en/over-mij'} backLabel="Over mij" />
}
