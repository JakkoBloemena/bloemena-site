import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

function localePath(locale: string, path: string) {
  return locale === 'nl' ? path : `/en${path}`
}

export default async function ProjectenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title_nl, title_en, content_nl, published_at')
    .eq('category', 'projecten')
    .order('published_at', { ascending: false })

  const t = (a: { title_nl: string; title_en: string }) => locale === 'nl' ? a.title_nl : a.title_en
  const excerpt = (html: string) => html.replace(/<[^>]+>/g, '').slice(0, 180).trim() + '…'

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <Link href={localePath(locale, '/over-mij')} className="text-xs text-ochre-500 hover:underline uppercase tracking-widest mb-6 block">
        ← Over mij
      </Link>
      <h1 className="font-playfair text-4xl font-bold text-forest-900 mb-10">Projecten</h1>

      {articles && articles.length > 0 ? (
        <div className="divide-y divide-forest-100">
          {articles.map(a => (
            <article key={a.id} className="py-6">
              <time className="text-xs text-ink-muted uppercase tracking-widest">
                {new Date(a.published_at).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              <h2 className="font-playfair text-xl font-semibold text-forest-900 mt-1 mb-2">
                <Link href={localePath(locale, `/over-mij/projecten/${a.id}`)} className="hover:text-ochre-500 transition-colors">
                  {t(a)}
                </Link>
              </h2>
              {a.content_nl && (
                <p className="text-ink-muted text-sm leading-relaxed">{excerpt(a.content_nl)}</p>
              )}
              <Link href={localePath(locale, `/over-mij/projecten/${a.id}`)} className="text-xs text-ochre-500 hover:underline mt-3 inline-block">
                {locale === 'nl' ? 'Lees meer →' : 'Read more →'}
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-ink-muted italic">Inhoud wordt binnenkort toegevoegd.</p>
      )}
    </div>
  )
}
