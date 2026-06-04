// Strip year/medium/dimensions from painting titles where they leaked in
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
function loadEnv(f) {
  const lines = readFileSync(join(__dirname, f), 'utf8').split('\n')
  const env = {}
  for (const l of lines) { const [k,...v]=l.split('='); if(k&&v.length) env[k.trim()]=v.join('=').trim() }
  return env
}
const config = loadEnv('upload-config.env')
const supabase = createClient(config.SUPABASE_URL, config.SERVICE_ROLE_KEY, { auth: { persistSession: false } })

function cleanTitle(title) {
  if (!title) return title
  // Remove trailing ", 1994, olieverf op linnen, 70 x 110 cm" etc.
  // Strip from the first ", YEAR" or ". YEAR" onward
  let t = title
    .replace(/,\s*(19\d{2}|20\d{2})\b.*$/i, '')   // ", 1994..."
    .replace(/\.\s*(19\d{2}|20\d{2})\b.*$/i, '')   // ". 2019..."
    .replace(/\s+(19\d{2}|20\d{2})\b.*$/i, '')     // " 2019..."
    // Also strip trailing medium/dims if no year was caught
    .replace(/,\s*olieverf.*$/i, '')
    .replace(/,\s*acryl.*$/i, '')
    .replace(/,\s*inkt.*$/i, '')
    .replace(/,\s*ecoline.*$/i, '')
    .replace(/,\s*\d+\s*[xX×]\s*\d+.*$/i, '')
    .replace(/[,.\s]+$/, '')
    .trim()
  return t || title
}

async function run() {
  const { data: paintings } = await supabase
    .from('paintings')
    .select('id, title_nl')

  if (!paintings) { console.error('Could not load paintings'); return }

  let fixed = 0
  for (const p of paintings) {
    const cleaned = cleanTitle(p.title_nl)
    if (cleaned !== p.title_nl) {
      const { error } = await supabase.from('paintings')
        .update({ title_nl: cleaned, title_en: cleaned })
        .eq('id', p.id)
      if (error) console.log(`✗ ${p.title_nl}: ${error.message}`)
      else { console.log(`✓ "${p.title_nl}" → "${cleaned}"`); fixed++ }
    }
  }
  console.log(`\nFixed ${fixed} titles`)
}

run()
