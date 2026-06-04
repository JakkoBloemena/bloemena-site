-- Run this in the Supabase SQL editor:
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
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606353278-20200120_105204.jpg'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606353601-3A0EBAEE-03DB-4089-B6AE-B4EC1B6F2DEF.JPG'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606353834-3_PHOTO-2022-09-22-11-27-05.jpg'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606353991-9b62df5d-0d75-404b-9fbf-4b12b53a9a13.JPG'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606354187-Beluga-1.jpg'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606354580-Beluga-2.jpg'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606355164-c0127b2f-7661-4110-ac38-8a556d824662.JPG'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606355292-Drostenhuis-Zwolle.jpg'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606355449-DSC00641.jpg'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606355831-fotos-wiebe-057.jpg'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606356328-image_50382593.JPG'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606356748-image_50408193.JPG'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606357224-IMG-20190730-WA0002_resized_20190730_083447482.jpg'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606357402-IMG-20190730-WA00031.jpg'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606357528-IMG-20240317-WA0012.jpg'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606357655-IMG-20240317-WA0014.jpg'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606357852-IMG-20240319-WA0019.jpg'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606357981-IMG_1321.JPG'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606358141-IMG_1325.jpg'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606358329-IMG_1351.JPG'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606358534-IMG_1352.JPG'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606358738-IMG_1353.JPG'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606358903-IMG_9141.jpg'),
  ('https://zahzutsxucsuzybxsgit.supabase.co/storage/v1/object/public/artwork/op-zn-plek/1780606359182-Tentoonstelling-Galerie-Achterom-Haaksbergen.jpg');
