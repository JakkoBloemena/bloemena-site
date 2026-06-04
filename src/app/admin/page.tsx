import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Image, FileText, LogOut } from 'lucide-react'

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
      {/* Header */}
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

      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-stone-500 mb-8">Goedendag! Wat wilt u beheren?</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/paintings"
            className="bg-white rounded-lg border border-stone-200 p-6 hover:border-amber-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <Image size={20} className="text-amber-700" />
              </div>
              <h2 className="font-semibold text-stone-900">Werken</h2>
            </div>
            <p className="text-sm text-stone-500">{paintingCount ?? 0} schilderijen en tekeningen</p>
            <p className="text-xs text-amber-700 mt-3 font-medium">Beheren →</p>
          </Link>

          <Link
            href="/admin/posts"
            className="bg-white rounded-lg border border-stone-200 p-6 hover:border-amber-400 hover:shadow-sm transition-all group"
          >
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

        <div className="mt-8 pt-8 border-t border-stone-200">
          <p className="text-xs text-stone-400">
            Publieke website:{' '}
            <Link href="/nl" className="text-amber-700 hover:underline" target="_blank">bloemena.com</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
