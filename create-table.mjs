// Try multiple approaches to create the op_zn_plek_photos table
const SUPABASE_URL = 'https://zahzutsxucsuzybxsgit.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const SQL = `
create table if not exists op_zn_plek_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order int not null default 999,
  created_at timestamptz not null default now()
);
alter table op_zn_plek_photos enable row level security;
create policy if not exists "public read op_zn_plek_photos" on op_zn_plek_photos for select using (true);
create policy if not exists "admin all op_zn_plek_photos" on op_zn_plek_photos for all using (auth.role() = 'authenticated');
`

// Approach 1: Supabase Management API
console.log('Trying Management API...')
const r1 = await fetch(`https://api.supabase.com/v1/projects/zahzutsxucsuzybxsgit/database/query`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: SQL }),
})
console.log('Management API:', r1.status, await r1.text())

// Approach 2: Project internal pg endpoint
console.log('\nTrying /pg/query...')
const r2 = await fetch(`${SUPABASE_URL}/pg/query`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${SERVICE_KEY}`, 'apikey': SERVICE_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: SQL }),
})
console.log('/pg/query:', r2.status, await r2.text())

// Approach 3: Check if table already exists via REST
console.log('\nChecking if table exists...')
const r3 = await fetch(`${SUPABASE_URL}/rest/v1/op_zn_plek_photos?limit=1`, {
  headers: { 'Authorization': `Bearer ${SERVICE_KEY}`, 'apikey': SERVICE_KEY },
})
console.log('Table check:', r3.status, r3.status === 200 ? 'TABLE EXISTS' : await r3.text())
