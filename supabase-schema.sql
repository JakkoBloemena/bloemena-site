-- Run this in the Supabase SQL editor

-- Paintings / drawings
create table if not exists paintings (
  id uuid primary key default gen_random_uuid(),
  title_nl text not null,
  title_en text not null,
  description_nl text,
  description_en text,
  image_url text not null,
  category text not null check (category in ('schilderij', 'tekening')),
  year int,
  width_cm numeric,
  height_cm numeric,
  medium_nl text,
  medium_en text,
  featured boolean not null default false,
  sort_order int not null default 999,
  created_at timestamptz not null default now()
);

-- News posts
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title_nl text not null,
  title_en text not null,
  content_nl text not null default '',
  content_en text not null default '',
  image_url text,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Static pages (about, lessons)
create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  content_nl text not null default '',
  content_en text not null default '',
  updated_at timestamptz not null default now()
);

insert into pages (slug) values ('over-mij'), ('schilderlessen')
on conflict (slug) do nothing;

-- Storage bucket for artwork images
insert into storage.buckets (id, name, public)
values ('artwork', 'artwork', true)
on conflict do nothing;

-- Row-level security: public can read everything
alter table paintings enable row level security;
alter table posts enable row level security;
alter table pages enable row level security;

create policy "public read paintings" on paintings for select using (true);
create policy "public read posts" on posts for select using (true);
create policy "public read pages" on pages for select using (true);

-- Authenticated users (admin) can do everything
create policy "admin all paintings" on paintings for all using (auth.role() = 'authenticated');
create policy "admin all posts" on posts for all using (auth.role() = 'authenticated');
create policy "admin all pages" on pages for all using (auth.role() = 'authenticated');

-- Storage: public read, authenticated write
create policy "public read artwork" on storage.objects for select using (bucket_id = 'artwork');
create policy "admin write artwork" on storage.objects for insert with check (bucket_id = 'artwork' and auth.role() = 'authenticated');
create policy "admin delete artwork" on storage.objects for delete using (bucket_id = 'artwork' and auth.role() = 'authenticated');
