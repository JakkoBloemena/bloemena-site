import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ImageIcon, FileText, BookOpen, LogOut, ChevronRight, Star, Camera } from 'lucide-react'

const contentPages = [
  { slug: 'over-mij',          label: 'Over mij' },
  { slug: 'tentoonstellingen', label: 'Tentoonstellingen' },
  { slug: 'publicaties',       label: 'Publicaties' },
  { slug: 'projecten',         label: 'Projecten' },
  { slug: 'collecties',        label: 'Collecties' },
  { slug: 'recensies',         label: 'Recensies' },
  { slug: 'op-zn-plek',        label: "Op z'n plek" },
  { slug: 'schilderlessen',    label: 'Schilderlessen' },
]

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [{ count: paintingCount }, { count: postCount }, { count: featuredCount }, { count: photoCount }] = await Promise.all([
    supabase.from('paintings').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('paintings').select('*', { count: 'exact', head: true }).eq('featured', true),
    supabase.from('op_zn_plek_photos').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="font-bold text-stone-900 text-base leading-tight">Wiebe Bloemena</p>
          <p className="text-xs text-stone-400 mt-0.5">{user.email}</p>
        </div>
        <form action="/api/auth/signout" method="POST">
          <button type="submit" className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-red-600 py-2 px-1">
            <LogOut size={16} />
          </button>
        </form>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">

        {/* Main actions */}
        <section>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Beheer</p>
          <div className="space-y-2">

            <Link href="/admin/paintings" className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm active:bg-stone-50 transition-colors">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                <ImageIcon size={22} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-900">Werken</p>
                <p className="text-sm text-stone-400">{paintingCount ?? 0} schilderijen en tekeningen · <span className="text-amber-600">{featuredCount ?? 0} uitgelicht</span></p>
              </div>
              <ChevronRight size={18} className="text-stone-300 shrink-0" />
            </Link>

            <Link href="/admin/posts" className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm active:bg-stone-50 transition-colors">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={22} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-900">Nieuws</p>
                <p className="text-sm text-stone-400">{postCount ?? 0} berichten</p>
              </div>
              <ChevronRight size={18} className="text-stone-300 shrink-0" />
            </Link>

            <Link href="/admin/op-zn-plek" className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm active:bg-stone-50 transition-colors">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                <Camera size={22} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-900">Op z&apos;n plek</p>
                <p className="text-sm text-stone-400">{photoCount ?? 0} foto&apos;s</p>
              </div>
              <ChevronRight size={18} className="text-stone-300 shrink-0" />
            </Link>

          </div>
        </section>

        {/* Articles */}
        <section>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Artikelen</p>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-stone-100">
            {(['recensies', 'projecten', 'publicaties', 'tentoonstellingen'] as const).map(cat => (
              <Link key={cat} href={`/admin/articles/${cat}`} className="flex items-center gap-3 px-4 py-3.5 active:bg-stone-50 transition-colors">
                <BookOpen size={16} className="text-stone-400 shrink-0" />
                <span className="text-sm text-stone-700 flex-1 capitalize">{cat}</span>
                <ChevronRight size={16} className="text-stone-300 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Pages */}
        <section>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Pagina&apos;s bewerken</p>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-stone-100">
            {contentPages.map((p) => (
              <Link key={p.slug} href={`/admin/pages/${p.slug}`} className="flex items-center gap-3 px-4 py-3.5 active:bg-stone-50 transition-colors">
                <BookOpen size={16} className="text-stone-400 shrink-0" />
                <span className="text-sm text-stone-700 flex-1">{p.label}</span>
                <ChevronRight size={16} className="text-stone-300 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        <p className="text-xs text-stone-300 text-center">
          <Link href="/" className="hover:text-stone-500" target="_blank">Bekijk de website →</Link>
        </p>
      </div>
    </div>
  )
}
