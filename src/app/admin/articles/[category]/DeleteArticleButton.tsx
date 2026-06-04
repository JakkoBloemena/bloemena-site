'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

export default function DeleteArticleButton({ id, category }: { id: string; category: string }) {
  const router = useRouter()
  async function handleDelete() {
    if (!confirm('Artikel verwijderen?')) return
    const supabase = createClient()
    await supabase.from('articles').delete().eq('id', id)
    router.refresh()
  }
  return (
    <button onClick={handleDelete} className="text-stone-300 hover:text-red-500 transition-colors shrink-0" aria-label="Verwijder">
      <Trash2 size={15} />
    </button>
  )
}
