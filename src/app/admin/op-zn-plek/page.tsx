import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import PhotoManager from './PhotoManager'

export default async function AdminOpZnPlekPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: photos } = await supabase
    .from('op_zn_plek_photos')
    .select('id, image_url, caption')
    .order('sort_order')
    .order('created_at')

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-stone-200 px-4 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/admin" className="p-1 -ml-1 text-stone-400"><ArrowLeft size={20} /></Link>
        <h1 className="font-bold text-stone-900 flex-1">Op z&apos;n plek</h1>
        <span className="text-sm text-stone-400">{photos?.length ?? 0} foto&apos;s</span>
      </header>
      <PhotoManager initialPhotos={photos ?? []} />
    </div>
  )
}
