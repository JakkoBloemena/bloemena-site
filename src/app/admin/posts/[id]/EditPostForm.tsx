'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Check } from 'lucide-react'
import RichTextEditor from '@/components/ui/RichTextEditor'

interface Post {
  id: string
  title_nl: string
  title_en: string
  content_nl: string
  content_en: string
  published_at: string
}

export default function EditPostForm({ post }: { post: Post }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState(post.title_nl)
  const [content, setContent] = useState(post.content_nl)
  const [date, setDate] = useState(post.published_at.slice(0, 10))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error: dbErr } = await supabase.from('posts').update({
      title_nl: title,
      title_en: title,
      content_nl: content,
      content_en: content,
      published_at: date,
    }).eq('id', post.id)
    if (dbErr) { setError('Opslaan mislukt: ' + dbErr.message); setSaving(false); return }
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="min-h-screen pb-10">
      <header className="bg-white border-b border-stone-200 px-4 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/admin/posts" className="p-1 -ml-1 text-stone-400"><ArrowLeft size={20} /></Link>
        <h1 className="font-bold text-stone-900 flex-1 truncate">{post.title_nl}</h1>
        {saved && <span className="text-green-600 text-sm flex items-center gap-1"><Check size={14} /> Opgeslagen</span>}
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

        <button type="submit" disabled={saving || saved}
          className={`w-full py-3.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 ${saved ? 'bg-green-600 text-white' : 'bg-stone-900 text-white hover:bg-amber-700'}`}>
          {saving ? 'Opslaan…' : saved ? <><Check size={14} /> Opgeslagen</> : 'Opslaan'}
        </button>
      </form>
    </div>
  )
}
