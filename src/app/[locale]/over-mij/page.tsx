import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('pages').select('*').eq('slug', 'over-mij').single()
  const content = data ? (locale === 'nl' ? data.content_nl : data.content_en) : null

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <Link href={locale === 'nl' ? '/' : '/en'} className="text-xs text-ochre-500 hover:underline uppercase tracking-widest mb-6 block">
        ← Home
      </Link>
      <h1 className="font-playfair text-4xl font-bold text-forest-900 mb-8">Over mij</h1>

      <div className="mb-10">
        <Image
          src="/itsme.jpg"
          alt="Wiebe Bloemena"
          width={1200}
          height={800}
          className="w-full h-auto rounded-xl"
        />
      </div>

      {content ? (
        <div
          className="prose prose-stone prose-headings:font-playfair prose-a:text-ochre-500 prose-a:no-underline hover:prose-a:underline max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-ink-muted italic">Inhoud wordt binnenkort toegevoegd.</p>
      )}
    </div>
  )
}
