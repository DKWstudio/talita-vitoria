"use client";

import { useMemo, useState } from "react";
import { talitaDeliveryCities } from "@/data/deliveryCities";

type Order = { id: string; customer_name: string; city: string; whatsapp: string; address: string; total: number; status: string };
const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function RoutePlanner({ orders, action }: { orders: Order[]; action: (formData: FormData) => void | Promise<void> }) {
  const [cities, setCities] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const available = useMemo(() => orders.filter((order) => cities.includes(order.city)), [orders, cities]);
  const chosen = available.filter((order) => selected.includes(order.id));
  const toggleCity = (city: string) => setCities((current) => current.includes(city) ? current.filter((item) => item !== city) : [...current, city]);
  const toggleOrder = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return <form action={action} className="mt-4 space-y-4 rounded-2xl bg-white p-5 shadow-sm">
    <input name="name" required placeholder="Nome da rota (ex.: Oeste - quinta)" className="field w-full" />
    <input name="delivery_date" type="date" required className="field w-full" />
    <input name="region" type="hidden" value={cities.join(", ")} readOnly />
    <input name="driver_name" placeholder="Responsável pela rota" className="field w-full" />
    <textarea name="notes" placeholder="Observações internas da rota" className="field min-h-20 w-full" />
    <div><p className="text-sm font-bold text-[#34445f]">1. Selecione as cidades da rota</p><p className="mt-1 text-xs text-stone-500">Somente cidades da entrega própria Talita Vitória.</p><div className="mt-3 grid max-h-48 grid-cols-2 gap-2 overflow-auto rounded-xl bg-stone-50 p-3 sm:grid-cols-3">{talitaDeliveryCities.map((city) => <label key={city} className="flex gap-2 text-xs"><input type="checkbox" checked={cities.includes(city)} onChange={() => toggleCity(city)} /><span>{city}</span></label>)}</div></div>
    <div><div className="flex justify-between gap-3"><div><p className="text-sm font-bold text-[#34445f]">2. Selecione os pedidos</p><p className="mt-1 text-xs text-stone-500">Mostrando confirmados ou separados das cidades escolhidas.</p></div><span className="text-xs font-bold text-[#A95765]">{chosen.length} pedidos · {money(chosen.reduce((sum, order) => sum + Number(order.total), 0))}</span></div><div className="mt-3 max-h-64 space-y-2 overflow-auto rounded-xl border border-[#eadadd] p-3">{cities.length === 0 ? <p className="text-xs text-stone-500">Escolha uma ou mais cidades para ver os pedidos disponíveis.</p> : available.length === 0 ? <p className="text-xs text-stone-500">Nenhum pedido confirmado ou separado nestas cidades.</p> : available.map((order) => <label key={order.id} className="flex gap-2 rounded-lg bg-stone-50 p-2 text-xs"><input type="checkbox" name="order_ids" value={order.id} checked={selected.includes(order.id)} onChange={() => toggleOrder(order.id)} /><span><b>{order.customer_name}</b> · {order.city}<br />{order.address}<br /><span className="font-bold text-[#A95765]">{money(Number(order.total))}</span></span></label>)}</div></div>
    <button disabled={!cities.length || !selected.length} className="w-full rounded-xl bg-[#a95765] py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Criar rota e gerar romaneio</button>
  </form>;
}
