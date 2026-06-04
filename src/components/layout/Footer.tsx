import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  return (
    <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500">
      <p className="font-playfair text-base font-semibold text-stone-700 mb-1">Wiebe Bloemena</p>
      <p>&copy; {new Date().getFullYear()} — {t('rights')}</p>
    </footer>
  )
}
