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

function clean(s) {
  return (s || '').replace(/&#13;/g, '\n').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").trim()
}

function parseDescription(raw) {
  const text = clean(raw)
  if (!text) return {}

  // Year
  const yearM = text.match(/\b(19\d{2}|20\d{2})\b/)
  const year = yearM ? parseInt(yearM[1]) : null

  // Dimensions: e.g. "80 x 100 cm" or "80x100"
  const dimM = text.match(/(\d+(?:[,.]\d+)?)\s*[xX×]\s*(\d+(?:[,.]\d+)?)\s*cm/)
  const width_cm = dimM ? parseFloat(dimM[1].replace(',', '.')) : null
  const height_cm = dimM ? parseFloat(dimM[2].replace(',', '.')) : null

  // Price: €1850,- or 2100 euro or 950,- euro
  const priceM = text.match(/(?:€\s*|euro\s+)(\d[\d.,]*)|(\d[\d.,]*)\s*(?:,-\s*)?euro/i)
  let price_eur = null
  const for_sale = !!priceM
  if (priceM) {
    const raw = (priceM[1] || priceM[2]).replace('.', '').replace(',', '.')
    price_eur = parseFloat(raw)
    if (isNaN(price_eur)) price_eur = null
  }

  // Collection info
  let collection_info = null
  const collM = text.match(/[Pp]articuliere[^.\n€]*|[Oo]pdracht[^.\n€]*collectie[^.\n€]*/i)
  if (collM && !for_sale) collection_info = collM[0].trim().replace(/[,.]$/, '')
  // If for_sale but also mentions collection (sold work)
  if (!collection_info) {
    const c2 = text.match(/[Pp]articuliere collectie[^.\n€]*/i)
    if (c2) collection_info = c2[0].trim().replace(/[,.]$/, '')
  }

  // Medium
  const medPatterns = [
    /olieverf op linnen/i, /olieverf op doek/i, /olieverf op paneel/i,
    /acryl op linnen/i, /acryl op doek/i,
    /inkt en waterverf op papier/i, /inkt en kleurpotlood op papier/i,
    /ecoline op papier/i, /inkt op papier/i, /gewassen inkt op papier/i,
    /vetkrijt op papier/i, /potlood op papier/i, /waterverf op papier/i,
  ]
  let medium = null
  for (const p of medPatterns) {
    const m = text.match(p)
    if (m) { medium = m[0]; break }
  }

  // Title: first non-empty line before metadata, cleaned
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  // Find first line that looks like a title (not medium/year/dims/price line)
  let title = null
  for (const line of lines) {
    if (/^\d+\s*[xX×]/.test(line)) continue   // dimensions line
    if (/^\d{4}$/.test(line)) continue          // year only
    if (/^[€\d]/.test(line)) continue           // price line
    if (/olieverf|acryl|inkt|ecoline|vetkrijt|opdracht\s+voor|particuliere/i.test(line) && !line.includes(',')) continue
    title = line.replace(/[,.]$/, '').trim()
    break
  }

  return { title, year, medium, width_cm, height_cm, for_sale, price_eur, collection_info }
}

function normalizeFilename(name) {
  return name.toLowerCase().replace(/\.(jpg|jpeg|png|webp|JPG|JPEG)$/i, '').replace(/[^a-z0-9]/g, '')
}

async function run() {
  const ngg = JSON.parse(readFileSync('C:/bloemena/ngg-pictures.json', 'utf8'))

  const schilderijen = ngg.filter(p => p.gallery_slug === 'schilderijen')
  const tekeningen   = ngg.filter(p => p.gallery_slug === 'Tekeningen')

  console.log(`Processing ${schilderijen.length} schilderijen, ${tekeningen.length} tekeningen`)

  // Load all paintings from DB
  const { data: dbAll } = await supabase.from('paintings').select('id, title_nl, image_url, category')
  if (!dbAll) { console.error('Could not load paintings'); return }

  const dbMap = {}
  for (const p of dbAll) {
    const fn = p.image_url.split('/').pop()
    dbMap[normalizeFilename(fn)] = p
  }

  let updated = 0, skipped = 0, noMatch = 0

  async function processEntry(entry, expectedCategory) {
    const norm = normalizeFilename(entry.filename)
    const dbRecord = dbMap[norm]
    if (!dbRecord) { noMatch++; return }
    if (dbRecord.category !== expectedCategory) return

    const rawDesc = clean(entry.description)
    const altText = clean(entry.alttext)
    const parsed = rawDesc ? parseDescription(rawDesc) : {}

    // Title: prefer description-parsed title, then alttext if meaningful, then keep existing
    let title = parsed.title
    if (!title && altText && !/^\d+$/.test(altText) && altText !== entry.filename.replace(/\.[^.]+$/, '')) {
      title = altText
    }

    // Build update
    const update = {}
    if (title) { update.title_nl = title; update.title_en = title }
    if (parsed.year) update.year = parsed.year
    if (parsed.medium) { update.medium_nl = parsed.medium; update.medium_en = parsed.medium }
    if (parsed.width_cm) update.width_cm = parsed.width_cm
    if (parsed.height_cm) update.height_cm = parsed.height_cm
    update.for_sale = parsed.for_sale ?? false
    if (parsed.price_eur) update.price_eur = parsed.price_eur
    if (parsed.collection_info) update.collection_info = parsed.collection_info
    // Sort order from NGG
    if (entry.sortorder != null) update.sort_order = parseInt(entry.sortorder) || 999

    if (Object.keys(update).length <= 2) { skipped++; return } // only for_sale set = skip

    const { error } = await supabase.from('paintings').update(update).eq('id', dbRecord.id)
    if (error) {
      console.log(`  ✗ ${entry.filename}: ${error.message}`)
      skipped++
    } else {
      console.log(`  ✓ [${expectedCategory}] ${entry.filename} → "${title||'?'}" ${parsed.year||''} ${parsed.medium||''} ${parsed.width_cm&&parsed.height_cm?parsed.width_cm+'×'+parsed.height_cm+'cm':''} ${parsed.for_sale?'€'+parsed.price_eur:parsed.collection_info||''}`)
      updated++
    }
  }

  for (const entry of schilderijen) await processEntry(entry, 'schilderij')
  for (const entry of tekeningen)   await processEntry(entry, 'tekening')

  console.log(`\nDone — ${updated} updated, ${skipped} skipped, ${noMatch} no DB match`)
}

run()
