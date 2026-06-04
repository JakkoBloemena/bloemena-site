'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

export default function DeletePostButton({ id }: { id: string }) {
  const router = useRouter()
  async function handleDelete() {
    if (!confirm('Weet u zeker dat u dit bericht wilt verwijderen?')) return
    const supabase = createClient()
    await supabase.from('posts').delete().eq('id', id)
    router.refresh()
  }
  return (
    <button onClick={handleDelete} className="text-stone-300 hover:text-red-500 transition-colors" aria-label="Verwijder">
      <Trash2 size={15} />
    </button>
  )
}
