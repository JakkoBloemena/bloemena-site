import { createClient } from '@/lib/supabase/server'
import ContentPage from '@/components/layout/ContentPage'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('pages').select('*').eq('slug', 'over-mij').single()
  const content = data ? (locale === 'nl' ? data.content_nl : data.content_en) : null
  return <ContentPage title="Over mij" content={content} backHref={locale === 'nl' ? '/' : '/en'} backLabel="Home" />
}
