'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Check } from 'lucide-react'

export default function NewPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title_nl: '', title_en: '',
    content_nl: '', content_en: '',
    published_at: new Date().toISOString().slice(0, 10),
  })

  function set(key: string, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error: dbErr } = await supabase.from('posts').insert({
      title_nl: form.title_nl,
      title_en: form.title_en || form.title_nl,
      content_nl: form.content_nl,
      content_en: form.content_en || form.content_nl,
      published_at: form.published_at,
    })
    if (dbErr) { setError('Opslaan mislukt: ' + dbErr.message); setSaving(false); return }
    setDone(true)
    setTimeout(() => router.push('/admin/posts'), 1200)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check size={24} className="text-green-600" />
          </div>
          <p className="font-semibold text-stone-700">Bericht opgeslagen!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin/posts" className="text-stone-400 hover:text-stone-700"><ArrowLeft size={18} /></Link>
        <h1 className="font-bold text-stone-900">Bericht toevoegen</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Datum</label>
          <input type="date" value={form.published_at} onChange={(e) => set('published_at', e.target.value)}
            className="border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Titel (NL) *</label>
            <input value={form.title_nl} onChange={(e) => set('title_nl', e.target.value)} required
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Titel (EN)</label>
            <input value={form.title_en} onChange={(e) => set('title_en', e.target.value)} placeholder="Zelfde als NL"
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Tekst (NL) *</label>
          <textarea value={form.content_nl} onChange={(e) => set('content_nl', e.target.value)} required rows={10}
            placeholder="Schrijf hier uw bericht…"
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-y font-mono" />
          <p className="text-xs text-stone-400 mt-1">HTML is toegestaan, bijv. &lt;b&gt;vetgedrukt&lt;/b&gt;</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Tekst (EN)</label>
          <textarea value={form.content_en} onChange={(e) => set('content_en', e.target.value)} rows={8}
            placeholder="Leave empty to use Dutch text"
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-y font-mono" />
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 bg-stone-900 text-white py-3 rounded font-medium hover:bg-amber-700 transition-colors disabled:opacity-50">
            {saving ? 'Opslaan…' : 'Bericht opslaan'}
          </button>
          <Link href="/admin/posts" className="px-6 py-3 border border-stone-300 rounded text-sm text-stone-600 hover:bg-stone-50 text-center">
            Annuleren
          </Link>
        </div>
      </form>
    </div>
  )
}
