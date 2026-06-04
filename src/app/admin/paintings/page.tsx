import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Plus, ArrowLeft } from 'lucide-react'
import DeletePaintingButton from './DeletePaintingButton'

export default async function AdminPaintingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: paintings } = await supabase
    .from('paintings')
    .select('id, title_nl, image_url, category, year, featured')
    .order('sort_order')

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-stone-400 hover:text-stone-700">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-bold text-stone-900 flex-1">Werken beheren</h1>
        <Link
          href="/admin/paintings/upload"
          className="flex items-center gap-1.5 bg-amber-600 text-white text-sm px-4 py-2 rounded hover:bg-amber-500 transition-colors"
        >
          <Plus size={16} /> Werk toevoegen
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {paintings && paintings.length > 0 ? (
          <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-stone-600 w-16"></th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600">Titel</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600 hidden sm:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600 hidden sm:table-cell">Jaar</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-600 hidden md:table-cell">Uitgelicht</th>
                  <th className="px-4 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paintings.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-stone-100">
                        <Image src={p.image_url} alt={p.title_nl} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-900">{p.title_nl}</td>
                    <td className="px-4 py-3 text-stone-500 hidden sm:table-cell capitalize">{p.category}</td>
                    <td className="px-4 py-3 text-stone-500 hidden sm:table-cell">{p.year ?? '—'}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-block w-2 h-2 rounded-full ${p.featured ? 'bg-amber-500' : 'bg-stone-300'}`} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/paintings/${p.id}`} className="text-xs text-amber-700 hover:underline">Bewerken</Link>
                        <DeletePaintingButton id={p.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-stone-400">
            <p className="mb-4">Nog geen werken toegevoegd.</p>
            <Link href="/admin/paintings/upload" className="text-amber-700 hover:underline text-sm">Voeg uw eerste werk toe →</Link>
          </div>
        )}
      </div>
    </div>
  )
}
