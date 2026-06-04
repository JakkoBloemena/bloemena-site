// Fix remaining articles where HTML entity decoding caused title mismatches
import { createClient } from '@supabase/supabase-js'

const sb = createClient('https://zahzutsxucsuzybxsgit.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY)

function decodeEntities(s) {
  return s
    .replace(/&#8216;|&#8217;|&#039;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#038;|&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/ï/g, 'ï').replace(/ë/g, 'ë').replace(/ü/g, 'ü')
    .replace(/é/g, 'é').replace(/è/g, 'è').replace(/ê/g, 'ê')
    .replace(/\s+/g, ' ').trim()
}

async function fetchHtml(url) {
  return (await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text()
}

async function getArticleUrls(categoryUrl) {
  const urls = []
  let page = 1
  while (true) {
    const pageUrl = page === 1 ? categoryUrl : `${categoryUrl}page/${page}/`
    const html = await fetchHtml(pageUrl)
    const matches = [...html.matchAll(/href="(https:\/\/www\.bloemena\.com\/wb\/[^"#?]+)"[^>]*>\s*\d{2}\/\d{2}\/\d{4}/g)]
    if (!matches.length) break
    for (const m of matches) if (!urls.includes(m[1])) urls.push(m[1])
    if (!html.includes(`/page/${page + 1}/`)) break
    page++
  }
  return urls
}

const CATEGORIES = {
  'https://www.bloemena.com/wb/category/recensies/':   'recensies',
  'https://www.bloemena.com/wb/category/projecten/':   'projecten',
  'https://www.bloemena.com/wb/category/publicaties/': 'publicaties',
  'https://www.bloemena.com/wb/category/exposities/':  'tentoonstellingen',
}

const { data: articles } = await sb.from('articles').select('id, title_nl, category, published_at')
// Only target articles still at default date
const needsFix = articles.filter(a => a.published_at?.slice(0, 10) === '2000-01-01')
console.log(`${needsFix.length} articles still need dates\n`)

let fixed = 0

for (const [catUrl, dbCat] of Object.entries(CATEGORIES)) {
  const urls = await getArticleUrls(catUrl)
  for (const url of urls) {
    const html = await fetchHtml(url)
    const dateMatch = html.match(/article:published_time["' ]+content=["'](\d{4}-\d{2}-\d{2})/)
    if (!dateMatch) continue
    const date = dateMatch[1]

    const titleMatch = html.match(/"headline":"([^"]+)"/) || html.match(/<title>([^<]+)<\/title>/)
    const rawTitle = titleMatch ? titleMatch[1].replace(/ - Wiebe Bloemena$/, '') : ''
    const title = decodeEntities(rawTitle)

    const dbArticle = needsFix.find(a =>
      a.category === dbCat && (
        a.title_nl === title ||
        a.title_nl.replace(/[^a-z0-9]/gi,'').toLowerCase().slice(0,20) ===
        title.replace(/[^a-z0-9]/gi,'').toLowerCase().slice(0,20)
      )
    )

    if (!dbArticle) continue
    await sb.from('articles').update({ published_at: date }).eq('id', dbArticle.id)
    console.log(`  ✓ ${date}  ${dbArticle.title_nl.slice(0, 60)}`)
    dbArticle.published_at = date  // prevent double-match
    fixed++
  }
}

console.log(`\nFixed ${fixed} more dates`)
