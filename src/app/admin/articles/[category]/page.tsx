import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Plus } from 'lucide-react'
import DeleteArticleButton from './DeleteArticleButton'

const LABELS: Record<string, string> = {
  recensies: 'Recensies',
  projecten: 'Projecten',
  publicaties: 'Publicaties',
  tentoonstellingen: 'Tentoonstellingen',
}

export default async function AdminArticlesPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  if (!LABELS[category]) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title_nl, published_at')
    .eq('category', category)
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen pb-10">
      <header className="bg-white border-b border-stone-200 px-4 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/admin" className="p-1 -ml-1 text-stone-400"><ArrowLeft size={20} /></Link>
        <h1 className="font-bold text-stone-900 flex-1">{LABELS[category]}</h1>
        <Link href={`/admin/articles/${category}/new`} className="flex items-center gap-1.5 bg-amber-600 text-white text-sm font-medium px-3 py-2 rounded-lg">
          <Plus size={16} /> Nieuw
        </Link>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {articles && articles.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-stone-100">
            {articles.map(a => (
              <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900 text-sm truncate">{a.title_nl}</p>
                  <p className="text-xs text-stone-400">{new Date(a.published_at).toLocaleDateString('nl-NL')}</p>
                </div>
                <Link href={`/admin/articles/${category}/${a.id}`} className="text-xs text-amber-700 font-medium px-2 py-1.5 rounded bg-amber-50 active:bg-amber-100 shrink-0">
                  Bewerk
                </Link>
                <DeleteArticleButton id={a.id} category={category} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-stone-400">
            <p className="mb-4">Nog geen artikelen.</p>
            <Link href={`/admin/articles/${category}/new`} className="text-amber-700 text-sm font-medium">Voeg het eerste toe →</Link>
          </div>
        )}
      </div>
    </div>
  )
}
