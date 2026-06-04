import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import '../globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Beheer — Wiebe Bloemena',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={geist.variable}>
      <body className="min-h-screen bg-stone-100 antialiased font-sans text-stone-900">
        {children}
      </body>
    </html>
  )
}
