/**
 * Comprehensive data update script:
 * 1. Update tekeningen with captions from old site (title, medium, dimensions, year, price/collection)
 * 2. Update schilderijen with WP media captions where available
 * 3. Replace/add all 50 news posts from WordPress XML
 * 4. Update pages (schilderlessen, tentoonstellingen) with richer XML content
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv(file) {
  try {
    const lines = readFileSync(join(__dirname, file), 'utf8').split('\n')
    const env = {}
    for (const line of lines) {
      const [key, ...rest] = line.split('=')
      if (key && rest.length) env[key.trim()] = rest.join('=').trim()
    }
    return env
  } catch { return {} }
}

const config = loadEnv('upload-config.env')
const supabase = createClient(config.SUPABASE_URL, config.SERVICE_ROLE_KEY, { auth: { persistSession: false } })

// ─── CAPTION PARSER ─────────────────────────────────────────────────────────

function parseCaption(filename, description) {
  if (!description) return null
  const lines = description.split('\n').map(l => l.trim()).filter(Boolean)
  if (!lines.length) return null

  const full = description.replace(/\n/g, ' ')

  // Extract year (4-digit 19xx or 20xx)
  const yearMatch = full.match(/\b(19\d{2}|20\d{2})\b/)
  const year = yearMatch ? parseInt(yearMatch[1]) : null

  // Extract price
  const priceMatch = full.match(/€\s*([\d.,]+)/)
  const for_sale = !!priceMatch
  let price_eur = null
  if (priceMatch) {
    price_eur = parseFloat(priceMatch[1].replace('.', '').replace(',', '.'))
  }

  // Extract dimensions
  const dimMatch = full.match(/(\d+[,.]?\d*)\s*[xX×]\s*(\d+[,.]?\d*)\s*cm/)
  let width_cm = null, height_cm = null
  if (dimMatch) {
    width_cm = parseFloat(dimMatch[1].replace(',', '.'))
    height_cm = parseFloat(dimMatch[2].replace(',', '.'))
  }

  // Collection info (anything with Particuliere or collection reference, excluding price)
  let collection_info = null
  if (!for_sale) {
    const collMatch = full.match(/(Particuliere collectie[^€\n]*|[Cc]ollectie[^€\n]*)/i)
    if (collMatch) collection_info = collMatch[1].trim().replace(/[,.]$/, '')
  } else {
    // Still might have collection on non-sale items - check if some are sold/in collection
    const collMatch = full.match(/(Particuliere collectie[^€\n]*)/i)
    if (collMatch) collection_info = collMatch[1].trim().replace(/[,.]$/, '')
  }

  // Extract medium — look for art technique keywords
  const mediumPatterns = [
    /inkt en waterverf op papier/i,
    /inkt en kleurpotlood op papier/i,
    /inkt[,\s]+ecoline en potlood op papier/i,
    /ecoline en potlood op papier/i,
    /ecoline en inkt op papier/i,
    /ecoline op papier/i,
    /inkt op papier/i,
    /gewassen inkt op papier/i,
    /vetkrijt op papier/i,
    /olieverf op linnen/i,
    /olieverf op paneel/i,
    /acryl op doek/i,
    /acryl op linnen/i,
    /potlood op papier/i,
    /waterverf op papier/i,
    /kleurpotlood op papier/i,
  ]
  let medium = null
  for (const p of mediumPatterns) {
    const m = full.match(p)
    if (m) { medium = m[0]; break }
  }

  // Title: first meaningful line, cleaned up
  let title = lines[0].replace(/,$/, '').trim()
  // If title is just the filename formatted, skip
  if (!title || title.length < 2) title = null

  return { title, year, medium, width_cm, height_cm, for_sale, price_eur, collection_info }
}

function normalizeFilename(name) {
  return name.toLowerCase()
    .replace(/\.(jpg|jpeg|png|webp|JPG|JPEG)$/i, '')
    .replace(/[^a-z0-9]/g, '')
}

// ─── 1. UPDATE TEKENINGEN ────────────────────────────────────────────────────

async function updateTekeningen() {
  console.log('\n=== Updating tekeningen captions ===')
  const captions = JSON.parse(readFileSync('C:/bloemena/tekeningen-captions.json', 'utf8'))

  const { data: dbTekeningen } = await supabase
    .from('paintings')
    .select('id, title_nl, image_url, category')
    .eq('category', 'tekening')

  if (!dbTekeningen) { console.log('No tekeningen in DB'); return }

  // Build lookup: normalized filename → db record
  const dbMap = {}
  for (const p of dbTekeningen) {
    const fn = p.image_url.split('/').pop()
    dbMap[normalizeFilename(fn)] = p
  }

  let updated = 0, skipped = 0
  for (const cap of captions) {
    if (!cap.d) { skipped++; continue }
    const norm = normalizeFilename(cap.fn)
    const dbRecord = dbMap[norm]
    if (!dbRecord) { console.log(`  ? No match for: ${cap.fn}`); skipped++; continue }

    const parsed = parseCaption(cap.fn, cap.d)
    if (!parsed) { skipped++; continue }

    const update = {}
    if (parsed.title && parsed.title !== cap.fn) {
      update.title_nl = parsed.title
      update.title_en = parsed.title
    }
    if (parsed.year) update.year = parsed.year
    if (parsed.medium) { update.medium_nl = parsed.medium; update.medium_en = parsed.medium }
    if (parsed.width_cm) update.width_cm = parsed.width_cm
    if (parsed.height_cm) update.height_cm = parsed.height_cm
    // for_sale/price/collection_info added only if columns exist (run ALTER TABLE first)
    if (SALE_COLS_EXIST) {
      update.for_sale = parsed.for_sale
      if (parsed.price_eur) update.price_eur = parsed.price_eur
      if (parsed.collection_info) update.collection_info = parsed.collection_info
    }

    if (Object.keys(update).length === 0) { skipped++; continue }

    const { error } = await supabase.from('paintings').update(update).eq('id', dbRecord.id)
    if (error) { console.log(`  ✗ ${cap.fn}: ${error.message}`); skipped++ }
    else { console.log(`  ✓ ${cap.fn} → "${parsed.title||'?'}" ${parsed.year||''} ${parsed.for_sale?'€'+parsed.price_eur:parsed.collection_info||''}`); updated++ }
  }
  console.log(`Tekeningen: ${updated} updated, ${skipped} skipped`)
}

// ─── 2. UPDATE SCHILDERIJEN (WP media captions) ──────────────────────────────

async function updateSchilderijen() {
  console.log('\n=== Updating schilderijen from WP media captions ===')
  const media = [
    ...JSON.parse(readFileSync('C:/bloemena/wp-media-1.json', 'utf8')),
    ...JSON.parse(readFileSync('C:/bloemena/wp-media-2.json', 'utf8')),
    ...JSON.parse(readFileSync('C:/bloemena/wp-media-3.json', 'utf8')),
  ].filter(m => m.caption && m.caption.length > 5 && !m.caption.includes('http'))

  const { data: dbPaintings } = await supabase
    .from('paintings')
    .select('id, title_nl, image_url, category')
    .eq('category', 'schilderij')

  if (!dbPaintings) { console.log('No schilderijen in DB'); return }

  const dbMap = {}
  for (const p of dbPaintings) {
    const fn = p.image_url.split('/').pop()
    dbMap[normalizeFilename(fn)] = p
  }

  let updated = 0
  for (const m of media) {
    const norm = normalizeFilename(m.file)
    const dbRecord = dbMap[norm]
    if (!dbRecord) { console.log(`  ? No match for: ${m.file}`); continue }

    const parsed = parseCaption(m.file, m.caption)
    if (!parsed) continue

    const update = {}
    if (parsed.title) { update.title_nl = parsed.title; update.title_en = parsed.title }
    if (parsed.year) update.year = parsed.year
    if (parsed.medium) { update.medium_nl = parsed.medium; update.medium_en = parsed.medium }
    if (parsed.width_cm) update.width_cm = parsed.width_cm
    if (parsed.height_cm) update.height_cm = parsed.height_cm
    if (SALE_COLS_EXIST) {
      update.for_sale = parsed.for_sale
      if (parsed.price_eur) update.price_eur = parsed.price_eur
      if (parsed.collection_info) update.collection_info = parsed.collection_info
    }

    const { error } = await supabase.from('paintings').update(update).eq('id', dbRecord.id)
    if (error) console.log(`  ✗ ${m.file}: ${error.message}`)
    else { console.log(`  ✓ ${m.file} → "${parsed.title||'?'}" ${parsed.year||''}`); updated++ }
  }
  console.log(`Schilderijen: ${updated} updated`)
}

// ─── 3. IMPORT ALL NEWS POSTS ────────────────────────────────────────────────

function cleanWpContent(html) {
  if (!html) return ''
  return html
    .replace(/<!-- wp:[^>]*-->/g, '')
    .replace(/<!-- \/wp:[^>]*-->/g, '')
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '') // remove broken image figures
    .replace(/<img[^>]*src="http:\/\/www\.bloemena\.com[^"]*"[^>]*>/gi, '') // remove old img tags
    .replace(/&nbsp;/g, ' ')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function importNews() {
  console.log('\n=== Importing news posts from XML ===')
  const news = JSON.parse(readFileSync('C:/bloemena/parsed-news.json', 'utf8'))

  // Delete all existing posts first to avoid duplicates
  await supabase.from('posts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  console.log('Cleared existing posts')

  let ok = 0, fail = 0
  for (const post of news) {
    const title = post.title?.replace(/&#039;/g, "'").replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').trim() || 'Untitled'
    const content = cleanWpContent(post.content || '')

    const { error } = await supabase.from('posts').insert({
      title_nl: title,
      title_en: title,
      content_nl: content || `<p>${title}</p>`,
      content_en: content || `<p>${title}</p>`,
      published_at: post.date || new Date().toISOString(),
    })
    if (error) { console.log(`  ✗ ${title}: ${error.message}`); fail++ }
    else { console.log(`  ✓ [${(post.date||'').slice(0,10)}] ${title.slice(0,60)}`); ok++ }
  }
  console.log(`News: ${ok} imported, ${fail} failed`)
}

// ─── 4. UPDATE PAGES ────────────────────────────────────────────────────────

async function updatePages() {
  console.log('\n=== Updating pages from XML ===')

  const pages = [
    {
      slug: 'schilderlessen',
      content_nl: `<p>Leerzame en gezellige schilderles met individuele begeleiding in groepen tot 8 personen. U kunt deelnemen aan alle lessen.</p>
<h2>Wanneer?</h2>
<ul>
<li>Dinsdagochtend 9.30–12.30 uur</li>
<li>Woensdagochtend 9.30–12.30 uur</li>
<li>Vrijdagochtend 9.30–12.30 uur</li>
<li>Donderdagavond 19.45–22.15 uur</li>
</ul>
<h2>Kosten</h2>
<p>€ 133,– voor 7 lessen (€ 19,– per les, inclusief koffie of thee). Tussentijds instappen mogelijk, voor alle niveaus. Eigen materiaal meenemen. Tekenmateriaal aanwezig.</p>
<h2>Waar?</h2>
<p>Jacob Catsstraat 2, 7576 BS, Oldenzaal</p>
<h2>Contact</h2>
<p>Telefoon: <a href="tel:+31638036823">06-38036823</a><br>
E-mail: <a href="mailto:wbloemena@hotmail.com">wbloemena@hotmail.com</a></p>
<p>Gratis proefles!</p>`,
      content_en: `<p>Enjoyable painting lessons with individual guidance in groups of up to 8 people. You can join any lesson.</p>
<h2>Schedule</h2>
<ul>
<li>Tuesday morning 9.30–12.30</li>
<li>Wednesday morning 9.30–12.30</li>
<li>Friday morning 9.30–12.30</li>
<li>Thursday evening 19.45–22.15</li>
</ul>
<h2>Costs</h2>
<p>€ 133 for 7 lessons (€ 19 per lesson, including coffee or tea). Joining mid-term possible, all levels welcome. Bring your own materials. Drawing materials available.</p>
<h2>Location</h2>
<p>Jacob Catsstraat 2, 7576 BS, Oldenzaal, The Netherlands</p>
<h2>Contact</h2>
<p>Phone: <a href="tel:+31638036823">+31 6 38036823</a><br>
Email: <a href="mailto:wbloemena@hotmail.com">wbloemena@hotmail.com</a></p>
<p>Free trial lesson!</p>`
    },
    {
      slug: 'tentoonstellingen',
      content_nl: `<ul>
<li><strong>2024</strong> — Tentoonstelling Kunstenlandschap. Arendsmanhuis, Enschede. Curator: Paul Hajenius.</li>
<li><strong>2018</strong> — Medisch Spectrum Twente, Enschede</li>
<li><strong>2018</strong> — Kunsttafelenproject, Rijksmuseum Enschede</li>
<li><strong>2018</strong> — Galerie Achterom, Haaksbergen <em>(solo)</em></li>
<li><strong>2017</strong> — Drostenhuis, Stedelijk Museum Zwolle</li>
<li><strong>2016</strong> — 11 Jahre Bentheimeratelier, Bad Bentheim, Duitsland</li>
<li><strong>2015</strong> — ARTOverijssel, Museum het Palthe-Huis, Oldenzaal</li>
<li><strong>2015</strong> — Museum het Palthe-Huis, Oldenzaal</li>
<li><strong>2015</strong> — Westkunst, Amsterdam</li>
<li><strong>2014</strong> — Met Andere Ogen, Oranjerie Kasteel Twickel, Delden</li>
<li><strong>2013</strong> — Vier schilders in de Kloostergangen, Oud Stadhuis Haarlem</li>
<li><strong>2013</strong> — Galerie Felice, Ootmarsum</li>
<li><strong>2012</strong> — Bentheimer Atelier, Bad Bentheim <em>(solo)</em></li>
<li><strong>2012</strong> — Grote Kerk, Alkmaar</li>
<li><strong>2011</strong> — Afscheidstentoonstelling Galerie Nijenhove, Diepenheim</li>
<li><strong>2010</strong> — Jan Knigge, Hengelo <em>(solo)</em></li>
<li><strong>2010</strong> — Museum het Palthehuis, Oldenzaal</li>
<li><strong>2009</strong> — Stedelijk Museum Dordrecht — 25 jaar finalisten Wim Izaks Prijs</li>
<li><strong>2009</strong> — Jansen &amp; Kooij, Warnsveld</li>
<li><strong>2009</strong> — Galerie Billing Bild, Baar, Zwitserland <em>(solo)</em></li>
<li><strong>2009</strong> — Automatic Bar, Venetië, Italië</li>
<li><strong>2008</strong> — De Witte Kamer, Delden <em>(solo)</em></li>
<li><strong>2008</strong> — Salade Expociones, Capileira, Spanje</li>
<li><strong>2007</strong> — Listasummar, Hafnarfjordur, IJsland</li>
<li><strong>2006</strong> — Rabobank, Goor</li>
<li><strong>2006</strong> — Galerie Billing Bild, Baar, Zwitserland <em>(solo)</em></li>
<li><strong>2005</strong> — La Minoterie, Nay, Frankrijk</li>
<li><strong>2005</strong> — Dordrechts Museum, Dordrecht</li>
<li><strong>2005</strong> — Jansen &amp; Kooy, Warnsveld</li>
<li><strong>2004</strong> — Schapen Hoeden, Universiteit Twente <em>(solo)</em></li>
<li><strong>2003</strong> — Fauna en Flora, Hengelo</li>
<li><strong>2002</strong> — Grafiektentoonstelling, Provincie Overijssel</li>
<li><strong>2002</strong> — Galerie Jansen &amp; Kooy, Warnsveld</li>
<li><strong>2002</strong> — Bornse Kunststichting, Borne <em>(solo)</em></li>
<li><strong>2000</strong> — Galerie PI, Kopenhagen</li>
<li><strong>1999</strong> — Galerie Jansen &amp; Kooy, Warnsveld <em>(solo)</em></li>
<li><strong>1999</strong> — Hof88, Almelo</li>
<li><strong>1998</strong> — Galerie Deiglan, Akureyri, IJsland</li>
<li><strong>1997</strong> — Art Fair, Stockholm, Zweden</li>
<li><strong>1997</strong> — Jansen &amp; Kooy, Amsterdam</li>
<li><strong>1997</strong> — Art Plenary, Varena, Litouwen</li>
<li><strong>1997</strong> — K.C.O., Zwolle</li>
<li><strong>1997</strong> — Kunstrai, Amsterdam</li>
<li><strong>1997</strong> — Galerie Dijkzigt, Rotterdam <em>(solo)</em></li>
<li><strong>1996</strong> — Art Multiple, Düsseldorf, Duitsland</li>
<li><strong>1995</strong> — Kunstvereniging Diepenheim</li>
<li><strong>1995</strong> — Museum het Palthehuis, Oldenzaal</li>
<li><strong>1994</strong> — Schnittpunkt, Gronau, Duitsland</li>
<li><strong>1994</strong> — H.C.A.K., Den Haag</li>
<li><strong>1993</strong> — Provinciehuis, Zwolle <em>(solo)</em></li>
<li><strong>1993</strong> — De Kunstzaal, Hengelo</li>
<li><strong>1989</strong> — Drehscheibe, Nordhorn, Duitsland</li>
<li><strong>1988</strong> — Noordkunst, Zuidlaren</li>
<li><strong>1987</strong> — Kunstuitkijk, Deventer</li>
<li><strong>1986</strong> — De Kunstzaal, Hengelo</li>
<li><strong>1986</strong> — Bergkerk, Deventer</li>
</ul>
<p><em>* Solo tentoonstelling</em></p>`,
      content_en: ''
    },
  ]

  for (const p of pages) {
    const { error } = await supabase.from('pages').upsert(
      { slug: p.slug, content_nl: p.content_nl, content_en: p.content_en || p.content_nl, updated_at: new Date().toISOString() },
      { onConflict: 'slug' }
    )
    if (error) console.log(`  ✗ ${p.slug}: ${error.message}`)
    else console.log(`  ✓ ${p.slug}`)
  }
}

// ─── RUN ALL ─────────────────────────────────────────────────────────────────

let SALE_COLS_EXIST = false

async function run() {
  // Check if for_sale column exists
  const { error: colCheck } = await supabase.from('paintings').select('for_sale').limit(1)
  SALE_COLS_EXIST = !colCheck
  console.log(`Sale columns exist: ${SALE_COLS_EXIST}`)
  if (!SALE_COLS_EXIST) {
    console.log('Run this SQL in Supabase first, then re-run this script:\n')
    console.log('  ALTER TABLE paintings ADD COLUMN for_sale boolean NOT NULL DEFAULT false,')
    console.log('  ADD COLUMN price_eur numeric, ADD COLUMN collection_info text;\n')
  }

  await updateTekeningen()
  await updateSchilderijen()
  await importNews()
  await updatePages()
  console.log('\n✓ All done.')
}

run()
