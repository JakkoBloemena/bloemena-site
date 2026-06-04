import Link from 'next/link'

interface Props {
  title: string
  content: string | null
  backHref: string
  backLabel: string
  emptyMessage?: string
}

export default function ContentPage({ title, content, backHref, backLabel, emptyMessage }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <Link href={backHref} className="text-xs text-ochre-500 hover:underline uppercase tracking-widest mb-6 block">
        ← {backLabel}
      </Link>
      <h1 className="font-playfair text-4xl font-bold text-forest-900 mb-10">{title}</h1>
      {content ? (
        <div
          className="prose prose-stone prose-headings:font-playfair prose-a:text-ochre-500 prose-a:no-underline hover:prose-a:underline max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-ink-muted italic">{emptyMessage ?? 'Inhoud wordt binnenkort toegevoegd.'}</p>
      )}
    </div>
  )
}
