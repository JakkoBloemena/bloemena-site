// Seed articles from scraped old site content
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zahzutsxucsuzybxsgit.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const articles = [
  // RECENSIES
  { category: 'recensies', published_at: '2018-02-19', title_nl: "Recensie Barend Kooistra over 'van Bloemena Bomen' 2018", content_nl: "<p>Bloemena's \"BOMEN\" in Haaksbergen</p><p>In de Kunstzaal Achterom te Haaksbergen exposeert de Oldenzaalse kunstenaar Wiebe Bloemena een greep uit zijn oeuvre, schilderijen en tekeningen. Het thema is \"Bomen\", althans zo wil de officiële lezing. Op de meeste werken zijn inderdaad bomen afgebeeld, soms als pontificaal hoofdonderwerp, dan weer op de achtergrond, schijnbaar betekenisloos. Maar er is veel meer te zien dan bomen alleen.</p>" },
  { category: 'recensies', published_at: '2015-05-21', title_nl: 'Uitreiking Cultuurprijs Oldenzaal (2015)', content_nl: '<p>Lees hier het jury rapport.</p>' },
  { category: 'recensies', published_at: '2012-11-15', title_nl: 'Jenseits des Rationalen, Bentheimer Courant (2012)', content_nl: '<p>Die "Traumwelt" von Wiebe Bloemena im Bentheimer Atelier in Bad Bentheim. Was schlummert unter der Oberfläche? Was beginnt da, wo unser Blick endet? Die Realität, die wir wahrnehmen, ist das eine, das andere sind die Bilder, die wir in unserem Kopf produzieren. Wiebe Bloemenas "Traumwelt" spiegelt die inneren Bilder wider. Seine Malereien sind fantastisch und wunderschön.</p>' },
  { category: 'recensies', published_at: '2010-03-10', title_nl: "Jet van der Sluis in de Roskam over 'Op de grens' (2010)", content_nl: '<p>Recensie van de tentoonstelling bij galerie Knigge in Hengelo.</p>' },
  { category: 'recensies', published_at: '2007-01-15', title_nl: 'Het licht van IJsland door Herman Haverkate (2007)', content_nl: '<p>Recensie door Herman Haverkate, 2007.</p>' },
  { category: 'recensies', published_at: '2002-12-15', title_nl: 'De spooklandschappen van Wiebe Bloemena door Herman Haverkate (2002)', content_nl: '<p>De wereld van Wiebe Bloemena is er een van wonderlijke, soms spookachtige dromen. Zijn altijd zeer volle schilderijen zien er op het eerst gezicht idyllisch uit, met hun grillige bomen, wolkenpartijen, nachtelijke vijvers en, hier en daar, een schaap of hert. Toch blijkt er bij nader inzien altijd iets dreigends aan de hand.</p>' },
  { category: 'recensies', published_at: '2002-12-15', title_nl: 'Tere herfstkleuren door Peggie Breitbarth (2002)', content_nl: '<p>In Borne, bij kunststichting de Werkplaats, ging de tentoonstelling geestgronden van Wiebe Bloemena van start. Het varieert van tekeningen tot olieverfschilderijen en van briefkaartformaat tot enkele vierkante meters doek. Het gaat om werk van de afgelopen twee jaar, meestal landschappelijk van aard.</p>' },
  { category: 'recensies', published_at: '1999-11-20', title_nl: 'Puur Natuur, Hof 88, Almelo 1999', content_nl: '<p>Recensie, Hof 88, Almelo, 1999.</p>' },
  { category: 'recensies', published_at: '1994-11-15', title_nl: 'Al mijn schilderijen zijn zelfportretten door Herman Haverkate (1994)', content_nl: '<p>Naar aanleiding tentoonstelling finalisten Wim Izaks-stipendium in Diepenheim.</p>' },
  { category: 'recensies', published_at: '1993-11-15', title_nl: 'Bloemena scheidt Siamese tweeling door Wim van der Beek (1993)', content_nl: '<p>Wiebe Jacob Bloemena is zowel een exponent van de anti-esthetische schilderkunst als van de Nieuwe Figuratie. Het bijzondere van zijn schilderijen is dat hij daarin beide stromingen laat samenkomen en daar een eigen vervreemdende sfeer en robuuste schildertrant aan toevoegt.</p>' },

  // PROJECTEN
  { category: 'projecten', published_at: '2015-03-19', title_nl: 'Project Mater Deï (2015)', content_nl: '<p>Het beschilderen van panelen voor de ingegooide ramen van de voormalige huishoudschool Mater Deï in Oldenzaal, samen met collega Bea van Haren en leerlingen van het Twents Carmel College, locatie Potskampstraat.</p>' },
  { category: 'projecten', published_at: '2014-04-10', title_nl: 'Met andere ogen, Kasteel Twickel Delden (2014)', content_nl: '<p>Een project waarbij een tiental kunstenaars, geselecteerd door Henk Lassche, zich lieten inspireren door evenveel verschillende tuinontwerpen voor de tuinen van het kasteel door de eeuwen heen. Bij mij heeft dit geresulteerd in het schilderij "de Heremiet".</p>' },
  { category: 'projecten', published_at: '2009-07-05', title_nl: 'Painting in Progress, Venetië (2009)', content_nl: '<p>Een 10-daagse werkontmoeting met kunstenaars uit Italië, IJsland, Denemarken, Ierland en Nederland, georganiseerd door Nico Lootsma. Vond plaats tijdens de Biënnale en eindigde met een expositie van het gemaakte werk.</p>' },
  { category: 'projecten', published_at: '2007-08-01', title_nl: 'Capileira, Spanje (2007)', content_nl: '<p>Een werkontmoeting in het zuiden van Spanje, aan de voet van de Sierra Nevada. Met een internationaal kunstenaarsgezelschap, eindigend met een expositie aldaar. Organisatie: Ase Højer.</p>' },
  { category: 'projecten', published_at: '2005-07-30', title_nl: 'Minoterie Nay, Pyrénées Atlantique (2005)', content_nl: '<p>Een internationaal kunstenaarswerkbezoek aan de Minoterie in Nay, een verbouwde watermolen met ateliers en expositieruimte. Deelname van kunstenaars uit Frankrijk, Italië, Nederland, IJsland en Ierland.</p>' },
  { category: 'projecten', published_at: '2004-08-30', title_nl: 'Painting in Progress, Amsterdam (2004)', content_nl: '<p>Een werkontmoeting in Amsterdam, gewerkt in een oude kerk nabij Artis. Deelnemers uit Nederland, Duitsland, Ierland, IJsland, Denemarken, Italië. Organisatie: Nico Lootsma.</p>' },
  { category: 'projecten', published_at: '2003-10-26', title_nl: 'Bus van \'t Stroat (2003)', content_nl: "<p>Het beschilderen van de bus van het fameuze StroatEnsemble uit Oldenzaal. De bus is meegeweest naar een solotentoonstelling in Baar in Zwitserland, met een zestal Stroatleden erbij.</p>" },
  { category: 'projecten', published_at: '2002-08-10', title_nl: 'Tyrone Guthrie Centre Annaghmakerrig, Ierland (2002)', content_nl: '<p>Een 10-daags verblijf in het schitterende Tyrone Guthrie Centre met kunstenaars uit diverse landen. Een oud landhuis met inboedel waarin woon- en werkruimten voor kunstenaars, musici en schrijvers zijn gerealiseerd.</p>' },
  { category: 'projecten', published_at: '2000-06-30', title_nl: 'Nordlys, Kopenhagen (2000)', content_nl: '<p>Een tiendaagse werkontmoeting met kunstenaars uit Denemarken, Ierland, IJsland en Nederland. Gewerkt in een atelier in Kopenhagen en op het eiland Møn, eindigend met een expositie in Galerie PI. Organisatie: Ase Højer en Bertine Knudsen.</p>' },

  // PUBLICATIES
  { category: 'publicaties', published_at: '2018-04-15', title_nl: '2018, Kunsttafelenproject, Rijksmuseum Enschede', content_nl: '<p>Kunsttafelenproject georganiseerd door de Rotary, Rijksmuseum Enschede. Twee kleine figuren staan aan de rand van een IJslandse vulkaankrater.</p>' },
  { category: 'publicaties', published_at: '2014-06-26', title_nl: 'Twickelblad zomer 2014', content_nl: '<p>Publicatie in het Twickelblad, zomer 2014.</p>' },
  { category: 'publicaties', published_at: '2014-06-19', title_nl: '2014, Met andere ogen, Kasteel Twickel Delden', content_nl: '<p>Publicatie over het project Met andere ogen bij Kasteel Twickel.</p>' },
  { category: 'publicaties', published_at: '2009-04-30', title_nl: '2e tentoonstelling in Galerie Billing Bild, Zwitserland (2009)', content_nl: '<p>Publicatie bij de tweede tentoonstelling in Galerie Billing Bild, Baar, Zwitserland.</p>' },
  { category: 'publicaties', published_at: '2008-12-10', title_nl: 'Gedicht Mot skogen door Adriaan Krabbendam', content_nl: "<p><em>Mot skogen</em> — Voor Wiebe Bloemena</p><p>grimmig strijkt de lucht de lakens glad / de zon staat weifelend / over een verre berg gebogen / en in het oosten loop ik nóg een keer / met lange benen door de grijze velden</p>" },
  { category: 'publicaties', published_at: '2007-02-15', title_nl: 'Wie is er bang voor moderne kunst door Frans Jozef van der Vaart (2007)', content_nl: '<p>De kunst in en voor het gerechtsgebouw te Almelo, ter ere van het afscheid van Mr. Breitbarth.</p>' },
  { category: 'publicaties', published_at: '2006-05-28', title_nl: 'Persbericht Tentoonstelling Galerie Billing Bild, Baar, Zwitserland', content_nl: '<p>Met op de uitnodiging het schilderij Slowmotion@Midnight.</p>' },
  { category: 'publicaties', published_at: '2004-04-20', title_nl: 'De bard balkt in het roggeveld (2004)', content_nl: "<p>Een uitgave ter ere van H.H. ter Balkt, aan wie de PC Hooftprijs is uitgereikt. Opdracht om een werk te maken naar aanleiding van een gedicht. Gekozen voor 'de elegie van de varkens'. Het schilderij staat tevens afgebeeld op de cover van het boek.</p>" },
  { category: 'publicaties', published_at: '2003-11-15', title_nl: 'Fauna en flora met Ricardo Liong-A-Kong (2003)', content_nl: '<p>Uitgave Ambassade van Bukistan.</p>' },
  { category: 'publicaties', published_at: '1997-11-15', title_nl: 'Wiebe Bloemena door Aranka Klomp', content_nl: "<p>Hij heeft een modelspoorbaan, kan naar eigen zeggen geen mensen tekenen en vond zichzelf achteraf te jong voor de kunstacademie. Wiebe Bloemena, schilder van werken die zowel ludiek als absurd aandoen — \"Alledaagse dingen zijn universeel. Ik wil gewone dingen bijzonder maken.\"</p>" },

  // TENTOONSTELLINGEN
  { category: 'tentoonstellingen', published_at: '2024-05-01', title_nl: 'Tentoonstelling Kunstenlandschap (2024)', content_nl: '<p>Bij Adrie Arendsman in het Arendsmanhuis te Enschede. Curator: Paul Hajenius.</p>' },
  { category: 'tentoonstellingen', published_at: '2018-06-07', title_nl: '2018, Tentoonstelling Medisch Spectrum Twente', content_nl: '<p>Tien grote werken en een klein werk t/m eind oktober 2018 in MST Enschede.</p>' },
  { category: 'tentoonstellingen', published_at: '2018-03-15', title_nl: "2018, Galerie Achterom, Haaksbergen", content_nl: "<p>Tentoonstelling 'van Bloemena Bomen', ook verschenen in de pers als '25 jaar Bomen'. Een thematentoonstelling met schilderijen en tekeningen.</p>" },
  { category: 'tentoonstellingen', published_at: '2017-04-15', title_nl: '2017, Drostenhuis, Stedelijk Museum Zwolle', content_nl: "<p>Een tentoonstelling van meerdere kunstenaars, waarbij gereageerd wordt op de in het museum aanwezige werken. Van mij waren er te zien: 'mijn nooit geboren tante van moederszijde' in een portretgalerie, en 'Artistiek Brandhout' in de vuurplaats in de keuken.</p>" },
  { category: 'tentoonstellingen', published_at: '2016-04-15', title_nl: '2016, 11 Jahre Bentheimer Atelier, Bad Bentheim', content_nl: '<p>Een overzichtstentoonstelling van alle exposanten van de afgelopen 11 jaar.</p>' },
  { category: 'tentoonstellingen', published_at: '2015-11-20', title_nl: '2015, ARTOverijssel, Museum het Palthehuis Oldenzaal', content_nl: '<p>Een door de provincie Overijssel geïnitieerde tentoonstelling met Overijsselse kunstenaars op diverse locaties in het museum.</p>' },
  { category: 'tentoonstellingen', published_at: '2015-11-15', title_nl: '2015, Museum het Palthehuis Oldenzaal', content_nl: '<p>Tentoonstelling van schilderijen en tekeningen, samen met de beelden van Bert Nijenhuis.</p>' },
  { category: 'tentoonstellingen', published_at: '2015-07-15', title_nl: '2015, Westkunst Amsterdam', content_nl: '<p>Een tentoonstelling samengesteld door een Amsterdamse architect.</p>' },
  { category: 'tentoonstellingen', published_at: '2014-06-15', title_nl: '2013, Vier schilders in de kloostergangen, Oude Stadhuis Haarlem', content_nl: '<p>Een tentoonstelling op uitnodiging, o.a. met Beth Namenwirth.</p>' },
  { category: 'tentoonstellingen', published_at: '2013-07-15', title_nl: '2013, Galerie Felice, Ootmarsum', content_nl: '<p>Een tentoonstelling met een aantal grote werken.</p>' },
  { category: 'tentoonstellingen', published_at: '2012-05-30', title_nl: '2012, Grote Kerk, Alkmaar', content_nl: '<p>Tentoonstelling in de Grote Kerk, Alkmaar.</p>' },
  { category: 'tentoonstellingen', published_at: '2010-05-30', title_nl: '2010, Over de grens, Jan Knigge, Hengelo', content_nl: '<p>Een tentoonstelling rond mijn 50e verjaardag en verhuizing naar Bentheim.</p>' },
]

console.log(`Seeding ${articles.length} articles...`)
const { error } = await supabase.from('articles').insert(articles)
if (error) { console.error('Error:', error.message); process.exit(1) }
console.log('Done!')
