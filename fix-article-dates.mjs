// Fix article dates by fetching each article page and reading the published_time meta tag
import { createClient } from '@supabase/supabase-js'

const sb = createClient('https://zahzutsxucsuzybxsgit.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY)

async function fetchHtml(url) {
  return (await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text()
}

async function getArticleUrls(categoryUrl) {
  const results = []
  let page = 1
  while (true) {
    const pageUrl = page === 1 ? categoryUrl : `${categoryUrl}page/${page}/`
    const html = await fetchHtml(pageUrl)
    const matches = [...html.matchAll(/href="(https:\/\/www\.bloemena\.com\/wb\/[^"#?]+)"[^>]*>\s*\d{2}\/\d{2}\/\d{4}/g)]
    if (!matches.length) break
    for (const m of matches) {
      if (!results.find(r => r === m[1])) results.push(m[1])
    }
    if (!html.includes(`/page/${page + 1}/`)) break
    page++
  }
  return results
}

const CATEGORIES = {
  'https://www.bloemena.com/wb/category/recensies/':   'recensies',
  'https://www.bloemena.com/wb/category/projecten/':   'projecten',
  'https://www.bloemena.com/wb/category/publicaties/': 'publicaties',
  'https://www.bloemena.com/wb/category/exposities/':  'tentoonstellingen',
}

const { data: articles } = await sb.from('articles').select('id, title_nl, category')
let fixed = 0

for (const [catUrl, dbCat] of Object.entries(CATEGORIES)) {
  console.log(`\n${dbCat.toUpperCase()}`)
  const urls = await getArticleUrls(catUrl)

  for (const url of urls) {
    const html = await fetchHtml(url)

    // Date from OG meta (most reliable)
    const dateMatch = html.match(/article:published_time["' ]+content=["'](\d{4}-\d{2}-\d{2})/)
    if (!dateMatch) { console.log(`  no date: ${url}`); continue }
    const date = dateMatch[1]

    // Title from OG/page title (strip site suffix)
    const titleMatch = html.match(/"headline":"([^"]+)"/) || html.match(/<title>([^<]+)<\/title>/)
    const title = titleMatch ? titleMatch[1].replace(/ - Wiebe Bloemena$/, '').trim() : ''

    // Find matching article in DB: same category, title match
    const dbArticle = articles.find(a =>
      a.category === dbCat &&
      (a.title_nl === title ||
       a.title_nl.toLowerCase().slice(0, 30) === title.toLowerCase().slice(0, 30))
    )

    if (!dbArticle) { console.log(`  no match: ${title.slice(0, 50)}`); continue }

    await sb.from('articles').update({ published_at: date }).eq('id', dbArticle.id)
    console.log(`  ✓ ${date}  ${title.slice(0, 55)}`)
    fixed++
  }
}

console.log(`\nFixed ${fixed} dates`)
