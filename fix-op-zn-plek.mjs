// Fix corrupted image URLs (word-wrap artifacts from SQL paste) and set captions.
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zahzutsxucsuzybxsgit.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SERVICE_KEY) { console.error('Missing SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }
const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

const CAPTIONS = {
  '20200120_105204.jpg':                        'Veertig jaar niet gezien — Op tv herkend door een vriendin in Oldenzaal.',
  '3A0EBAEE-03DB-4089-B6AE-B4EC1B6F2DEF.JPG':  'Ierland — Een van de eerste Ierlandschilderijen. Particuliere collectie, Oldenzaal.',
  '3_PHOTO-2022-09-22-11-27-05.jpg':            'Aardperen — Particulier, Utrecht.',
  '9b62df5d-0d75-404b-9fbf-4b12b53a9a13.JPG':  "Tekening 'Bergrede' — Particulier, Amsterdam.",
  'Beluga-1.jpg':                               "Beloega's — Boardroom hoofdkantoor Asito adg, Almelo.",
  'Beluga-2.jpg':                               "Beloega's — Boardroom hoofdkantoor Asito adg, Almelo.",
  'c0127b2f-7661-4110-ac38-8a556d824662.JPG':   'Walsstudie — Particulier, Enschede.',
  'Drostenhuis-Zwolle.jpg':                     "Artistiek Brandhout in het Drostenhuis — Museum het Drostenhuis, Zwolle. Tijdelijke tentoonstelling provincie, 2017.",
  'DSC00641.jpg':                               '2 kleine werken — Museum het Palthehuis, Oldenzaal. Olieverf op karton, 2015.',
  'fotos-wiebe-057.jpg':                        'Grote Tafel — Aangekocht door gemeente Enschede. Te zien achter voormalig burgemeester Den Oudsten.',
  'image_50382593.JPG':                         'Wolkenboom — Olieverf. Particulier, Enschede.',
  'image_50408193.JPG':                         "Tekening uit 'Fauna en Flora' — Particulier, Enschede.",
  'IMG-20190730-WA0002_resized_20190730_083447482.jpg': 'Orange Submarine — Particulier, Amsterdam.',
  'IMG-20190730-WA00031.jpg':                   'Wandelen in mist — Particulier, Enschede.',
  'IMG-20240317-WA0012.jpg':                    'Klein olieverf — Particulier, Goor.',
  'IMG-20240317-WA0014.jpg':                    'Klein olieverf — Particulier, Goor.',
  'IMG-20240319-WA0019.jpg':                    'Artistiek Brandhout — Particulier, Oldenzaal.',
  'IMG_1321.JPG':                               'IJsland voor romantici — Waterschap Vechtstromen.',
  'IMG_1325.jpg':                               'Onrustige nacht — Waterschap Vechtstromen.',
  'IMG_1351.JPG':                               'Studie Verdwenen Cultuur — Particulier, Almere.',
  'IMG_1352.JPG':                               'Middernacht op Videy — Particulier, Almere.',
  'IMG_1353.JPG':                               'Studie Aardperen — Particulier, Almere.',
  'IMG_9141.jpg':                               'Angry Forest — Particuliere collectie, Enschede.',
  'Tentoonstelling-Galerie-Achterom-Haaksbergen.jpg': 'Tentoonstelling Galerie Achterom — Haaksbergen, 2018.',
}

const { data: photos } = await supabase.from('op_zn_plek_photos').select('id, image_url')

let fixed = 0
for (const photo of photos) {
  // Strip any \r, \n, or leading spaces that got inserted by SQL editor word-wrap
  const cleanUrl = photo.image_url.replace(/[\r\n]+\s*/g, '')
  const originalName = cleanUrl.split('/').pop().replace(/^\d{13}-/, '')
  const caption = CAPTIONS[originalName]

  const { error } = await supabase
    .from('op_zn_plek_photos')
    .update({ image_url: cleanUrl, caption: caption ?? null })
    .eq('id', photo.id)

  if (error) { console.log(`ERROR ${originalName}: ${error.message}`); continue }
  console.log(`✓ ${originalName} → ${caption ? caption.split(' — ')[0] : '(no caption)'}`)
  fixed++
}

// Clear the list from the CMS page (keep just the intro sentence)
const intro = '<p>Een selectie van werken die een plek hebben gevonden in collecties en bij particulieren.</p>'
await supabase.from('pages').update({ content_nl: intro, content_en: intro }).eq('slug', 'op-zn-plek')

console.log(`\nDone! Fixed ${fixed}/${photos.length} photos + updated CMS text.`)
