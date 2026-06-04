import Link from 'next/link'

const WHATSAPP = 'https://wa.me/31638036823'
const PHONE = 'tel:+31638036823'
const EMAIL = 'mailto:wbloemena@hotmail.com'
const MAPS_EMBED = 'https://maps.google.com/maps?q=Jacob+Catsstraat+2,+7576+BS+Oldenzaal&output=embed&z=16'
const MAPS_DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=Jacob+Catsstraat+2%2C+7576+BS+Oldenzaal'

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isNl = locale === 'nl'

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <Link href={isNl ? '/' : '/en'} className="text-xs text-ochre-500 hover:underline uppercase tracking-widest mb-6 block">
        ← Home
      </Link>
      <h1 className="font-playfair text-4xl font-bold text-forest-900 mb-4">Contact</h1>
      <p className="text-ink-muted mb-10">
        {isNl
          ? 'Vragen over een werk, interesse in een schilderij, of gewoon even kennismaken? Neem gerust contact op.'
          : 'Questions about a work, interest in a painting, or just getting in touch? Feel free to reach out.'}
      </p>

      <div className="space-y-3">
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-white border border-forest-100 rounded-xl px-5 py-4 shadow-sm hover:border-[#25D366] hover:shadow transition-all group"
        >
          <div className="w-11 h-11 bg-[#25D366] rounded-full flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-forest-900 group-hover:text-[#25D366] transition-colors">WhatsApp</p>
            <p className="text-sm text-ink-muted">06-38 03 68 23</p>
          </div>
        </a>

        <a href={PHONE} className="flex items-center gap-4 bg-white border border-forest-100 rounded-xl px-5 py-4 shadow-sm hover:border-ochre-400 hover:shadow transition-all group">
          <div className="w-11 h-11 bg-forest-100 rounded-full flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-forest-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .9h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.92v1z"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-forest-900 group-hover:text-ochre-600 transition-colors">{isNl ? 'Bellen' : 'Call'}</p>
            <p className="text-sm text-ink-muted">06-38 03 68 23</p>
          </div>
        </a>

        <a href={EMAIL} className="flex items-center gap-4 bg-white border border-forest-100 rounded-xl px-5 py-4 shadow-sm hover:border-ochre-400 hover:shadow transition-all group">
          <div className="w-11 h-11 bg-forest-100 rounded-full flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-forest-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-forest-900 group-hover:text-ochre-600 transition-colors">E-mail</p>
            <p className="text-sm text-ink-muted">wbloemena@hotmail.com</p>
          </div>
        </a>
      </div>

      <section className="mt-12" aria-label={isNl ? 'Locatie' : 'Location'}>
        <h2 className="font-playfair text-2xl font-bold text-forest-900 mb-3">
          {isNl ? 'Waar?' : 'Where?'}
        </h2>
        <address className="not-italic text-ink-muted mb-5 leading-relaxed">
          <span className="block font-medium text-forest-900">Atelier Wiebe Bloemena</span>
          <span className="block">Jacob Catsstraat 2</span>
          <span className="block">7576 BS Oldenzaal</span>
          <span className="block">Twente, Overijssel, Nederland</span>
        </address>

        <div className="rounded-xl overflow-hidden border border-forest-100 mb-4">
          <iframe
            src={MAPS_EMBED}
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={isNl ? 'Atelier Wiebe Bloemena, Oldenzaal' : 'Studio Wiebe Bloemena, Oldenzaal'}
          />
        </div>

        <a
          href={MAPS_DIRECTIONS}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-forest-900 text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-forest-800 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
          {isNl ? 'Route starten' : 'Get directions'}
        </a>
      </section>
    </div>
  )
}
