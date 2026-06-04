'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

export default function ContactPage() {
  const t = useTranslations('contact')
  const locale = useLocale()
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      setStatus(res.ok ? 'ok' : 'err')
    } catch {
      setStatus('err')
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-4xl font-bold mb-10">{t('title')}</h1>
      {status === 'ok' ? (
        <p className="text-green-700 bg-green-50 border border-green-200 rounded p-4">{t('success')}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">{t('name')}</label>
            <input name="name" required className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('email')}</label>
            <input name="email" type="email" required className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('message')}</label>
            <textarea name="message" required rows={5} className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-none" />
          </div>
          {status === 'err' && <p className="text-red-600 text-sm">{t('error')}</p>}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-stone-900 text-white py-3 rounded text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {status === 'sending' ? '…' : t('send')}
          </button>
        </form>
      )}
    </div>
  )
}
