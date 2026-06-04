// Import news articles from old bloemena.com into Supabase posts table
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
const supabase = createClient(config.SUPABASE_URL, config.SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

const articles = [
  {
    title_nl: "La solitude de l'âne..",
    title_en: "La solitude de l'âne..",
    content_nl: '<p>Nieuw schilderij: La solitude de l\'âne.. — zie schilderijen.</p>',
    published_at: '2025-10-09',
  },
  {
    title_nl: 'Angry Forest',
    title_en: 'Angry Forest',
    content_nl: '<p>Het schilderij staat in de rubriek \'op z\'n plek\' in de afdeling \'over mij\'.</p>',
    published_at: '2024-10-09',
  },
  {
    title_nl: 'NOG EVEN TE ZIEN…',
    title_en: 'Still on display…',
    content_nl: '<p>Nog even te zien — zie schilderijen voor meer informatie.</p>',
    published_at: '2024-08-13',
  },
  {
    title_nl: 'TENTOONSTELLING: Hof88 Almelo',
    title_en: 'EXHIBITION: Hof88 Almelo',
    content_nl: '<p>Opening zondag 23 juni om 15.00 uur in de kapel van Hof88, Almelo.</p>',
    published_at: '2024-06-15',
  },
  {
    title_nl: 'Twentse meesters',
    title_en: 'Twentse meesters',
    content_nl: '<p>In de Museumfabriek — tot en met 31 maart.</p>',
    published_at: '2024-03-19',
  },
  {
    title_nl: 'Angsthaas..',
    title_en: 'Angsthaas..',
    content_nl: '<p>Nieuw werk — zie schilderijen.</p>',
    published_at: '2023-10-04',
  },
  {
    title_nl: 'SCHILDERLESSEN VAN START',
    title_en: 'PAINTING LESSONS START',
    content_nl: '<p>Vanaf vrijdag 1 september beginnen de schilderlessen weer. In de meeste groepen zijn nog plekken vrij!</p>',
    published_at: '2023-08-27',
  },
  {
    title_nl: 'ASITO ADG',
    title_en: 'ASITO ADG',
    content_nl: '<p>Voor de boardroom van het hoofdkantoor in Almelo, genaamd Beloega, maakte ik dit schilderij. Twee beloega\'s, 250 x 100 cm, acrylverf op doek.</p>',
    published_at: '2023-06-29',
  },
  {
    title_nl: '9 tekeningen bij een gedicht van Nico Lootsma',
    title_en: '9 drawings for a poem by Nico Lootsma',
    content_nl: '<p>9 tekeningen bij een gedicht van Nico Lootsma — zie tekeningen.</p>',
    published_at: '2022-09-22',
  },
  {
    title_nl: 'CONCERTINA',
    title_en: 'CONCERTINA',
    content_nl: '<p>Een uitgave op initiatief van Nico Lootsma, gepresenteerd op woensdag 7 september in kunstboekhandel Boekie Woekie te Amsterdam.</p><p>10 kunstenaars uit IJsland, Denemarken, Ierland en Nederland maakten een concertina (vouwboekje). Het geheel is in een speciaal door Nico gemaakt doosje verpakt. Het eerste exemplaar is verkocht aan de Koninklijke Bibliotheek in Den Haag.</p>',
    published_at: '2022-09-21',
  },
  {
    title_nl: 'Sepia brushpen..',
    title_en: 'Sepia brushpen..',
    content_nl: '<p>Atelierschets.</p>',
    published_at: '2022-06-22',
  },
  {
    title_nl: 'nieuwe uitgave',
    title_en: 'new publication',
    content_nl: '<p>Nieuwe versie toegevoegd aan de website.</p>',
    published_at: '2022-04-26',
  },
  {
    title_nl: 'dokter Oudoetzeer',
    title_en: 'Doctor Oudoetzeer',
    content_nl: '<p>10 illustraties bij het gedicht van Kornej Tsjoekovski, vertaald door Robbert-Jan Henkes. Te zien in de rubriek Tekeningen.</p>',
    published_at: '2022-01-10',
  },
  {
    title_nl: 'Waterschap Vechtstromen',
    title_en: 'Waterschap Vechtstromen',
    content_nl: '<p>Waterschap Vechtstromen koopt drie schilderijen. Twee ervan staan op de website: Onrustige nacht en La Notte. De derde: IJsland voor Romantici, 95 x 220 cm.</p>',
    published_at: '2021-07-28',
  },
  {
    title_nl: 'Edwina van Heek',
    title_en: 'Edwina van Heek',
    content_nl: '<p>Het schilderij \'Dinkel en Singraven\', geschilderd in opdracht van Stichting Edwina van Heek. Op 12 oktober 2020 werd het schilderij aangeboden aan mr. H.A.A. Kienhuis ter gelegenheid van zijn afscheid als bestuurslid van Stichting Edwina van Heek, als dank voor zijn grote verdienste voor Landgoed Singraven.</p>',
    published_at: '2020-12-09',
  },
  {
    title_nl: 'Corona thuistekening',
    title_en: 'Corona home drawing',
    content_nl: '<p>Eenzame man met vogels…. 30 x 40 cm.</p>',
    published_at: '2020-04-01',
  },
  {
    title_nl: 'Lang geleden…',
    title_en: 'A long time ago…',
    content_nl: '<p>Dit schilderij is vanavond op tv, in een split second gespot in de aankondiging door een vriendin in Oldenzaal. Het hangt in een woning in de Kasbah in Oldenzaal. Ik heb het al veertig jaar niet gezien en had er niet eens een foto van.</p>',
    published_at: '2020-01-20',
  },
  {
    title_nl: 'Lang niet gezien',
    title_en: 'Not seen in a long time',
    content_nl: '<p>Deze foto kreeg ik opgestuurd door de huidige eigenaar van dit schilderij. Gemaakt rond 1985, ooit verkocht aan een bedrijf in Enschede. De eigenaar kocht het in een galerie in Diepenheim. Nu weer in kleur op de website.</p>',
    published_at: '2019-11-12',
  },
  {
    title_nl: 'Tubantia over de open dag',
    title_en: 'Tubantia on the open day',
    content_nl: '<p>Artikel in de Tubantia van 19 november 2018 over de open dag in het atelier.</p>',
    published_at: '2018-11-19',
  },
  {
    title_nl: 'Open dag atelier — zondag 18 november',
    title_en: 'Open studio — Sunday 18 November',
    content_nl: '<p>Zondagmiddag 18 november: open dag in het atelier van 12 tot 5. Welkom!!</p>',
    published_at: '2018-11-13',
  },
  {
    title_nl: 'Wiebe Bloemena werkt tussen IJsland en Twente',
    title_en: 'Wiebe Bloemena works between Iceland and Twente',
    content_nl: '<p><em>Door Peggie Breitbarth (2000)</em></p><p>Irreële herkenbaarheid Oldenzaalse illusionist. Bloemena maakt gebruik van spiegelingen en omkeringen. Het begrip vorm en tegenvorm, die beide een betekenis kunnen hebben, maar nooit tegelijkertijd, wordt bij Bloemena ook associatief gebruikt. Schelpen, hard en omhullend, roepen de weke en meestal verdwenen inhoud die ze moesten beschermen in herinnering.</p><p>Twee tentoonstellingen, één in Hof 88 te Almelo (Puur Natuur) en één in De Reggehof te Goor (Kunstblik), bieden zicht op het werk van de Oldenzaalse schilder Wiebe Bloemena. Een schilder die vijftien jaar zelfstandig werkzaam is, daarin gesteund door twee basisstipendiums van het Fonds voor Beeldende Kunsten.</p>',
    published_at: '2000-05-15',
  },
]

async function run() {
  console.log(`Importing ${articles.length} news articles...\n`)
  let ok = 0, fail = 0
  for (const article of articles) {
    const { error } = await supabase.from('posts').insert({
      title_nl: article.title_nl,
      title_en: article.title_en,
      content_nl: article.content_nl,
      content_en: article.content_en || article.content_nl,
      published_at: article.published_at,
    })
    if (error) {
      console.error(`  ✗  ${article.title_nl}: ${error.message}`)
      fail++
    } else {
      console.log(`  ✓  ${article.title_nl}`)
      ok++
    }
  }
  console.log(`\nDone — ${ok} imported, ${fail} failed`)
}

run()
