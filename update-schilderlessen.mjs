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

const content_nl = `<p>Schilderen leer je door te doen — in een gezellige omgeving met kleine groepen en veel persoonlijke aandacht. Elke deelnemer werkt aan zijn of haar eigen werk, in eigen tempo, met begeleiding waar dat nodig is.</p>

<p>De lessen zijn geschikt voor iedereen die wil leren schilderen of tekenen, of u nu voor het eerst een penseel vasthoudt of al enige ervaring heeft. Tussentijds instappen is altijd mogelijk.</p>

<h2>Wanneer?</h2>
<ul>
<li>Dinsdagochtend 9.30 – 12.30 uur</li>
<li>Woensdagochtend 9.30 – 12.30 uur</li>
<li>Vrijdagochtend 9.30 – 12.30 uur</li>
<li>Donderdagavond 19.45 – 22.15 uur</li>
</ul>

<h2>Kosten</h2>
<p>€ 133,– voor 7 lessen (€ 19,– per les, inclusief koffie of thee).</p>

<h2>Gratis proefles</h2>
<p>Wilt u eerst een keer vrijblijvend komen kijken? Dat kan altijd — de eerste les is gratis.</p>

<h2>Waar?</h2>
<p>Jacob Catsstraat 2, 7576 BS Oldenzaal</p>`

const content_en = `<p>Painting is learned by doing — in a relaxed, friendly setting with small groups and plenty of personal attention. Each participant works on their own piece, at their own pace, with guidance where needed.</p>

<p>The lessons are suitable for anyone who wants to learn to paint or draw, whether you have never held a brush before or already have some experience. Joining mid-term is always possible.</p>

<h2>Schedule</h2>
<ul>
<li>Tuesday morning 9.30 – 12.30</li>
<li>Wednesday morning 9.30 – 12.30</li>
<li>Friday morning 9.30 – 12.30</li>
<li>Thursday evening 19.45 – 22.15</li>
</ul>

<h2>Costs</h2>
<p>€ 133 for 7 lessons (€ 19 per lesson, including coffee or tea).</p>

<h2>Free trial lesson</h2>
<p>Would you like to come and have a look first? You are always welcome — the first lesson is free.</p>

<h2>Location</h2>
<p>Jacob Catsstraat 2, 7576 BS Oldenzaal, Netherlands</p>`

const { error } = await supabase.from('pages')
  .upsert({ slug: 'schilderlessen', content_nl, content_en, updated_at: new Date().toISOString() }, { onConflict: 'slug' })

if (error) console.error('Error:', error.message)
else console.log('✓ Schilderlessen page updated')
