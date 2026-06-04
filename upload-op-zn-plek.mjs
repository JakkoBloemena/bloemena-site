// Upload Op z'n plek photos to Supabase Storage and generate seeding SQL.
import { createClient } from '@supabase/supabase-js'
import { readdir, readFile, writeFile } from 'fs/promises'
import { join, extname, basename } from 'path'

const SUPABASE_URL = 'https://zahzutsxucsuzybxsgit.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const IMAGES_DIR = 'C:\\bloemena\\op-zn-plek'
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP'])

if (!SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Check if table exists
const { error: tableCheck } = await supabase.from('op_zn_plek_photos').select('id').limit(1)
const tableExists = !tableCheck || tableCheck.code !== 'PGRST205'
console.log(tableExists ? 'Table exists — will insert directly.' : 'Table does not exist yet — will generate SQL.')

const files = (await readdir(IMAGES_DIR)).filter(f => IMAGE_EXTS.has(extname(f)))
console.log(`\nUploading ${files.length} images...\n`)

const urls = []
for (const filename of files) {
  const ext = extname(filename).toLowerCase().replace('.', '')
  const storagePath = `op-zn-plek/${Date.now()}-${filename}`
  process.stdout.write(`  ${filename}... `)

  const buffer = await readFile(join(IMAGES_DIR, filename))
  const { error: uploadErr } = await supabase.storage
    .from('artwork')
    .upload(storagePath, buffer, { contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`, upsert: false })

  if (uploadErr) { console.log(`FAILED: ${uploadErr.message}`); continue }

  const { data: { publicUrl } } = supabase.storage.from('artwork').getPublicUrl(storagePath)
  urls.push(publicUrl)
  console.log('OK')

  if (tableExists) {
    const { error: dbErr } = await supabase.from('op_zn_plek_photos').insert({ image_url: publicUrl })
    if (dbErr) console.log(`    DB insert failed: ${dbErr.message}`)
  }
}

if (!tableExists && urls.length > 0) {
  const inserts = urls.map(u => `  ('${u}')`).join(',\n')
  const sql = `-- Run this in the Supabase SQL editor:
-- https://supabase.com/dashboard/project/zahzutsxucsuzybxsgit/sql/new

create table if not exists op_zn_plek_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order int not null default 999,
  created_at timestamptz not null default now()
);

alter table op_zn_plek_photos enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'op_zn_plek_photos' and policyname = 'public read op_zn_plek_photos') then
    create policy "public read op_zn_plek_photos" on op_zn_plek_photos for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'op_zn_plek_photos' and policyname = 'admin all op_zn_plek_photos') then
    create policy "admin all op_zn_plek_photos" on op_zn_plek_photos for all using (auth.role() = 'authenticated');
  end if;
end $$;

insert into op_zn_plek_photos (image_url) values
${inserts};
`
  await writeFile('seed-op-zn-plek.sql', sql)
  console.log(`\nImages uploaded to storage. Now run the SQL in seed-op-zn-plek.sql`)
  console.log('Supabase SQL editor: https://supabase.com/dashboard/project/zahzutsxucsuzybxsgit/sql/new')
} else {
  console.log(`\nDone! Uploaded ${urls.length}/${files.length} photos.`)
}
