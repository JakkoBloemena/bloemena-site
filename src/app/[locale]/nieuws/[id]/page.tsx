import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

type Params = { locale: string; id: string }

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { locale, id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single()
  if (!post) return {}

  const title = locale === 'nl' ? post.title_nl : post.title_en
  const content = locale === 'nl' ? post.content_nl : post.content_en
  const description = content
    ?.replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160)

  return {
    title: `${title} | Wiebe Bloemena`,
    description,
    openGraph: {
      title: `${title} | Wiebe Bloemena`,
      description,
      ...(post.image_url ? { images: [{ url: post.image_url }] } : {}),
    },
  }
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { locale, id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) notFound()

  const t = await getTranslations('news')
  const title = locale === 'nl' ? post.title_nl : post.title_en
  const content = locale === 'nl' ? post.content_nl : post.content_en

  return (
    <article className="max-w-2xl mx-auto px-4 py-12">
      <Link href={`/${locale}/nieuws`} className="text-sm text-amber-700 hover:underline mb-6 block">
        ← {t('title')}
      </Link>
      {post.image_url && (
        <div className="relative aspect-video overflow-hidden rounded-sm mb-8 bg-stone-100">
          <Image src={post.image_url} alt={title} fill className="object-cover" />
        </div>
      )}
      <time className="text-xs text-stone-400 uppercase tracking-wide">
        {new Date(post.published_at).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
      </time>
      <h1 className="font-playfair text-3xl md:text-4xl font-bold mt-2 mb-6">{title}</h1>
      <div
        className="prose prose-stone prose-a:text-amber-700 max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  )
}
