import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Plus, ArrowLeft, Star } from 'lucide-react'
import DeletePaintingButton from './DeletePaintingButton'
import ToggleFeatured from './ToggleFeatured'

export default async function AdminPaintingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: paintings } = await supabase
    .from('paintings')
    .select('id, title_nl, image_url, category, year, featured')
    .order('year', { ascending: false, nullsFirst: false })

  const schilderijen = paintings?.filter(p => p.category === 'schilderij') ?? []
  const tekeningen = paintings?.filter(p => p.category === 'tekening') ?? []

  function PaintingCard({ p }: { p: typeof schilderijen[0] }) {
    return (
      <div className="flex items-center gap-3 bg-white px-4 py-3 border-b border-stone-100 last:border-0">
        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0">
          <Image src={p.image_url} alt={p.title_nl} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-stone-900 text-sm truncate">{p.title_nl}</p>
          <p className="text-xs text-stone-400">{p.year ?? '—'}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ToggleFeatured id={p.id} featured={p.featured} />
          <Link href={`/admin/paintings/${p.id}`} className="text-xs text-amber-700 font-medium px-2 py-1.5 rounded bg-amber-50 active:bg-amber-100">
            Bewerk
          </Link>
          <DeletePaintingButton id={p.id} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-10">
      <header className="bg-white border-b border-stone-200 px-4 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/admin" className="p-1 -ml-1 text-stone-400"><ArrowLeft size={20} /></Link>
        <h1 className="font-bold text-stone-900 flex-1">Werken</h1>
        <Link href="/admin/paintings/upload" className="flex items-center gap-1.5 bg-amber-600 text-white text-sm font-medium px-3 py-2 rounded-lg">
          <Plus size={16} /> Nieuw
        </Link>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {paintings && paintings.length > 0 ? (
          <>
            {schilderijen.length > 0 && (
              <section>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">Schilderijen ({schilderijen.length})</p>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {schilderijen.map(p => <PaintingCard key={p.id} p={p} />)}
                </div>
              </section>
            )}
            {tekeningen.length > 0 && (
              <section>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">Tekeningen ({tekeningen.length})</p>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {tekeningen.map(p => <PaintingCard key={p.id} p={p} />)}
                </div>
              </section>
            )}
            <p className="text-xs text-stone-400 text-center pt-2">
              <Star size={12} className="inline mr-1" />Tik de ster om een werk op de homepage te tonen
            </p>
          </>
        ) : (
          <div className="text-center py-16 text-stone-400">
            <p className="mb-4">Nog geen werken.</p>
            <Link href="/admin/paintings/upload" className="text-amber-700 text-sm font-medium">Voeg uw eerste werk toe →</Link>
          </div>
        )}
      </div>
    </div>
  )
}
