'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Check } from 'lucide-react'

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
    <div className="min-h-screen">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-stone-400 hover:text-stone-700"><ArrowLeft size={18} /></Link>
        <h1 className="font-bold text-stone-900 flex-1">{title} bewerken</h1>
        {saved && (
          <span className="flex items-center gap-1 text-green-600 text-sm">
            <Check size={14} /> Opgeslagen
          </span>
        )}
      </header>

      <form onSubmit={handleSave} className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Tekst (NL)
          </label>
          <textarea
            value={nl}
            onChange={(e) => setNl(e.target.value)}
            rows={18}
            placeholder="Schrijf hier de Nederlandse tekst… HTML is toegestaan."
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-y font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Tekst (EN) <span className="text-stone-400 font-normal">— laat leeg om de NL tekst te gebruiken</span>
          </label>
          <textarea
            value={en}
            onChange={(e) => setEn(e.target.value)}
            rows={12}
            placeholder="English text (optional)…"
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-y font-mono"
          />
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-stone-900 text-white py-3 rounded font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Opslaan…' : 'Opslaan'}
        </button>
      </form>
    </div>
  )
}
