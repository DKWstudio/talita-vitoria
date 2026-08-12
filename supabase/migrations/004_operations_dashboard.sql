-- Fase operacional: controle de pedidos, revendedores e rotas de entrega.
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('novo', 'em_contato', 'confirmado', 'separado', 'saiu_para_entrega', 'entregue', 'cancelado'));

alter table public.orders add column if not exists admin_notes text;
alter table public.orders add column if not exists delivery_date date;

alter table public.users add column if not exists admin_notes text;
alter table public.users add column if not exists revendedor_status text not null default 'nao_solicitado'
  check (revendedor_status in ('nao_solicitado', 'pendente', 'aprovado', 'reprovado'));

update public.users set revendedor_status = 'pendente'
where solicitou_revendedor = true and perfil = 'cliente' and revendedor_status = 'nao_solicitado';

create table if not exists public.delivery_routes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  delivery_date date not null,
  region text,
  driver_name text,
  notes text,
  status text not null default 'planejada'
    check (status in ('planejada', 'em_rota', 'concluida', 'cancelada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.delivery_route_orders (
  route_id uuid not null references public.delivery_routes(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (route_id, order_id),
  unique (order_id)
);

create index if not exists delivery_routes_date_idx on public.delivery_routes(delivery_date, status);
create index if not exists delivery_route_orders_order_idx on public.delivery_route_orders(order_id);

alter table public.delivery_routes enable row level security;
alter table public.delivery_route_orders enable row level security;
