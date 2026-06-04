'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Check } from 'lucide-react'
import RichTextEditor from '@/components/ui/RichTextEditor'

const LABELS: Record<string, string> = {
  recensies: 'Recensies',
  projecten: 'Projecten',
  publicaties: 'Publicaties',
  tentoonstellingen: 'Tentoonstellingen',
}

export default function NewArticlePage() {
  const router = useRouter()
  const params = useParams()
  const category = params.category as string
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Voer een titel in.'); return }
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error: dbErr } = await supabase.from('articles').insert({
      title_nl: title, title_en: title,
      content_nl: content || `<p>${title}</p>`,
      content_en: content || `<p>${title}</p>`,
      published_at: date,
      category,
    })
    if (dbErr) { setError('Opslaan mislukt: ' + dbErr.message); setSaving(false); return }
    setDone(true)
    setTimeout(() => router.push(`/admin/articles/${category}`), 1000)
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Check size={26} className="text-green-600" />
        </div>
        <p className="font-semibold text-stone-700">Opgeslagen!</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pb-10">
      <header className="bg-white border-b border-stone-200 px-4 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <Link href={`/admin/articles/${category}`} className="p-1 -ml-1 text-stone-400"><ArrowLeft size={20} /></Link>
        <h1 className="font-bold text-stone-900 flex-1">Nieuw — {LABELS[category] ?? category}</h1>
      </header>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4 pt-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Datum</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Titel</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required
            className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Tekst</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        <button type="submit" disabled={saving}
          className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-medium text-sm hover:bg-amber-700 transition-colors disabled:opacity-50">
          {saving ? 'Opslaan…' : 'Opslaan'}
        </button>
      </form>
    </div>
  )
}
