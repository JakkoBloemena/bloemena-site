import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import type { Locale } from '@/types'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('home')
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
      {/* Hero — deep forest green */}
      <section className="relative bg-forest-900 text-canvas overflow-hidden">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #6b8fa8 0%, transparent 50%), radial-gradient(circle at 80% 20%, #c4893a 0%, transparent 50%)' }}
        />
        <div className="relative max-w-4xl mx-auto px-5 py-28 md:py-40 text-center">
          <p className="text-forest-200 text-xs tracking-[0.3em] uppercase mb-6 font-medium">
            {t('tagline')}
          </p>
          <h1 className="font-playfair text-6xl md:text-8xl font-bold leading-none tracking-tight mb-10">
            Wiebe<br />
            <span className="text-ochre-400">Bloemena</span>
          </h1>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href={`/${locale}/schilderijen`}
              className="px-7 py-3 bg-ochre-500 text-canvas text-sm font-medium tracking-wide hover:bg-ochre-400 transition-colors rounded-sm"
            >
              {t('viewPaintings')}
            </Link>
            <Link
              href={`/${locale}/tekeningen`}
              className="px-7 py-3 border border-forest-700 text-forest-200 text-sm font-medium tracking-wide hover:border-ochre-500 hover:text-ochre-400 transition-colors rounded-sm"
            >
              {t('viewDrawings')}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured paintings grid */}
      {featured && featured.length > 0 && (
        <section className="py-16 px-5 bg-canvas">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {featured.map((p) => (
                <Link
                  key={p.id}
                  href={`/${locale}/schilderijen`}
                  className="group relative aspect-[4/3] overflow-hidden bg-forest-100 block"
                >
                  <Image
                    src={p.image_url}
                    alt={locale === 'nl' ? p.title_nl : p.title_en}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-forest-950/0 group-hover:bg-forest-950/20 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quote — parchment */}
      <section className="py-20 px-5 bg-parchment">
        <div className="max-w-3xl mx-auto text-center">
          {/* Decorative line */}
          <div className="flex items-center gap-4 justify-center mb-8">
            <div className="h-px w-16 bg-ochre-500/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-ochre-500/60" />
            <div className="h-px w-16 bg-ochre-500/40" />
          </div>
          <blockquote className="font-playfair text-xl md:text-2xl text-forest-900 italic leading-relaxed mb-5">
            {t('quote')}
          </blockquote>
          <cite className="text-ink-muted text-sm not-italic tracking-wide">{t('quoteAuthor')}</cite>
          <div className="flex items-center gap-4 justify-center mt-8">
            <div className="h-px w-16 bg-ochre-500/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-ochre-500/60" />
            <div className="h-px w-16 bg-ochre-500/40" />
          </div>
        </div>
      </section>

      {/* Latest news */}
      {posts && posts.length > 0 && (
        <section className="py-16 px-5 bg-canvas">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-playfair text-3xl font-bold text-forest-900">{t('latestNews')}</h2>
              <Link href={`/${locale}/nieuws`} className="text-xs text-ochre-500 hover:text-ochre-600 uppercase tracking-widest font-medium hidden sm:block">
                {t('allNews')} →
              </Link>
            </div>
            <div className="divide-y divide-forest-100">
              {posts.map((post) => (
                <article key={post.id} className="py-6 flex gap-5 group">
                  {post.image_url && (
                    <div className="relative w-20 h-20 shrink-0 overflow-hidden bg-forest-100">
                      <Image
                        src={post.image_url}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <time className="text-xs text-ink-muted uppercase tracking-widest">
                      {new Date(post.published_at).toLocaleDateString(
                        locale === 'nl' ? 'nl-NL' : 'en-GB',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </time>
                    <h3 className="font-playfair text-lg font-semibold mt-1 text-forest-900 group-hover:text-ochre-500 transition-colors">
                      <Link href={`/${locale}/nieuws/${post.id}`}>{title(post)}</Link>
                    </h3>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-6 sm:hidden">
              <Link href={`/${locale}/nieuws`} className="text-xs text-ochre-500 uppercase tracking-widest font-medium">
                {t('allNews')} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA strip */}
      <section className="py-16 px-5 bg-forest-900 text-canvas text-center">
        <p className="font-playfair text-2xl md:text-3xl italic text-forest-200 mb-6">
          {locale === 'nl' ? 'Bekijk het volledige oeuvre' : 'Explore the full collection'}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href={`/${locale}/schilderijen`} className="px-6 py-2.5 bg-ochre-500 text-canvas text-sm tracking-wide hover:bg-ochre-400 transition-colors rounded-sm">
            {t('viewPaintings')}
          </Link>
          <Link href={`/${locale}/tekeningen`} className="px-6 py-2.5 border border-forest-700 text-forest-200 text-sm tracking-wide hover:border-ochre-500 hover:text-ochre-400 transition-colors rounded-sm">
            {t('viewDrawings')}
          </Link>
        </div>
      </section>
    </>
  )
}
