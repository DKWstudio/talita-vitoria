-- Portal Talita Vitória: catálogo com duas tabelas de preço e perfis de acesso.
alter table public.products add column if not exists preco_cliente_base numeric(12,2);
alter table public.products add column if not exists preco_revendedor_atacado numeric(12,2);

update public.products set
  preco_cliente_base = coalesce(preco_cliente_base, price),
  preco_revendedor_atacado = coalesce(preco_revendedor_atacado, round(price * .75, 2));

alter table public.products alter column preco_cliente_base set not null;
alter table public.products alter column preco_revendedor_atacado set not null;
alter table public.products add constraint products_preco_cliente_check check (preco_cliente_base >= 0) not valid;
alter table public.products add constraint products_preco_revendedor_check check (preco_revendedor_atacado >= 0) not valid;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  nome_completo text not null,
  email text not null,
  telefone text not null,
  logradouro text not null,
  numero text not null,
  bairro text not null,
  cidade text not null,
  cep text not null,
  perfil text not null default 'cliente' check (perfil in ('cliente', 'revendedor')),
  solicitou_revendedor boolean not null default false,
  revendedor_aprovado_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;
create policy "User reads own profile" on public.users for select using (auth.uid() = id);
create policy "User updates own contact data" on public.users for update using (auth.uid() = id)
  with check (auth.uid() = id and perfil = (select perfil from public.users where id = auth.uid()));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, nome_completo, email, telefone, logradouro, numero, bairro, cidade, cep, solicitou_revendedor)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome_completo', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'telefone', ''),
    coalesce(new.raw_user_meta_data->>'logradouro', ''),
    coalesce(new.raw_user_meta_data->>'numero', ''),
    coalesce(new.raw_user_meta_data->>'bairro', ''),
    coalesce(new.raw_user_meta_data->>'cidade', ''),
    coalesce(new.raw_user_meta_data->>'cep', ''),
    coalesce(new.raw_user_meta_data->>'tipo_cadastro', 'cliente') = 'revendedor'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- Não exponha preços na API anônima: a interface só os mostra após autenticação.
-- Para proteção forte contra inspeção de rede, sirva os preços por uma RPC authenticated.
create or replace function public.catalogo_com_precos()
returns table (id uuid, preco numeric, perfil text)
language sql security definer set search_path = public stable as $$
  select p.id,
    case when u.perfil = 'revendedor' then p.preco_revendedor_atacado else p.preco_cliente_base end,
    u.perfil
  from public.products p join public.users u on u.id = auth.uid()
  where p.is_active = true;
$$;
revoke all on function public.catalogo_com_precos() from public;
grant execute on function public.catalogo_com_precos() to authenticated;
