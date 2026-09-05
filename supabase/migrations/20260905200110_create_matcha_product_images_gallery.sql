create table public.matcha_product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.matcha_products(id) on delete cascade,
  image_url text not null check (length(btrim(image_url)) > 0),
  alt_text text,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.matcha_product_images is
  'Public image gallery metadata for matcha products. Image files may be hosted in Supabase Storage or an external CDN.';

create index matcha_product_images_product_sort_idx
  on public.matcha_product_images (product_id, sort_order, created_at);

create unique index matcha_product_images_one_primary_idx
  on public.matcha_product_images (product_id)
  where is_primary;

alter table public.matcha_product_images enable row level security;

create policy "Anyone can read product images"
  on public.matcha_product_images
  for select
  to anon, authenticated
  using (true);

grant select on table public.matcha_product_images to anon, authenticated;
grant select, insert, update, delete on table public.matcha_product_images to service_role;
