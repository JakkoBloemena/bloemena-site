import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ImageIcon, FileText, BookOpen, LogOut } from 'lucide-react'

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

  const [{ count: paintingCount }, { count: postCount }] = await Promise.all([
    supabase.from('paintings').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-stone-900">Wiebe Bloemena — Beheer</h1>
          <p className="text-xs text-stone-500 mt-0.5">{user.email}</p>
        </div>
        <form action="/api/auth/signout" method="POST">
          <button type="submit" className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-red-600">
            <LogOut size={15} /> Uitloggen
          </button>
        </form>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        <p className="text-stone-500">Goedendag! Wat wilt u beheren?</p>

        {/* Werken + Nieuws */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin/paintings" className="bg-white rounded-lg border border-stone-200 p-6 hover:border-amber-400 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <ImageIcon size={20} className="text-amber-700" />
              </div>
              <h2 className="font-semibold text-stone-900">Werken</h2>
            </div>
            <p className="text-sm text-stone-500">{paintingCount ?? 0} schilderijen en tekeningen</p>
            <p className="text-xs text-amber-700 mt-3 font-medium">Beheren →</p>
          </Link>

          <Link href="/admin/posts" className="bg-white rounded-lg border border-stone-200 p-6 hover:border-amber-400 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <FileText size={20} className="text-amber-700" />
              </div>
              <h2 className="font-semibold text-stone-900">Nieuws</h2>
            </div>
            <p className="text-sm text-stone-500">{postCount ?? 0} berichten</p>
            <p className="text-xs text-amber-700 mt-3 font-medium">Beheren →</p>
          </Link>
        </div>

        {/* Pagina's */}
        <div>
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Pagina&apos;s bewerken</h2>
          <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100">
            {contentPages.map((p) => (
              <Link key={p.slug} href={`/admin/pages/${p.slug}`} className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors group">
                <BookOpen size={15} className="text-stone-400 group-hover:text-amber-600 shrink-0" />
                <span className="text-sm text-stone-700 flex-1">{p.label}</span>
                <span className="text-xs text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity">Bewerken →</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200">
          <p className="text-xs text-stone-400">
            Publieke website:{' '}
            <Link href="/" className="text-amber-700 hover:underline" target="_blank">bloemena.com</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
