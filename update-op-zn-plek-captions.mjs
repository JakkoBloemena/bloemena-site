// Match uploaded images to their captions from the old site and update the DB.
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zahzutsxucsuzybxsgit.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_KEY) { console.error('Missing SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Original filename → "Title — Description" caption
const CAPTIONS = {
  '3A0EBAEE-03DB-4089-B6AE-B4EC1B6F2DEF.JPG': 'Ierland — Een van de eerste Ierlandschilderijen. Particuliere collectie, Oldenzaal.',
  'IMG_9141.jpg':                               'Angry Forest — Particuliere collectie, Enschede.',
  'IMG-20240319-WA0019.jpg':                    'Artistiek Brandhout — Particulier, Oldenzaal.',
  'IMG-20240317-WA0014.jpg':                    'Klein olieverf — Particulier, Goor.',
  'IMG-20240317-WA0012.jpg':                    'Klein olieverf — Particulier, Goor.',
  'image_50408193.JPG':                         "Tekening uit 'Fauna en Flora' — Particulier, Enschede.",
  'image_50382593.JPG':                         'Wolkenboom — Olieverf. Particulier, Enschede.',
  'Beluga-2.jpg':                               "Beloega's — Boardroom hoofdkantoor Asito adg, Almelo.",
  'Beluga-1.jpg':                               "Beloega's — Boardroom hoofdkantoor Asito adg, Almelo.",
  '3_PHOTO-2022-09-22-11-27-05.jpg':            'Aardperen — Particulier, Utrecht.',
  '20200120_105204.jpg':                        'Veertig jaar niet gezien — Op tv herkend door een vriendin in Oldenzaal.',
  '9b62df5d-0d75-404b-9fbf-4b12b53a9a13.JPG':  "Tekening 'Bergrede' — Particulier, Amsterdam.",
  'c0127b2f-7661-4110-ac38-8a556d824662.JPG':   'Walsstudie — Particulier, Enschede.',
  'IMG_1321.JPG':                               'IJsland voor romantici — Waterschap Vechtstromen.',
  'IMG_1325.jpg':                               'Onrustige nacht — Waterschap Vechtstromen.',
  'IMG_1351.JPG':                               'Studie Verdwenen Cultuur — Particulier, Almere.',
  'IMG_1352.JPG':                               'Middernacht op Videy — Particulier, Almere.',
  'IMG_1353.JPG':                               'Studie Aardperen — Particulier, Almere.',
  'Drostenhuis-Zwolle.jpg':                     "Artistiek Brandhout in het Drostenhuis — Museum het Drostenhuis, Zwolle. Tijdelijke tentoonstelling provincie, 2017.",
  'DSC00641.jpg':                               '2 kleine werken — Museum het Palthehuis, Oldenzaal. Olieverf op karton, 2015.',
  'IMG-20190730-WA0002_resized_20190730_083447482.jpg': 'Orange Submarine — Particulier, Amsterdam.',
  'fotos-wiebe-057.jpg':                        'Grote Tafel — Aangekocht door gemeente Enschede. Te zien achter voormalig burgemeester Den Oudsten.',
  'IMG-20190730-WA00031.jpg':                   'Wandelen in mist — Particulier, Enschede.',
  'Tentoonstelling-Galerie-Achterom-Haaksbergen.jpg': 'Tentoonstelling Galerie Achterom — Haaksbergen, 2018.',
}

// 1. Update photo captions
const { data: photos } = await supabase.from('op_zn_plek_photos').select('id, image_url')
console.log(`Found ${photos.length} photos. Matching captions...\n`)

let updated = 0
for (const photo of photos) {
  const storageName = photo.image_url.split('/').pop()              // "1780606353601-3A0EBAEE...JPG"
  const originalName = storageName.replace(/^\d{13}-/, '')          // "3A0EBAEE...JPG"
  const caption = CAPTIONS[originalName]
  if (!caption) { console.log(`  No caption for: ${originalName}`); continue }

  const { error } = await supabase.from('op_zn_plek_photos').update({ caption }).eq('id', photo.id)
  if (error) { console.log(`  ERROR ${originalName}: ${error.message}`); continue }
  console.log(`  ✓ ${caption.split(' — ')[0]}`)
  updated++
}

// 2. Clear the list from the CMS page (keep just the intro sentence)
const intro = '<p>Een selectie van werken die een plek hebben gevonden in collecties en bij particulieren.</p>'
await supabase.from('pages').update({ content_nl: intro, content_en: intro }).eq('slug', 'op-zn-plek')
console.log('\n✓ CMS text updated (list removed, intro sentence kept)')
console.log(`\nDone! Updated ${updated}/${photos.length} photos.`)
