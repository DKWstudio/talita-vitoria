-- Fase 2: histórico operacional de cada pré-venda.
create table if not exists public.order_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  admin_notes text,
  delivery_date date,
  created_at timestamptz not null default now()
);

create index if not exists order_history_order_created_idx
  on public.order_history(order_id, created_at desc);

alter table public.order_history enable row level security;
