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

const { error } = await supabase.from('posts').insert({
  title_nl: 'Nieuw seizoen schilderlessen — nog enkele plekken vrij',
  title_en:  'New painting season starting in September — a few spots still available',
  content_nl: `<p>Na de zomerstop gaan de schilderlessen in september weer van start. Er zijn nog enkele plekken vrij — op de dinsdagochtend, woensdagochtend en vrijdagochtend, en op de donderdagavond.</p>

<p>De lessen zijn voor iedereen die wil schilderen of tekenen, ongeacht niveau. U werkt aan uw eigen werk, in uw eigen tempo, in een gezellige groep van maximaal 8 personen.</p>

<p>Wilt u dit jaar nog een keer komen kijken? Dat kan — er is nog gelegenheid voor een gratis proefles voor het einde van het seizoen.</p>

<p>Stuur een appje voor meer informatie of om een plek te reserveren:<br>
<a href="https://wa.me/31638036823?text=Hallo%2C%20ik%20heb%20interesse%20in%20de%20schilderlessen.">06 – 38 03 68 23</a></p>`,
  content_en: `<p>After the summer break, the painting lessons start again in September. A few spots are still available — on Tuesday, Wednesday and Friday mornings, and Thursday evenings.</p>

<p>The lessons are open to everyone who wants to paint or draw, regardless of level. You work on your own piece, at your own pace, in a friendly group of up to 8 people.</p>

<p>Would you like to come and have a look this year? There is still time for a free trial lesson before the season ends.</p>

<p>Send a WhatsApp message for more information or to reserve a spot:<br>
<a href="https://wa.me/31638036823?text=Hello%2C%20I%20am%20interested%20in%20the%20painting%20lessons.">+31 6 38 03 68 23</a></p>`,
  published_at: new Date().toISOString(),
})

if (error) console.error('Error:', error.message)
else console.log('✓ Post published')
