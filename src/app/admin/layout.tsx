import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = { title: 'Admin — Wiebe Bloemena' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-stone-100 antialiased">{children}</body>
    </html>
  )
}
