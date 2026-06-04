import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('news')
  const ht = await getTranslations('home')
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title_nl, title_en, published_at, image_url, content_nl, content_en')
    .order('published_at', { ascending: false })

  const title = (item: { title_nl: string; title_en: string }) =>
    locale === 'nl' ? item.title_nl : item.title_en

  const excerpt = (item: { content_nl: string; content_en: string }) => {
    const content = locale === 'nl' ? item.content_nl : item.content_en
    return content.replace(/<[^>]+>/g, '').slice(0, 180) + '…'
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-4xl font-bold mb-10">{t('title')}</h1>
      {posts && posts.length > 0 ? (
        <div className="space-y-10">
          {posts.map((post) => (
            <article key={post.id} className="border-b border-stone-200 pb-10 last:border-0">
              {post.image_url && (
                <Link href={`/${locale}/nieuws/${post.id}`} className="block mb-4 overflow-hidden rounded-sm">
                  <div className="relative aspect-video bg-stone-100">
                    <Image src={post.image_url} alt={title(post)} fill className="object-cover hover:scale-105 transition-transform" />
                  </div>
                </Link>
              )}
              <time className="text-xs text-stone-400 uppercase tracking-wide">
                {new Date(post.published_at).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              <h2 className="font-playfair text-2xl font-bold mt-1 mb-3">
                <Link href={`/${locale}/nieuws/${post.id}`} className="hover:text-amber-700 transition-colors">
                  {title(post)}
                </Link>
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-3">{excerpt(post)}</p>
              <Link href={`/${locale}/nieuws/${post.id}`} className="text-sm text-amber-700 hover:underline font-medium">
                {ht('readMore')} →
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-stone-500">Geen berichten gevonden.</p>
      )}
    </div>
  )
}
