create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete restrict,
  customer_name text not null,
  whatsapp text not null,
  address text not null,
  city text not null,
  delivery_type text not null check (delivery_type in ('propria', 'sob_consulta')),
  profile text not null check (profile in ('cliente', 'revendedor')),
  status text not null default 'novo' check (status in ('novo', 'em_contato', 'confirmado', 'entregue', 'cancelado')),
  total numeric(12,2) not null check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_key text not null,
  product_title text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0)
);
create index if not exists orders_status_created_idx on public.orders(status, created_at desc);
create index if not exists orders_user_created_idx on public.orders(user_id, created_at desc);
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
create policy "Customer creates own orders" on public.orders for insert to authenticated with check (auth.uid() = user_id);
create policy "Customer reads own orders" on public.orders for select to authenticated using (auth.uid() = user_id);
create policy "Customer creates items for own orders" on public.order_items for insert to authenticated with check (exists (select 1 from public.orders where orders.id = order_id and orders.user_id = auth.uid()));
create policy "Customer reads own order items" on public.order_items for select to authenticated using (exists (select 1 from public.orders where orders.id = order_id and orders.user_id = auth.uid()));
