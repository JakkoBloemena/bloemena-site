import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  return (
    <footer className="bg-forest-950 py-10 text-center">
      <p className="font-playfair text-lg font-semibold text-forest-200 mb-1">Wiebe Bloemena</p>
      <p className="text-forest-700 text-xs tracking-widest uppercase">
        &copy; {new Date().getFullYear()} — {t('rights')}
      </p>
    </footer>
  )
}
