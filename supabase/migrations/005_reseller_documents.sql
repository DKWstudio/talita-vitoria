-- Fases 2 e 3: documentos privados de revendedores.
create table if not exists public.reseller_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  document_type text not null check (document_type in ('identidade_frente', 'identidade_verso', 'cpf_cnpj', 'comprovante_residencia')),
  file_path text not null,
  file_name text not null,
  status text not null default 'pendente' check (status in ('pendente', 'aprovado', 'rejeitado')),
  admin_notes text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique(user_id, document_type)
);

alter table public.reseller_documents enable row level security;
create policy "Reseller reads own documents" on public.reseller_documents for select to authenticated using (auth.uid() = user_id);
create policy "Reseller inserts own documents" on public.reseller_documents for insert to authenticated with check (auth.uid() = user_id);
create policy "Reseller replaces own pending documents" on public.reseller_documents for update to authenticated using (auth.uid() = user_id and status = 'pendente') with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('reseller-documents', 'reseller-documents', false, 10485760, array['image/jpeg','image/png','application/pdf'])
on conflict (id) do update set public = false, file_size_limit = 10485760, allowed_mime_types = array['image/jpeg','image/png','application/pdf'];

create policy "Users upload own reseller documents" on storage.objects for insert to authenticated
with check (bucket_id = 'reseller-documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users read own reseller documents" on storage.objects for select to authenticated
using (bucket_id = 'reseller-documents' and (storage.foldername(name))[1] = auth.uid()::text);
