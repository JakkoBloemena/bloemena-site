// One-time script to upload Op z'n plek photos to Supabase Storage and seed the DB.
// Usage (PowerShell):
//   $env:SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
//   node upload-op-zn-plek.mjs
//
// Get the service role key from: https://supabase.com/dashboard/project/zahzutsxucsuzybxsgit/settings/api

import { createClient } from '@supabase/supabase-js'
import { readdir, readFile } from 'fs/promises'
import { join, extname, basename } from 'path'

const SUPABASE_URL = 'https://zahzutsxucsuzybxsgit.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY. Set it before running:')
  console.error('  $env:SUPABASE_SERVICE_ROLE_KEY="your_key_here"')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const IMAGES_DIR = 'C:\\bloemena\\op-zn-plek'
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG'])

const files = (await readdir(IMAGES_DIR))
  .filter(f => IMAGE_EXTS.has(extname(f)))

console.log(`Found ${files.length} images to upload.\n`)

let uploaded = 0
for (const filename of files) {
  const filePath = join(IMAGES_DIR, filename)
  const ext = extname(filename).toLowerCase().replace('.', '')
  const storagePath = `op-zn-plek/${Date.now()}-${basename(filename)}`

  process.stdout.write(`Uploading ${filename}... `)

  const buffer = await readFile(filePath)
  const { error: uploadErr } = await supabase.storage
    .from('artwork')
    .upload(storagePath, buffer, { contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`, upsert: false })

  if (uploadErr) {
    console.log(`FAILED: ${uploadErr.message}`)
    continue
  }

  const { data: { publicUrl } } = supabase.storage.from('artwork').getPublicUrl(storagePath)

  const { error: dbErr } = await supabase.from('op_zn_plek_photos').insert({ image_url: publicUrl })
  if (dbErr) {
    console.log(`DB insert failed: ${dbErr.message}`)
    continue
  }

  console.log('OK')
  uploaded++
}

console.log(`\nDone! Uploaded ${uploaded}/${files.length} photos.`)
