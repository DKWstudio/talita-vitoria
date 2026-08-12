-- Fase 4: catálogo editável e histórico simples de preços.
create table if not exists public.catalog_products (
  id text primary key,
  title text not null,
  description text,
  category text not null,
  image_url text,
  product_url text not null,
  preco_cliente_base numeric(12,2) not null default 0 check (preco_cliente_base >= 0),
  preco_revendedor_atacado numeric(12,2) not null default 0 check (preco_revendedor_atacado >= 0),
  is_active boolean not null default true,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.product_price_history (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.catalog_products(id) on delete cascade,
  preco_cliente_anterior numeric(12,2),
  preco_cliente_novo numeric(12,2) not null,
  preco_revendedor_anterior numeric(12,2),
  preco_revendedor_novo numeric(12,2) not null,
  changed_at timestamptz not null default now()
);

create index if not exists product_price_history_product_idx on public.product_price_history(product_id, changed_at desc);

alter table public.catalog_products enable row level security;
alter table public.product_price_history enable row level security;

drop policy if exists "Public reads active catalog products" on public.catalog_products;
create policy "Public reads active catalog products" on public.catalog_products
  for select using (is_active = true);
