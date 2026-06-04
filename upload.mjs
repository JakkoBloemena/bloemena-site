// Bulk upload script — uploads all images from ../schilderijen and ../tekeningen
// to Supabase storage and creates records in the paintings table.
//
// Usage:
//   1. Fill in your values in upload-config.env (see upload-config.env.example)
//   2. Run: node upload.mjs
//
// Images with title "1_Iers-bos.jpg" → title becomes "Iers bos" (numbers + underscores stripped)

import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load config
function loadEnv(file) {
  try {
    const lines = readFileSync(join(__dirname, file), 'utf8').split('\n')
    const env = {}
    for (const line of lines) {
      const [key, ...rest] = line.split('=')
      if (key && rest.length) env[key.trim()] = rest.join('=').trim()
    }
    return env
  } catch {
    return {}
  }
}

const config = loadEnv('upload-config.env')
const SUPABASE_URL = config.SUPABASE_URL
const SERVICE_ROLE_KEY = config.SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌  Missing SUPABASE_URL or SERVICE_ROLE_KEY in upload-config.env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG'])

function cleanTitle(filename) {
  const name = basename(filename, extname(filename))
  return name
    .replace(/^\d+[-_]?/, '')     // strip leading numbers
    .replace(/[-_]/g, ' ')        // underscores/dashes → spaces
    .replace(/\s+/g, ' ')
    .trim()
    || name                        // fallback to raw name if empty
}

function getImages(folder) {
  try {
    return readdirSync(folder)
      .filter(f => IMAGE_EXTS.has(extname(f)) && !f.endsWith('_backup'))
      .map(f => join(folder, f))
  } catch {
    return []
  }
}

async function uploadImage(localPath, storagePath) {
  const data = readFileSync(localPath)
  const ext = extname(localPath).toLowerCase()
  const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'

  const { error } = await supabase.storage
    .from('artwork')
    .upload(storagePath, data, { contentType: mime, upsert: true })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('artwork')
    .getPublicUrl(storagePath)

  return publicUrl
}

async function run() {
  const schilderijPaths = getImages(join(__dirname, '..', 'schilderijen'))
  const tekeningPaths   = getImages(join(__dirname, '..', 'tekeningen'))

  console.log(`Found ${schilderijPaths.length} schilderijen, ${tekeningPaths.length} tekeningen`)
  console.log('Starting upload...\n')

  let ok = 0, fail = 0

  async function processFile(localPath, category, index) {
    const filename = basename(localPath)
    const storagePath = `${category}/${filename}`
    const title = cleanTitle(filename)

    try {
      const publicUrl = await uploadImage(localPath, storagePath)

      const { error } = await supabase.from('paintings').insert({
        title_nl: title,
        title_en: title,
        category: category === 'schilderijen' ? 'schilderij' : 'tekening',
        image_url: publicUrl,
        featured: false,
        sort_order: index,
      })

      if (error) throw error

      console.log(`  ✓  ${filename}`)
      ok++
    } catch (err) {
      console.error(`  ✗  ${filename}: ${err.message}`)
      fail++
    }
  }

  for (let i = 0; i < schilderijPaths.length; i++) {
    await processFile(schilderijPaths[i], 'schilderijen', i + 1)
  }

  for (let i = 0; i < tekeningPaths.length; i++) {
    await processFile(tekeningPaths[i], 'tekeningen', i + 1)
  }

  console.log(`\nDone — ${ok} uploaded, ${fail} failed`)
}

run()
