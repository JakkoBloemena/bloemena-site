import { createClient } from '@supabase/supabase-js'
const sb = createClient('https://zahzutsxucsuzybxsgit.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY)

const { data } = await sb.from('articles').select('id, title_nl')

function decode(s) {
  return s
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/ - Wiebe Bloemena$/, '')
    .trim()
}

let fixed = 0
for (const a of data) {
  const clean = decode(a.title_nl)
  if (clean !== a.title_nl) {
    await sb.from('articles').update({ title_nl: clean, title_en: clean }).eq('id', a.id)
    console.log(`  ✓ ${clean.slice(0, 70)}`)
    fixed++
  }
}
console.log(`\nFixed ${fixed} titles`)
