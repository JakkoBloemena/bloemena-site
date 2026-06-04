import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export default async function OpZnPlekPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()

  const [{ data: page }, { data: photos }] = await Promise.all([
    supabase.from('pages').select('*').eq('slug', 'op-zn-plek').single(),
    supabase.from('op_zn_plek_photos').select('id, image_url').order('sort_order').order('created_at'),
  ])

  const content = page ? (locale === 'nl' ? page.content_nl : page.content_en) : null
  const backHref = locale === 'nl' ? '/over-mij' : '/en/over-mij'

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <Link href={backHref} className="text-xs text-ochre-500 hover:underline uppercase tracking-widest mb-6 block">
        ← Over mij
      </Link>
      <h1 className="font-playfair text-4xl font-bold text-forest-900 mb-10">Op z&apos;n plek</h1>

      {content && (
        <div
          className="prose prose-stone prose-headings:font-playfair prose-a:text-ochre-500 prose-a:no-underline hover:prose-a:underline max-w-none mb-10"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {photos && photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-[4/3] overflow-hidden rounded-sm bg-stone-100">
              <Image
                src={photo.image_url}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {!content && (!photos || photos.length === 0) && (
        <p className="text-ink-muted italic">Inhoud wordt binnenkort toegevoegd.</p>
      )}
    </div>
  )
}
