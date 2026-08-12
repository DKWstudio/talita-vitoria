-- Fecha o ciclo de análise: documentos recusados podem ser substituídos pelo revendedor.
drop policy if exists "Reseller replaces own pending documents" on public.reseller_documents;

create policy "Reseller replaces own pending or rejected documents"
on public.reseller_documents
for update
to authenticated
using (auth.uid() = user_id and status in ('pendente', 'rejeitado'))
with check (auth.uid() = user_id);
