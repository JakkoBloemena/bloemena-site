'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Check } from 'lucide-react'
import type { Painting } from '@/types'

export default function EditPaintingForm({ painting }: { painting: Painting }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>(painting.image_url)
  const [newFile, setNewFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: painting.title_nl,
    description: painting.description_nl ?? '',
    category: painting.category,
    year: painting.year?.toString() ?? '',
    width_cm: painting.width_cm?.toString() ?? '',
    height_cm: painting.height_cm?.toString() ?? '',
    medium: painting.medium_nl ?? '',
    featured: painting.featured,
    for_sale: painting.for_sale ?? false,
    price_eur: painting.price_eur?.toString() ?? '',
    collection_info: painting.collection_info ?? '',
    sort_order: painting.sort_order !== 999 ? painting.sort_order?.toString() ?? '' : '',
  })

  function set(key: string, val: string | boolean) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setNewFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const supabase = createClient()

    let imageUrl = painting.image_url

    if (newFile) {
      const ext = newFile.name.split('.').pop()
      const path = `paintings/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('artwork').upload(path, newFile, { upsert: true })
      if (uploadErr) { setError('Uploaden mislukt: ' + uploadErr.message); setSaving(false); return }
      const { data: { publicUrl } } = supabase.storage.from('artwork').getPublicUrl(path)
      imageUrl = publicUrl
    }

    const { error: dbErr } = await supabase.from('paintings').update({
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
      sort_order: form.featured && form.sort_order ? parseInt(form.sort_order) : 999,
      for_sale: form.for_sale,
      price_eur: form.for_sale && form.price_eur ? parseFloat(form.price_eur) : null,
      collection_info: !form.for_sale && form.collection_info ? form.collection_info : null,
      image_url: imageUrl,
    }).eq('id', painting.id)

    if (dbErr) { setError('Opslaan mislukt: ' + dbErr.message); setSaving(false); return }
    setDone(true)
    setTimeout(() => router.push('/admin/paintings'), 800)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check size={24} className="text-green-600" />
          </div>
          <p className="font-semibold text-stone-700">Opgeslagen!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin/paintings" className="text-stone-400 hover:text-stone-700"><ArrowLeft size={18} /></Link>
        <h1 className="font-bold text-stone-900 flex-1 truncate">{painting.title_nl} bewerken</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Afbeelding</label>
          <div className="flex gap-4 items-start">
            <img src={preview} alt="preview" className="w-32 h-32 object-cover rounded bg-stone-100" />
            <div>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="text-sm text-amber-700 hover:underline border border-stone-300 rounded px-3 py-1.5">
                Andere afbeelding kiezen
              </button>
              <p className="text-xs text-stone-400 mt-1">JPG, PNG, WebP</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Type</label>
          <div className="flex gap-3">
            {['schilderij', 'tekening'].map(cat => (
              <button key={cat} type="button" onClick={() => set('category', cat)}
                className={`flex-1 py-2.5 rounded border text-sm font-medium transition-colors ${form.category === cat ? 'bg-amber-600 text-white border-amber-600' : 'border-stone-300 text-stone-600 hover:border-amber-400'}`}>
                {cat === 'schilderij' ? 'Schilderij' : 'Tekening'}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Titel *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} required
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Omschrijving</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-none" />
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Jaar</label>
            <input type="number" value={form.year} onChange={e => set('year', e.target.value)} placeholder="2024"
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Breedte (cm)</label>
            <input type="number" value={form.width_cm} onChange={e => set('width_cm', e.target.value)}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Hoogte (cm)</label>
            <input type="number" value={form.height_cm} onChange={e => set('height_cm', e.target.value)}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Techniek</label>
          <input value={form.medium} onChange={e => set('medium', e.target.value)} placeholder="bijv. Olieverf op linnen"
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
        </div>

        {/* For sale */}
        <div className="border border-stone-200 rounded-lg p-4 space-y-3">
          <div className="flex gap-3">
            <button type="button" onClick={() => set('for_sale', true)}
              className={`flex-1 py-2 rounded border text-sm font-medium transition-colors ${form.for_sale ? 'bg-amber-600 text-white border-amber-600' : 'border-stone-300 text-stone-600 hover:border-amber-400'}`}>
              Te koop
            </button>
            <button type="button" onClick={() => set('for_sale', false)}
              className={`flex-1 py-2 rounded border text-sm font-medium transition-colors ${!form.for_sale ? 'bg-forest-700 text-white border-forest-700' : 'border-stone-300 text-stone-600 hover:border-stone-400'}`}>
              Niet te koop
            </button>
          </div>
          {form.for_sale ? (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Prijs (EUR)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">€</span>
                <input type="number" value={form.price_eur} onChange={e => set('price_eur', e.target.value)}
                  placeholder="1200" className="w-full border border-stone-300 rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Locatie / collectie</label>
              <input value={form.collection_info} onChange={e => set('collection_info', e.target.value)}
                placeholder="bijv. Particuliere collectie Rabobank Utrecht"
                className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
            </div>
          )}
        </div>

        {/* Featured + order */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-amber-600" />
            <div>
              <span className="text-sm font-medium text-stone-700">Uitgelicht op homepage</span>
              <p className="text-xs text-stone-400">Dit werk verschijnt in de slideshow op de voorpagina</p>
            </div>
          </label>
          {form.featured && (
            <div className="ml-7">
              <label className="block text-sm font-medium text-stone-700 mb-1">Volgorde in slideshow</label>
              <input type="number" min="1" value={form.sort_order} onChange={e => set('sort_order', e.target.value)}
                placeholder="1 = eerste, 2 = tweede…"
                className="w-48 border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
            </div>
          )}
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 bg-stone-900 text-white py-3 rounded font-medium hover:bg-amber-700 transition-colors disabled:opacity-50">
            {saving ? 'Opslaan…' : 'Opslaan'}
          </button>
          <Link href="/admin/paintings" className="px-6 py-3 border border-stone-300 rounded text-sm text-stone-600 hover:bg-stone-50 text-center">
            Annuleren
          </Link>
        </div>
      </form>
    </div>
  )
}
