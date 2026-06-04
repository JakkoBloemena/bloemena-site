import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import type { Locale } from '@/types'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('home')
  const nav = await getTranslations('nav')
  const supabase = await createClient()

  const { data: featured } = await supabase
    .from('paintings')
    .select('*')
    .eq('featured', true)
    .order('sort_order')
    .limit(6)

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title_nl, title_en, published_at, image_url')
    .order('published_at', { ascending: false })
    .limit(3)

  const title = (item: { title_nl: string; title_en: string }) =>
    locale === 'nl' ? item.title_nl : item.title_en

  return (
    <>
      {/* Hero */}
      <section className="bg-stone-900 text-stone-100 py-24 px-4 text-center">
        <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-3 tracking-tight">
          Wiebe Bloemena
        </h1>
        <p className="text-stone-400 text-lg md:text-xl font-light tracking-widest uppercase mb-10">
          {t('tagline')}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href={`/${locale}/schilderijen`}
            className="px-6 py-3 bg-amber-600 text-white font-medium hover:bg-amber-500 transition-colors rounded-sm"
          >
            {t('viewPaintings')}
          </Link>
          <Link
            href={`/${locale}/tekeningen`}
            className="px-6 py-3 border border-stone-500 text-stone-300 hover:border-amber-500 hover:text-amber-400 transition-colors rounded-sm"
          >
            {t('viewDrawings')}
          </Link>
        </div>
      </section>

      {/* Featured paintings */}
      {featured && featured.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {featured.map((p) => (
                <Link key={p.id} href={`/${locale}/schilderijen`} className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-stone-200 block">
                  <Image
                    src={p.image_url}
                    alt={title(p)}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quote */}
      <section className="py-16 px-4 bg-amber-50 border-y border-amber-100">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-playfair text-xl md:text-2xl text-stone-700 italic leading-relaxed mb-4">
            {t('quote')}
          </blockquote>
          <cite className="text-stone-500 text-sm not-italic">{t('quoteAuthor')}</cite>
        </div>
      </section>

      {/* Latest news */}
      {posts && posts.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-3xl font-bold mb-10">{t('latestNews')}</h2>
            <div className="space-y-6">
              {posts.map((post) => (
                <article key={post.id} className="flex gap-5 group">
                  {post.image_url && (
                    <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-sm bg-stone-100">
                      <Image src={post.image_url} alt="" fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <div>
                    <time className="text-xs text-stone-400 uppercase tracking-wide">
                      {new Date(post.published_at).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                    <h3 className="font-playfair text-lg font-semibold mt-1 mb-2 group-hover:text-amber-700 transition-colors">
                      <Link href={`/${locale}/nieuws/${post.id}`}>{title(post)}</Link>
                    </h3>
                    <Link href={`/${locale}/nieuws/${post.id}`} className="text-xs text-amber-700 hover:underline uppercase tracking-wide">
                      {t('readMore')} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10">
              <Link href={`/${locale}/nieuws`} className="text-sm text-amber-700 hover:underline font-medium">
                {t('allNews')} →
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
