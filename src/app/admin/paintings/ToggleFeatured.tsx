'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Star } from 'lucide-react'

export default function ToggleFeatured({ id, featured }: { id: string; featured: boolean }) {
  const router = useRouter()
  async function toggle() {
    const supabase = createClient()
    await supabase.from('paintings').update({ featured: !featured }).eq('id', id)
    router.refresh()
  }
  return (
    <button onClick={toggle} title={featured ? 'Verwijder van voorpagina' : 'Toon op voorpagina'}>
      <Star size={15} className={featured ? 'fill-ochre-500 text-ochre-500' : 'text-stone-300 hover:text-ochre-400'} />
    </button>
  )
}
