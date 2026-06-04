'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Upload, Check } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Photo { id: string; image_url: string; caption: string | null }

function SortablePhoto({
  photo,
  savedId,
  onCaptionChange,
  onCaptionSave,
  onDelete,
}: {
  photo: Photo
  savedId: string | null
  onCaptionChange: (id: string, val: string) => void
  onCaptionSave: (id: string, val: string) => void
  onDelete: (photo: Photo) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: photo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-3 items-center bg-white rounded-xl p-3 shadow-sm"
    >
      {/* Drag handle — 5×5 dot grid */}
      <button
        {...attributes}
        {...listeners}
        className="shrink-0 text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing touch-none p-2 -ml-1"
        aria-label="Versleep"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          {[0,1,2,3,4].flatMap(row =>
            [0,1,2,3,4].map(col => (
              <circle key={`${row}-${col}`} cx={2 + col * 4} cy={2 + row * 4} r="1.2" />
            ))
          )}
        </svg>
      </button>

      {/* Thumbnail */}
      <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-stone-100">
        <Image src={photo.image_url} alt="" fill className="object-cover" />
      </div>

      {/* Caption */}
      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={photo.caption ?? ''}
          onChange={e => onCaptionChange(photo.id, e.target.value)}
          onBlur={e => onCaptionSave(photo.id, e.target.value)}
          placeholder="Titel — Locatie…"
          className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 bg-stone-50"
        />
        {savedId === photo.id && (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <Check size={11} /> Opgeslagen
          </p>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(photo)}
        className="shrink-0 text-stone-300 hover:text-red-500 transition-colors"
        aria-label="Verwijder"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}

export default function PhotoManager({ initialPhotos }: { initialPhotos: Photo[] }) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [savedId, setSavedId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = photos.findIndex(p => p.id === active.id)
    const newIndex = photos.findIndex(p => p.id === over.id)
    const reordered = arrayMove(photos, oldIndex, newIndex)
    setPhotos(reordered)

    // Save new sort_order for all photos
    const supabase = createClient()
    await Promise.all(
      reordered.map((p, i) =>
        supabase.from('op_zn_plek_photos').update({ sort_order: i }).eq('id', p.id)
      )
    )
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    setError('')
    const supabase = createClient()
    const newPhotos: Photo[] = []
    const nextOrder = photos.length

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setProgress(`${i + 1} / ${files.length}`)
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const path = `op-zn-plek/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadErr } = await supabase.storage.from('artwork').upload(path, file)
      if (uploadErr) { setError('Upload mislukt: ' + uploadErr.message); continue }

      const { data: { publicUrl } } = supabase.storage.from('artwork').getPublicUrl(path)
      const { data, error: dbErr } = await supabase
        .from('op_zn_plek_photos')
        .insert({ image_url: publicUrl, sort_order: nextOrder + i })
        .select('id, image_url, caption')
        .single()
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
    <div className="max-w-lg mx-auto px-4 pt-4 space-y-3 pb-10">
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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={photos.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {photos.map(photo => (
                <SortablePhoto
                  key={photo.id}
                  photo={photo}
                  savedId={savedId}
                  onCaptionChange={handleCaptionChange}
                  onCaptionSave={handleCaptionSave}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center py-16 text-stone-400 text-sm">
          Nog geen foto&apos;s. Voeg ze toe via de knop hierboven.
        </div>
      )}
    </div>
  )
}
