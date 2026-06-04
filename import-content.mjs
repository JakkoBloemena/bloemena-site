// Import scraped content from old bloemena.com into Supabase pages table
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

const pages = [
  {
    slug: 'over-mij',
    content_nl: `<h2>Opleiding</h2>
<p>1979 – 1984: A.K.I. Enschede.<br>
1972 – 1979: Christelijk Lyceum Almelo, Atheneum B.</p>

<h2>Stipendia</h2>
<p>2015: Cultuurprijs Gemeente Oldenzaal.<br>
1999: Basisstipendium, Fonds voor Beeldend Kunsten, Vormgeving en Bouwkunst.<br>
1994: Basisstipendium, Fonds voor Beeldend Kunsten, Vormgeving en Bouwkunst.</p>

<h2>Werkzaamheden</h2>
<p>Zelfstandig kunstenaar.</p>
<p>2008 – heden: Schildercursussen eigen atelier.<br>
2009 – 2020: Docent schilderen Chateau de Grimonster, België.<br>
2009 – 2013: Docent schilderen Universiteit Twente.<br>
2012: Docent Sommerakademie, Bad Bentheim, Duitsland.<br>
1999 – 2007: Docent schilderen Concordia Enschede.<br>
2003 – 2006: Gastdocentschappen Arthez (AKI) Enschede.</p>`,

    content_en: `<h2>Education</h2>
<p>1979 – 1984: A.K.I. Enschede (Academy of Art & Industry).<br>
1972 – 1979: Christelijk Lyceum Almelo, Atheneum B.</p>

<h2>Grants & Awards</h2>
<p>2015: Cultuurprijs Gemeente Oldenzaal.<br>
1999: Basic Grant, Fonds voor Beeldend Kunsten, Vormgeving en Bouwkunst.<br>
1994: Basic Grant, Fonds voor Beeldend Kunsten, Vormgeving en Bouwkunst.</p>

<h2>Professional activities</h2>
<p>Independent artist.</p>
<p>2008 – present: Painting courses at own studio.<br>
2009 – 2020: Painting teacher, Chateau de Grimonster, Belgium.<br>
2009 – 2013: Painting teacher, University of Twente.<br>
2012: Teacher, Sommerakademie, Bad Bentheim, Germany.<br>
1999 – 2007: Painting teacher, Concordia Enschede.<br>
2003 – 2006: Guest lecturer, Arthez (AKI) Enschede.</p>`
  },

  {
    slug: 'tentoonstellingen',
    content_nl: `<ul>
<li><strong>Mei 2024</strong> — Tentoonstelling Kunstenlandschap. Bij Adrie Arendsman in het Arendsmanhuis te Enschede. Curator: Paul Hajenius.</li>
<li><strong>2018</strong> — Tentoonstelling Medisch Spectrum Twente. Tien grote werken t/m eind oktober 2018 in MST Enschede.</li>
<li><strong>2018</strong> — Kunsttafelenproject, Rijksmuseum Enschede, georganiseerd door de Rotary.</li>
<li><strong>2018</strong> — Galerie Achterom, Haaksbergen. Tentoonstelling 'van Bloemena Bomen' / '25 jaar Bomen'. Schilderijen en tekeningen.</li>
<li><strong>2018</strong> — Galerie Jansen &amp; Kooy, Warnsveld. (in stock)</li>
<li><strong>2018</strong> — Galerie Billing Bild, Baar, Zwitserland. (in stock)</li>
<li><strong>2017</strong> — Drostenhuis, Stedelijk Museum Zwolle. Tentoonstelling meerdere kunstenaars.</li>
<li><strong>2016</strong> — 11 Jahre Bentheimer Atelier, Bad Bentheim, Duitsland.</li>
<li><strong>2015</strong> — ARTOverijssel, Museum het Palthehuis Oldenzaal.</li>
<li><strong>2015</strong> — Museum het Palthehuis Oldenzaal. Schilderijen en tekeningen, samen met de beelden van Bert Nijenhuis.</li>
<li><strong>2015</strong> — Westkunst Amsterdam.</li>
<li><strong>2013</strong> — Vier schilders in de kloostergangen. Oude stadhuis Haarlem.</li>
<li><strong>2013</strong> — Galerie Felice, Ootmarsum.</li>
<li><strong>2012</strong> — Grote Kerk, Alkmaar.</li>
<li><strong>2010</strong> — Over de grens, Jan Knigge, Hengelo.</li>
<li><strong>2009</strong> — Galerie Billing Bild, Zwitserland.</li>
<li><strong>2009</strong> — Jansen &amp; Kooij, Warnsveld.</li>
<li><strong>2009</strong> — Stedelijk Museum Dordrecht. 25 jaar finalisten Wim Izaks Prijs.</li>
<li><strong>2008</strong> — de Witte Kamer, Delden.</li>
<li><strong>2007</strong> — Hafnarfjordur, IJsland.</li>
<li><strong>2006</strong> — Rabobank, Goor.</li>
<li><strong>2004</strong> — Schapen Hoeden, Universiteit Twente.</li>
<li><strong>2002</strong> — Grafiektentoonstelling Provincie Overijssel.</li>
<li><strong>2002</strong> — Bornse Kunststichting.</li>
<li><strong>1999</strong> — Puur Natuur, Hof 88, Almelo.</li>
<li><strong>1999</strong> — Galerie Jansen &amp; Kooij, Warnsveld.</li>
<li><strong>1997</strong> — Galerie Dijkzicht, Rotterdam.</li>
<li><strong>1997</strong> — Jansen &amp; Kooij, Amsterdam.</li>
<li><strong>1997</strong> — Art Fair, Stockholm, Zweden.</li>
<li><strong>1997</strong> — K.C.O., Zwolle.</li>
<li><strong>1996</strong> — Art Multiple, Dusseldorf, Duitsland.</li>
<li><strong>1995</strong> — Museum het Palthe Huis, Oldenzaal.</li>
<li><strong>1995</strong> — Kunstvereniging Diepenheim.</li>
<li><strong>1994</strong> — HCAK, Den Haag.</li>
<li><strong>1994</strong> — Jansen &amp; Kooij, Amsterdam.</li>
<li><strong>1993</strong> — Kunstzaal Hengelo.</li>
<li><strong>1993</strong> — Provinciehuis Zwolle.</li>
<li><strong>1989</strong> — Drehscheibe, Nordhorn, Duitsland. Twentse kunstenaars reageren op Nordhorn.</li>
<li><strong>1988</strong> — Noordkunst, Zuidlaren.</li>
<li><strong>1987</strong> — Kunstuitkijk Deventer.</li>
<li><strong>1986</strong> — Verbeelding. Tentoonstelling beeldende kunst uit Overijssel, Bergkerk Deventer.</li>
<li><strong>1986</strong> — Kunstzaal Hengelo.</li>
</ul>`,
    content_en: ''
  },

  {
    slug: 'publicaties',
    content_nl: `<ul>
<li><strong>2018</strong> — Kunsttafelenproject, Rijksmuseum Enschede, georganiseerd door de Rotary.</li>
<li><strong>2014</strong> — Twickelblad zomer 2014.</li>
<li><strong>2014</strong> — Met andere ogen, Kasteel Twickel Delden.</li>
<li><strong>2008</strong> — Gedicht Adriaan Krabbendam — <em>Mot skogen</em>. Voor Wiebe Bloemena.</li>
<li><strong>2007</strong> — <em>Wie is er bang voor moderne kunst</em> door Frans Jozef van der Vaart. De kunst in en voor het gerechtsgebouw te Almelo.</li>
<li><strong>2006</strong> — Persbericht Tentoonstelling Galerie Billing Bild, Baar, Zwitserland.</li>
<li><strong>2005</strong> — Kunstbeurs Zürich 2005.</li>
<li><strong>2004</strong> — <em>De bard balkt in het roggeveld</em>. Uitgave ter ere van H.H. ter Balkt, PC Hooftprijs. Omslag: schilderij 'de elegie van de varkens'.</li>
<li><strong>2003</strong> — <em>Fauna en flora</em> met Ricardo Liong-A-Kong. Uitgave Ambassade van Bukistan.</li>
<li><strong>2000</strong> — <em>De werkelijkheid op z'n kant</em>. Uitgave van de provincie Overijssel bij een reizende tentoonstelling.</li>
<li><strong>1998</strong> — Listasummar 1998, werkbezoek aan IJsland.</li>
<li><strong>1997</strong> — <em>Wiebe Bloemena</em> door Aranka Klomp. Over de kunstenaar en zijn werk.</li>
<li><strong>1996</strong> — <em>Over de Grens</em> door Gerard Fliehe. Boeschoten Stichting Kunst &amp; Cultuur Overijssel.</li>
<li><strong>1994</strong> — <em>Schnittpunkt. Junge Kunst in Gronau.</em></li>
<li><strong>1994</strong> — <em>Wim Izaks Stipendium</em> door Sipke Huismans, directeur AKI.</li>
<li><strong>1988</strong> — 9 Kunstenaars. Tentoonstelling Stadhuis Hengelo.</li>
<li><strong>1986</strong> — Verbeelding. Tentoonstelling beeldende kunst uit Overijssel, Bergkerk Deventer.</li>
</ul>`,
    content_en: ''
  },

  {
    slug: 'projecten',
    content_nl: `<ul>
<li><strong>2015</strong> — Project Mater Dei. Het beschilderen van panelen voor de ingegooide ramen van de voormalige huishoudschool Mater Dei in Oldenzaal, samen met Bea van Haren en leerlingen van het Twents Carmel College.</li>
<li><strong>2014</strong> — Met andere ogen, Kasteel Twickel Delden. Een project waarbij kunstenaars zich lieten inspireren door tuinontwerpen voor de tuinen van het kasteel. Resultaat: het schilderij 'De Heremiet'.</li>
<li><strong>2009</strong> — Painting in Progress, Venetië. Een 10-daagse werkontmoeting met kunstenaars uit Italië, IJsland, Denemarken, Ierland en Nederland, tijdens de Biënnale.</li>
<li><strong>2007</strong> — Capileira, Spanje. Werkontmoeting aan de voet van de Sierra Nevada met een internationaal kunstenaarsgezelschap.</li>
<li><strong>2005</strong> — Minoterie Nay, Pyrénées Atlantique. Internationaal kunstenaarswerkbezoek aan een verbouwde watermolen in Nay, met kunstenaars uit Frankrijk, Italië, Nederland, IJsland en Ierland.</li>
<li><strong>2004</strong> — Painting in Progress, Amsterdam. Werkontmoeting in een oude kerk nabij Artis, met deelnemers uit Nederland, Duitsland, Ierland, IJsland, Denemarken, Italië.</li>
<li><strong>2003</strong> — Bus van 't Stroat. Het beschilderen van de bus van het StroatEnsemble uit Oldenzaal.</li>
<li><strong>2002</strong> — Tyrone Guthrie Centre Annaghmakerrig, Ierland. 10-daags verblijf in een oud landhuis met kunstenaars, musici en schrijvers.</li>
<li><strong>2000</strong> — Nordlys Kopenhagen. Werkontmoeting met kunstenaars uit Denemarken, Ierland, IJsland en Nederland. Expositie in Galerie PI, Kopenhagen.</li>
<li><strong>1999</strong> — Mede-organisator Noorderlicht. Kunstenaars uit IJsland, Denemarken, Ierland en Nederland werkten 10 dagen samen in Oldenzaal.</li>
<li><strong>1998</strong> — Listasummar, werkbezoek aan IJsland. Werkontmoeting in het noorden van IJsland.</li>
<li><strong>1997</strong> — Dzukija Verana, Litouwen. Tiendaagse bijeenkomst met kunstenaars uit Ierland, Denemarken, IJsland en Nederland.</li>
<li><strong>1997</strong> — Kunst in de Bank. Project gesponsord door ABN/AMRO met tentoonstellingen van 10 Overijsselse kunstenaars in 10 rayonkantoren.</li>
<li><strong>1997</strong> — Project Chinese Whisper, Kunstrai Amsterdam. Iedere kunstenaar maakte een kopie van het schilderijtje dat hem werd gebracht.</li>
<li><strong>1994</strong> — Panorama Art Nature Project, Kuiperberg Ootmarsum. 12 kunstenaars werkten aan een cirkel van 12 meter doorsnede.</li>
</ul>`,
    content_en: ''
  },

  {
    slug: 'collecties',
    content_nl: `<ul>
<li>Gemeente Oldenzaal</li>
<li>Gemeente Hengelo</li>
<li>Gemeente Almelo</li>
<li>Gemeente Enschede</li>
<li>Gemeente Nordhorn (D)</li>
<li>S.B.K. Amsterdam</li>
<li>S.B.K. Gelderland</li>
<li>Hogeschool Saxion Enschede</li>
<li>Advocatenkantoor Bakker Enschede</li>
<li>Waterschap Regge en Dinkel</li>
<li>Rabobank Deventer</li>
<li>Rechtbank Almelo</li>
<li>REEF Infra BV Oldenzaal</li>
<li>Universiteit Twente</li>
<li>HWH-Europe B.V. Oldenzaal</li>
<li>Particulieren in binnen- en buitenland</li>
</ul>`,
    content_en: `<ul>
<li>Municipality of Oldenzaal</li>
<li>Municipality of Hengelo</li>
<li>Municipality of Almelo</li>
<li>Municipality of Enschede</li>
<li>Municipality of Nordhorn (Germany)</li>
<li>S.B.K. Amsterdam</li>
<li>S.B.K. Gelderland</li>
<li>Saxion University of Applied Sciences, Enschede</li>
<li>Law firm Bakker, Enschede</li>
<li>Waterschap Regge en Dinkel</li>
<li>Rabobank Deventer</li>
<li>Court of Justice, Almelo</li>
<li>REEF Infra BV Oldenzaal</li>
<li>University of Twente</li>
<li>HWH-Europe B.V. Oldenzaal</li>
<li>Private collections in the Netherlands and abroad</li>
</ul>`
  },

  {
    slug: 'recensies',
    content_nl: `<article>
<h3>Barend Kooistra — Bloemena's "BOMEN" in Haaksbergen (2018)</h3>
<p>In de Kunstzaal Achterom te Haaksbergen exposeert de Oldenzaalse kunstenaar Wiebe Bloemena een greep uit zijn oeuvre, schilderijen en tekeningen. Het thema is "Bomen". Op de meeste werken zijn inderdaad bomen afgebeeld, soms als pontificaal hoofdonderwerp, dan weer op de achtergrond, schijnbaar betekenisloos. Maar er is veel meer te zien dan bomen alleen.</p>
</article>

<article>
<h3>Uitreiking Cultuurprijs Oldenzaal (2015)</h3>
<p>Juryrapport bij de uitreiking van de Cultuurprijs van de Gemeente Oldenzaal.</p>
</article>

<article>
<h3>Jenseits des Rationalen — Bentheimer Courant (2012)</h3>
<p><em>(vertaling uit het Duits)</em> De "droomwereld" van Wiebe Bloemena in het Bentheimer Atelier in Bad Bentheim. Wat sluimert er onder het oppervlak? Waar begint wat ons blik eindigt? Wiebe Bloemena's "droomwereld" weerspiegelt de innerlijke beelden. Zijn schilderijen zijn fantastisch en prachtig. Wie Bloemena's schilderijen bekijkt, merkt al snel: niets is zoals het is, of beter gezegd, zoals het lijkt.</p>
</article>

<article>
<h3>Jet van der Sluis in de Roskam — Tentoonstelling 'Op de grens' (2010)</h3>
<p>"Hij maakt je deelgenoot van zijn eigen niet-alledaagse werkelijkheid; een wereld die verwondert en waarin je als toeschouwer graag verdwaalt."</p>
</article>

<article>
<h3>Herman Haverkate — Het licht van IJsland (2007)</h3>
</article>

<article>
<h3>Herman Haverkate — De spooklandschappen van Wiebe Bloemena (2002)</h3>
<p>De wereld van Wiebe Bloemena is er een van wonderlijke, soms spookachtige dromen. Zijn altijd zeer volle schilderijen zien er op het eerste gezicht idyllisch uit, met hun grillige bomen, wolkenpartijen, nachtelijke vijvers en, hier en daar, een schaap of hert. Toch blijkt er bij nader inzien altijd iets dreigends aan de hand.</p>
</article>

<article>
<h3>Peggie Breitbarth — Tere herfstkleuren (2002)</h3>
<p>In Borne, bij kunststichting de Werkplaats, ging de tentoonstelling 'geestgronden' van Wiebe Bloemena van start. Het varieert van tekeningen tot olieverfschilderijen en van briefkaartformaat tot enkele vierkante meters doek. In tere herfstkleuren zet Bloemena naast elkaar: een fossiel, een schelp, een ramshoorn en een hoed.</p>
</article>

<article>
<h3>Puur Natuur, Hof 88, Almelo (1999)</h3>
</article>

<article>
<h3>Herman Haverkate — Al mijn schilderijen zijn zelfportretten (1994)</h3>
<p>Naar aanleiding van de tentoonstelling van finalisten Wim Izaks-stipendium in Diepenheim.</p>
</article>

<article>
<h3>Wim van der Beek — Bloemena scheidt Siamese tweeling (1993)</h3>
<p>Wiebe Jacob Bloemena is zowel een exponent van de anti-esthetische schilderkunst als van de Nieuwe Figuratie. Het bijzondere van zijn schilderijen is dat hij daarin beide stromingen laat samenkomen en daar een eigen vervreemdende sfeer en robuuste schildertrant aan toevoegt.</p>
</article>`,
    content_en: ''
  },

  {
    slug: 'op-zn-plek',
    content_nl: `<p>Een selectie van werken die een plek hebben gevonden in collecties en bij particulieren.</p>
<ul>
<li><strong>Ierland</strong> — Een van de eerste Ierlandschilderijen. Particuliere collectie, Oldenzaal.</li>
<li><strong>Angry Forest</strong> — Particuliere collectie, Enschede.</li>
<li><strong>Artistiek Brandhout</strong> — Particulier, Oldenzaal.</li>
<li><strong>Wolkenboom</strong> — Olieverf. Particulier, Enschede.</li>
<li><strong>Beloega's</strong> — Boardroom hoofdkantoor Asito adg, Almelo.</li>
<li><strong>Aardperen</strong> — Particulier, Utrecht.</li>
<li><strong>Tekening 'Bergrede'</strong> — Particulier, Amsterdam.</li>
<li><strong>IJsland voor romantici</strong> — Waterschap Vechtstromen.</li>
<li><strong>Onrustige nacht</strong> — Waterschap Vechtstromen.</li>
<li><strong>Studie Verdwenen Cultuur</strong> — Particulier, Almere.</li>
<li><strong>Middernacht op Videy</strong> — Particulier, Almere.</li>
<li><strong>Orange Submarine</strong> — Particulier, Amsterdam.</li>
<li><strong>Wandelen in mist</strong> — Particulier, Enschede.</li>
<li><strong>Artistiek Brandhout</strong> — In de open haard van de keuken van Museum het Drostenhuis, Zwolle. Tijdelijke tentoonstelling provincie, 2017.</li>
<li><strong>2 kleine werken</strong> — Olieverf op karton. Museum het Palthehuis, Oldenzaal. 2015.</li>
</ul>`,
    content_en: `<p>A selection of works that have found a home in collections and with private collectors.</p>
<ul>
<li><strong>Ireland</strong> — One of the first Ireland paintings. Private collection, Oldenzaal.</li>
<li><strong>Angry Forest</strong> — Private collection, Enschede.</li>
<li><strong>Artistic Firewood</strong> — Private collection, Oldenzaal.</li>
<li><strong>Cloud Tree (Wolkenboom)</strong> — Oil on canvas. Private collection, Enschede.</li>
<li><strong>Belugas</strong> — Boardroom, Asito HQ, Almelo.</li>
<li><strong>Jerusalem Artichokes (Aardperen)</strong> — Private collection, Utrecht.</li>
<li><strong>Drawing 'Sermon on the Mount'</strong> — Private collection, Amsterdam.</li>
<li><strong>Iceland for Romantics</strong> — Waterschap Vechtstromen.</li>
<li><strong>Restless Night</strong> — Waterschap Vechtstromen.</li>
<li><strong>Orange Submarine</strong> — Private collection, Amsterdam.</li>
<li><strong>Walking in Mist</strong> — Private collection, Enschede.</li>
</ul>`
  },

  {
    slug: 'schilderlessen',
    content_nl: `<p>Wiebe Bloemena geeft schildercursussen in zijn eigen atelier in Oldenzaal.</p>
<p>Zowel beginners als gevorderden zijn welkom. De lessen zijn gericht op het schilderen naar levend model, stillevens en landschappen, in diverse technieken (olieverf, acryl, pastel).</p>
<h2>Contact</h2>
<p>Voor meer informatie en aanmelding kunt u contact opnemen via het <a href="/contact">contactformulier</a>.</p>`,
    content_en: `<p>Wiebe Bloemena offers painting courses at his own studio in Oldenzaal.</p>
<p>Both beginners and advanced students are welcome. Lessons focus on painting from life — figure, still life and landscape — in various techniques (oil, acrylic, pastel).</p>
<h2>Contact</h2>
<p>For more information and registration, please use the <a href="/en/contact">contact form</a>.</p>`
  }
]

async function run() {
  console.log(`Importing ${pages.length} pages...\n`)
  for (const page of pages) {
    const { error } = await supabase.from('pages').upsert(
      {
        slug: page.slug,
        content_nl: page.content_nl,
        content_en: page.content_en || page.content_nl,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'slug' }
    )
    if (error) {
      console.error(`  ✗  ${page.slug}: ${error.message}`)
    } else {
      console.log(`  ✓  ${page.slug}`)
    }
  }
  console.log('\nDone.')
}

run()
