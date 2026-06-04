// Scrape full content + images from old WordPress site and update articles in Supabase
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zahzutsxucsuzybxsgit.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// --- Helper: fetch HTML ---
async function fetchHtml(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  return r.text()
}

// --- Helper: get article links from a category page (with pagination) ---
async function getArticleUrls(categoryUrl) {
  const urls = []
  let page = 1
  while (true) {
    const pageUrl = page === 1 ? categoryUrl : `${categoryUrl}page/${page}/`
    const html = await fetchHtml(pageUrl)
    // extract permalink from date links (rel="bookmark" links)
    const matches = [...html.matchAll(/href="(https:\/\/www\.bloemena\.com\/wb\/[^"#?]+)"[^>]*>\s*\d{2}\/\d{2}\/\d{4}/g)]
    if (!matches.length) break
    for (const m of matches) {
      const u = m[1]
      if (!urls.includes(u)) urls.push(u)
    }
    // check if there's a next page
    if (!html.includes(`/page/${page + 1}/`) && !html.includes(`?paged=${page + 1}`)) break
    page++
  }
  return urls
}

// --- Helper: scrape a single article page ---
async function scrapeArticle(url) {
  const html = await fetchHtml(url)

  // Title
  const titleMatch = html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/) ||
                     html.match(/<title>([^<]+)<\/title>/)
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : ''

  // Date
  const dateMatch = html.match(/datetime="(\d{4}-\d{2}-\d{2})/) ||
                    html.match(/<time[^>]*>(\d{2})\/(\d{2})\/(\d{4})/)
  let published_at = '2000-01-01'
  if (dateMatch) {
    if (dateMatch[1] && dateMatch[1].includes('-')) {
      published_at = dateMatch[1]
    } else if (dateMatch[3]) {
      published_at = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`
    }
  }

  // Content: grab the entry-content div
  const contentMatch = html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*(?:<div|<footer|<section)/)
    ?? html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<div[^>]*class="[^"]*(?:sharedaddy|wpcnt|post-footer|entry-footer)[^"]*"/)
    ?? html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/article>/)

  let content = contentMatch ? contentMatch[1] : ''

  // Clean up WordPress-specific classes/attrs but keep structure
  content = content
    .replace(/<!--[\s\S]*?-->/g, '')                    // remove HTML comments
    .replace(/<div[^>]*class="[^"]*sharedaddy[^"]*"[\s\S]*$/i, '')  // cut off sharing widgets
    .replace(/<div[^>]*class="[^"]*wpcnt[^"]*"[\s\S]*$/i, '')
    .replace(/ class="[^"]*"/g, '')                      // strip all classes (we'll re-style with prose)
    .replace(/ style="[^"]*"/g, '')                      // strip inline styles
    .replace(/ data-[^=]+="[^"]*"/g, '')                 // strip data attributes
    .replace(/<div>\s*<\/div>/g, '')                     // remove empty divs
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  // Fix image src to be absolute
  content = content.replace(/src="\/wb\//g, 'src="https://www.bloemena.com/wb/')
  content = content.replace(/src="\//g, 'src="https://www.bloemena.com/')

  return { title, published_at, content }
}

// --- Category → DB category map ---
const CATEGORIES = {
  'https://www.bloemena.com/wb/category/recensies/':      'recensies',
  'https://www.bloemena.com/wb/category/projecten/':      'projecten',
  'https://www.bloemena.com/wb/category/publicaties/':    'publicaties',
  'https://www.bloemena.com/wb/category/exposities/':     'tentoonstellingen',
}

// --- Main ---
const { data: existing } = await supabase.from('articles').select('id, title_nl, category')
console.log(`Found ${existing.length} existing articles in DB\n`)

let updated = 0, skipped = 0

for (const [categoryUrl, dbCategory] of Object.entries(CATEGORIES)) {
  console.log(`\n=== ${dbCategory.toUpperCase()} ===`)
  const urls = await getArticleUrls(categoryUrl)
  console.log(`  ${urls.length} articles found`)

  for (const url of urls) {
    const { title, published_at, content } = await scrapeArticle(url)
    if (!title || !content) { console.log(`  SKIP (no content): ${url}`); skipped++; continue }

    // Match to existing DB article by title similarity
    const slug = url.split('/').filter(Boolean).pop()
    const match = existing.find(a =>
      a.category === dbCategory && (
        a.title_nl.toLowerCase().includes(title.toLowerCase().slice(0, 20)) ||
        title.toLowerCase().includes(a.title_nl.toLowerCase().slice(0, 20))
      )
    )

    if (match) {
      const { error } = await supabase.from('articles').update({
        title_nl: title,
        title_en: title,
        content_nl: content,
        content_en: content,
        published_at,
      }).eq('id', match.id)
      if (error) { console.log(`  ERROR ${title}: ${error.message}`); continue }
      console.log(`  ✓ updated: ${title.slice(0, 60)}`)
      updated++
    } else {
      // Insert as new article
      const { error } = await supabase.from('articles').insert({
        title_nl: title, title_en: title,
        content_nl: content, content_en: content,
        published_at, category: dbCategory,
      })
      if (error) { console.log(`  ERROR insert ${title}: ${error.message}`); continue }
      console.log(`  + inserted: ${title.slice(0, 60)}`)
      updated++
    }
  }
}

console.log(`\nDone! ${updated} updated/inserted, ${skipped} skipped.`)
