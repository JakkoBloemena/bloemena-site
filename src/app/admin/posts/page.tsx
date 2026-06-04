import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Plus, ArrowLeft, ChevronRight } from 'lucide-react'
import DeletePostButton from './DeletePostButton'

export default async function AdminPostsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title_nl, published_at')
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen pb-10">
      <header className="bg-white border-b border-stone-200 px-4 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/admin" className="p-1 -ml-1 text-stone-400"><ArrowLeft size={20} /></Link>
        <h1 className="font-bold text-stone-900 flex-1">Nieuws</h1>
        <Link href="/admin/posts/new" className="flex items-center gap-1.5 bg-amber-600 text-white text-sm font-medium px-3 py-2 rounded-lg">
          <Plus size={16} /> Nieuw bericht
        </Link>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {posts && posts.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-stone-100">
            {posts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900 text-sm truncate">{p.title_nl}</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {new Date(p.published_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/admin/posts/${p.id}`} className="text-xs text-amber-700 font-medium px-2 py-1.5 rounded bg-amber-50">
                    Bewerk
                  </Link>
                  <DeletePostButton id={p.id} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-stone-400">
            <p className="mb-4">Nog geen berichten.</p>
            <Link href="/admin/posts/new" className="text-amber-700 text-sm font-medium">Schrijf uw eerste bericht →</Link>
          </div>
        )}
      </div>
    </div>
  )
}
