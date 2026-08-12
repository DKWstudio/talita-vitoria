"use client";

export default function DeleteOrderButton({ action, orderId }: { action: (formData: FormData) => void | Promise<void>; orderId: string }) {
  return <form action={action} onSubmit={(event) => { if (!window.confirm("Excluir este pedido permanentemente? Esta ação não pode ser desfeita.")) event.preventDefault(); }}><input name="id" type="hidden" value={orderId} /><button className="rounded border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50">Excluir pedido</button></form>;
}
