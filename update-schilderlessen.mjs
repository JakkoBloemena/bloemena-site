// Update schilderlessen CMS content
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zahzutsxucsuzybxsgit.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const content_nl = `<p>Schilderen leer je door te doen — in een gezellige omgeving met kleine groepen en veel persoonlijke aandacht. Elke deelnemer werkt aan zijn of haar eigen werk, in eigen tempo, met begeleiding waar dat nodig is.</p>

<p>De lessen zijn geschikt voor iedereen die wil leren schilderen of tekenen, of u nu voor het eerst een penseel vasthoudt of al enige ervaring heeft. Tussentijds instappen is altijd mogelijk.</p>

<h2>Wanneer?</h2>
<ul>
<li>Dinsdagochtend 9.30 – 12.30 uur</li>
<li>Woensdagochtend 9.30 – 12.30 uur</li>
<li>Donderdagavond 19.45 – 22.15 uur</li>
<li>Vrijdagochtend 9.30 – 12.30 uur</li>
</ul>

<h2>Kosten</h2>
<p>€ 133,– voor 7 lessen (€ 19,– per les, inclusief koffie of thee).</p>
<p>Tussentijds instappen mogelijk, voor alle niveau's.</p>

<h2>Gratis proefles</h2>
<p>Wilt u eerst een keer vrijblijvend komen kijken? Dat kan altijd — de eerste les is gratis.</p>
<p>Tijdens de proefles zorg ik ervoor dat alles aanwezig is om mee te kunnen doen.</p>

<h2>Materiaal</h2>
<p>Eigen materiaal meenemen. Tekenmateriaal aanwezig.</p>

<h2>Waar?</h2>
<p>Jacob Catsstraat 2, 7576 BS Oldenzaal</p>`

const { error } = await supabase.from('pages').update({ content_nl, content_en: content_nl }).eq('slug', 'schilderlessen')
if (error) { console.error(error.message); process.exit(1) }
console.log('Schilderlessen updated!')
