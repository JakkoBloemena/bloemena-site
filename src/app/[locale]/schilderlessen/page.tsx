import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

const WHATSAPP_NL = 'https://wa.me/31638036823?text=Hallo%2C%20ik%20wil%20me%20graag%20aanmelden%20voor%20een%20proefles'
const WHATSAPP_EN = 'https://wa.me/31638036823?text=Hello%2C%20I%20have%20a%20question%20about%20the%20painting%20lessons.'
const MAPS_EMBED = 'https://maps.google.com/maps?q=Jacob+Catsstraat+2,+7576+BS+Oldenzaal&output=embed&z=16'
const MAPS_DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=Jacob+Catsstraat+2%2C+7576+BS+Oldenzaal'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params
  const isNl = locale === 'nl'
  return {
    title: isNl
      ? 'Schilderlessen in Oldenzaal, Twente | Wiebe Bloemena'
      : 'Painting lessons in Oldenzaal, Twente | Wiebe Bloemena',
    description: isNl
      ? 'Schilderlessen en tekenlessen in Oldenzaal (Twente). Kleine groepen van maximaal 8 personen, gratis proefles. Dinsdag, woensdag, vrijdag en donderdagavond. Bel: 06-38 03 68 23.'
      : 'Painting and drawing lessons in Oldenzaal, Twente. Small groups, free trial lesson. Tuesday, Wednesday, Friday and Thursday evenings.',
    keywords: [
      'schilderlessen Oldenzaal',
      'schilderlessen Twente',
      'tekenlessen Oldenzaal',
      'schildercursus Twente',
      'schildercursus Oldenzaal',
      'schilderen leren Twente',
      'tekenles Twente',
      'atelier Oldenzaal',
    ],
    openGraph: {
      title: isNl
        ? 'Schilderlessen in Oldenzaal, Twente | Wiebe Bloemena'
        : 'Painting lessons in Oldenzaal, Twente | Wiebe Bloemena',
      description: isNl
        ? 'Schilderlessen en tekenlessen in Oldenzaal (Twente). Kleine groepen, gratis proefles.'
        : 'Painting and drawing lessons in Oldenzaal, Twente. Small groups, free trial lesson.',
    },
  }
}

export default async function LessonsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'schilderlessen')
    .single()

  const rawContent = page ? (locale === 'nl' ? page.content_nl : page.content_en) : null
  // Strip the "Waar?" section from CMS content — it's now rendered below with the map
  const content = rawContent
    ?.replace(/<h2[^>]*>\s*Waar\?\s*<\/h2>\s*(<p>[^<]*<\/p>)?/gi, '')
    .trim() ?? null

  const isNl = locale === 'nl'

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <h1 className="font-playfair text-4xl font-bold text-forest-900 mb-8">
        {isNl ? 'Schilderlessen' : 'Painting lessons'}
      </h1>

      {content && (
        <div
          className="prose prose-stone prose-headings:font-playfair prose-h2:text-forest-900 prose-a:text-ochre-500 max-w-none mb-10"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {/* Contact buttons */}
      <div className="bg-forest-50 border border-forest-100 rounded-xl p-6 mb-12">
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href={isNl ? WHATSAPP_NL : WHATSAPP_EN}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-[#1fb855] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          <a
            href="tel:+31638036823"
            className="flex items-center justify-center gap-2 border border-forest-200 text-forest-900 font-medium text-sm px-5 py-2.5 rounded-lg hover:border-ochre-500 hover:text-ochre-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .9h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 15.92v1z"/>
            </svg>
            {isNl ? 'Bellen' : 'Call'}
          </a>
          <a
            href="mailto:wbloemena@hotmail.com"
            className="flex items-center justify-center gap-2 border border-forest-200 text-forest-900 font-medium text-sm px-5 py-2.5 rounded-lg hover:border-ochre-500 hover:text-ochre-600 transition-colors"
          >
            {isNl ? 'E-mail' : 'Email'}
          </a>
        </div>
      </div>

      {/* Location — moved to bottom for UX, hardcoded here so CMS stays clean */}
      <section aria-label={isNl ? 'Locatie' : 'Location'}>
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
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
          {isNl ? 'Route starten' : 'Get directions'}
        </a>
      </section>

    </div>
  )
}
