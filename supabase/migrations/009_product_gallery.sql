-- Galeria de até três imagens para cada produto administrado.
alter table public.catalog_products add column if not exists gallery_images jsonb not null default '[]'::jsonb;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 8388608, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "Public reads product images" on storage.objects;
create policy "Public reads product images" on storage.objects
  for select using (bucket_id = 'product-images');
