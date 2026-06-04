import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Plus, ArrowLeft } from 'lucide-react'
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
    <div className="min-h-screen">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-stone-400 hover:text-stone-700"><ArrowLeft size={18} /></Link>
        <h1 className="font-bold text-stone-900 flex-1">Nieuws beheren</h1>
        <Link href="/admin/posts/new" className="flex items-center gap-1.5 bg-amber-600 text-white text-sm px-4 py-2 rounded hover:bg-amber-500 transition-colors">
          <Plus size={16} /> Bericht toevoegen
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {posts && posts.length > 0 ? (
          <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Titel</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600 hidden sm:table-cell">Datum</th>
                  <th className="px-4 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-900">{p.title_nl}</td>
                    <td className="px-4 py-3 text-stone-400 text-xs hidden sm:table-cell">
                      {new Date(p.published_at).toLocaleDateString('nl-NL', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/posts/${p.id}`} className="text-xs text-amber-700 hover:underline">Bewerken</Link>
                        <DeletePostButton id={p.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-stone-400">
            <p className="mb-4">Nog geen berichten.</p>
            <Link href="/admin/posts/new" className="text-amber-700 hover:underline text-sm">Schrijf uw eerste bericht →</Link>
          </div>
        )}
      </div>
    </div>
  )
}
