'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Upload, Check } from 'lucide-react'

interface Photo { id: string; image_url: string; caption: string | null }

export default function PhotoManager({ initialPhotos }: { initialPhotos: Photo[] }) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [savedId, setSavedId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    setError('')
    const supabase = createClient()
    const newPhotos: Photo[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setProgress(`${i + 1} / ${files.length}`)
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const path = `op-zn-plek/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadErr } = await supabase.storage.from('artwork').upload(path, file)
      if (uploadErr) { setError('Upload mislukt: ' + uploadErr.message); continue }

      const { data: { publicUrl } } = supabase.storage.from('artwork').getPublicUrl(path)
      const { data, error: dbErr } = await supabase.from('op_zn_plek_photos').insert({ image_url: publicUrl }).select('id, image_url, caption').single()
      if (dbErr) { setError('Opslaan mislukt: ' + dbErr.message); continue }
      if (data) newPhotos.push(data)
    }

    setPhotos(prev => [...prev, ...newPhotos])
    setUploading(false)
    setProgress('')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleDelete(photo: Photo) {
    if (!confirm('Foto verwijderen?')) return
    const supabase = createClient()
    await supabase.from('op_zn_plek_photos').delete().eq('id', photo.id)
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
  }

  function handleCaptionChange(id: string, value: string) {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, caption: value } : p))
  }

  async function handleCaptionSave(id: string, caption: string) {
    const supabase = createClient()
    await supabase.from('op_zn_plek_photos').update({ caption: caption || null }).eq('id', id)
    setSavedId(id)
    setTimeout(() => setSavedId(null), 1500)
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 space-y-4 pb-10">
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 w-full justify-center border-2 border-dashed border-stone-300 rounded-xl py-5 text-sm text-stone-500 hover:border-amber-400 hover:text-amber-600 transition-colors disabled:opacity-50"
      >
        <Upload size={16} />
        {uploading ? `Uploaden… ${progress}` : "Foto's toevoegen"}
      </button>

      {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      {photos.length > 0 ? (
        <div className="space-y-3">
          {photos.map((photo) => (
            <div key={photo.id} className="flex gap-3 items-start bg-white rounded-xl p-3 shadow-sm">
              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-stone-100">
                <Image src={photo.image_url} alt="" fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={photo.caption ?? ''}
                  onChange={e => handleCaptionChange(photo.id, e.target.value)}
                  onBlur={e => handleCaptionSave(photo.id, e.target.value)}
                  placeholder="Titel / locatie…"
                  className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 bg-stone-50"
                />
                {savedId === photo.id && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><Check size={11} /> Opgeslagen</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(photo)}
                className="shrink-0 text-stone-300 hover:text-red-500 transition-colors mt-1"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-stone-400 text-sm">
          Nog geen foto&apos;s. Voeg ze toe via de knop hierboven.
        </div>
      )}
    </div>
  )
}
