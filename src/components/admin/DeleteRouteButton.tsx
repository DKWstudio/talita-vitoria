"use client";

export default function DeleteRouteButton({ action, routeId }: { action: (formData: FormData) => void | Promise<void>; routeId: string }) {
  return <form action={action} onSubmit={(event) => { if (!window.confirm("Excluir esta rota? Os pedidos vinculados voltarão para Confirmado e poderão ser planejados novamente.")) event.preventDefault(); }}>
    <input name="id" type="hidden" value={routeId} />
    <button className="rounded border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50">Excluir rota</button>
  </form>;
}
