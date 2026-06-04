import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

function localePath(locale: string, path: string) {
  return locale === 'nl' ? path : `/en${path}`
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params
  const supabase = await createClient()
  const { data: article } = await supabase.from('articles').select('*').eq('id', id).eq('category', 'projecten').single()
  if (!article) notFound()
  const title = locale === 'nl' ? article.title_nl : article.title_en
  const content = locale === 'nl' ? article.content_nl : article.content_en
  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <Link href={localePath(locale, '/over-mij/projecten')} className="text-xs text-ochre-500 hover:underline uppercase tracking-widest mb-6 block">← Projecten</Link>
      <time className="text-xs text-ink-muted uppercase tracking-widest">{new Date(article.published_at).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
      <h1 className="font-playfair text-3xl md:text-4xl font-bold text-forest-900 mt-2 mb-8">{title}</h1>
      {content && <div className="prose prose-stone prose-headings:font-playfair prose-a:text-ochre-500 max-w-none" dangerouslySetInnerHTML={{ __html: content }} />}
    </div>
  )
}
