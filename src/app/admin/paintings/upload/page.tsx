'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Upload, Check } from 'lucide-react'

export default function UploadPaintingPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'schilderij',
    year: '', width_cm: '', height_cm: '',
    medium: '',
    featured: false,
  })

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  function set(key: string, val: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) { setError('Kies een afbeelding.'); return }
    setSaving(true)
    setError('')

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `paintings/${Date.now()}.${ext}`

    const { error: uploadErr } = await supabase.storage.from('artwork').upload(path, file, { upsert: true })
    if (uploadErr) { setError('Uploaden mislukt: ' + uploadErr.message); setSaving(false); return }

    const { data: { publicUrl } } = supabase.storage.from('artwork').getPublicUrl(path)

    const { error: dbErr } = await supabase.from('paintings').insert({
      title_nl: form.title,
      title_en: form.title,
      description_nl: form.description || null,
      description_en: form.description || null,
      category: form.category,
      year: form.year ? parseInt(form.year) : null,
      width_cm: form.width_cm ? parseFloat(form.width_cm) : null,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
      medium_nl: form.medium || null,
      medium_en: form.medium || null,
      featured: form.featured,
      image_url: publicUrl,
      sort_order: 999,
    })

    if (dbErr) { setError('Opslaan mislukt: ' + dbErr.message); setSaving(false); return }
    setDone(true)
    setTimeout(() => router.push('/admin/paintings'), 1200)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check size={24} className="text-green-600" />
          </div>
          <p className="font-semibold text-stone-700">Werk opgeslagen!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin/paintings" className="text-stone-400 hover:text-stone-700">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-bold text-stone-900">Werk toevoegen</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Afbeelding *</label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${preview ? 'border-amber-300 bg-amber-50' : 'border-stone-300 hover:border-amber-400 bg-stone-50'}`}
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded object-contain" />
            ) : (
              <div className="py-6">
                <Upload size={28} className="mx-auto text-stone-400 mb-2" />
                <p className="text-sm text-stone-500">Klik om een afbeelding te kiezen</p>
                <p className="text-xs text-stone-400 mt-1">JPG, PNG, WebP</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
          {preview && (
            <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-amber-700 hover:underline mt-1 block">
              Andere afbeelding kiezen
            </button>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Type</label>
          <div className="flex gap-3">
            {['schilderij', 'tekening'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => set('category', cat)}
                className={`flex-1 py-2.5 rounded border text-sm font-medium transition-colors ${form.category === cat ? 'bg-amber-600 text-white border-amber-600' : 'border-stone-300 text-stone-600 hover:border-amber-400'}`}
              >
                {cat === 'schilderij' ? 'Schilderij' : 'Tekening'}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Titel *</label>
          <input value={form.title} onChange={(e) => set('title', e.target.value)} required
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Omschrijving</label>
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-none" />
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Jaar</label>
            <input type="number" value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="2024"
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Breedte (cm)</label>
            <input type="number" value={form.width_cm} onChange={(e) => set('width_cm', e.target.value)}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Hoogte (cm)</label>
            <input type="number" value={form.height_cm} onChange={(e) => set('height_cm', e.target.value)}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Techniek</label>
          <input value={form.medium} onChange={(e) => set('medium', e.target.value)} placeholder="bijv. Olieverf op linnen"
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
        </div>

        {/* Featured */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)}
            className="w-4 h-4 accent-amber-600" />
          <div>
            <span className="text-sm font-medium text-stone-700">Uitgelicht op homepage</span>
            <p className="text-xs text-stone-400">Dit werk verschijnt in de galerij op de voorpagina</p>
          </div>
        </label>

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-stone-900 text-white py-3 rounded font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Opslaan…' : 'Werk opslaan'}
          </button>
          <Link href="/admin/paintings" className="px-6 py-3 border border-stone-300 rounded text-sm text-stone-600 hover:bg-stone-50 text-center">
            Annuleren
          </Link>
        </div>
      </form>
    </div>
  )
}
