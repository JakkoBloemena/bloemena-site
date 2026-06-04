'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Check } from 'lucide-react'
import RichTextEditor from '@/components/ui/RichTextEditor'

interface Props {
  slug: string
  title: string
  initialNl: string
  initialEn: string
}

export default function PageEditor({ slug, title, initialNl, initialEn }: Props) {
  const router = useRouter()
  const [nl, setNl] = useState(initialNl)
  const [en, setEn] = useState(initialEn)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'nl' | 'en'>('nl')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase
      .from('pages')
      .upsert({ slug, content_nl: nl, content_en: en || nl, updated_at: new Date().toISOString() }, { onConflict: 'slug' })
    if (err) { setError(err.message); setSaving(false); return }
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div className="min-h-screen pb-10">
      <header className="bg-white border-b border-stone-200 px-4 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/admin" className="p-1 -ml-1 text-stone-400"><ArrowLeft size={20} /></Link>
        <h1 className="font-bold text-stone-900 flex-1">{title}</h1>
        {saved && <span className="text-green-600 text-sm flex items-center gap-1"><Check size={14} /> Opgeslagen</span>}
      </header>

      <form onSubmit={handleSave} className="max-w-lg mx-auto px-4 pt-5 space-y-4">
        {/* Language tab */}
        <div className="flex rounded-lg overflow-hidden border border-stone-200 bg-white">
          <button type="button" onClick={() => setTab('nl')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === 'nl' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-700'}`}>
            Nederlands
          </button>
          <button type="button" onClick={() => setTab('en')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === 'en' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-700'}`}>
            English
          </button>
        </div>

        {tab === 'nl' ? (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Tekst (NL)</label>
            <RichTextEditor value={nl} onChange={setNl} placeholder="Schrijf hier de Nederlandse tekst…" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Text (EN) <span className="text-stone-400 font-normal text-xs">— leeg laten = zelfde als NL</span>
            </label>
            <RichTextEditor value={en} onChange={setEn} placeholder="English text (optional)…" />
          </div>
        )}

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={saving}
          className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-medium text-sm hover:bg-amber-700 transition-colors disabled:opacity-50">
          {saving ? 'Opslaan…' : 'Opslaan'}
        </button>
      </form>
    </div>
  )
}
