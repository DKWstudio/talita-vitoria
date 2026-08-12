import { notFound } from "next/navigation";
import PrintButton from "@/components/admin/PrintButton";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default async function RoutePrint({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createServiceSupabaseClient();
  const { data: route, error } = await db.from("delivery_routes").select("id,name,delivery_date,region,driver_name,notes,status").eq("id", id).single();
  if (error || !route) notFound();
  const { data: links } = await db.from("delivery_route_orders").select("order_id").eq("route_id", id);
  const ids = (links ?? []).map((item) => item.order_id);
  const { data: orders } = ids.length ? await db.from("orders").select("id,customer_name,whatsapp,address,city,total").in("id", ids) : { data: [] };
  const { data: items } = ids.length ? await db.from("order_items").select("order_id,product_title,quantity").in("order_id", ids) : { data: [] };
  const orderRows = (orders ?? []).map((order) => ({ ...order, items: (items ?? []).filter((item) => item.order_id === order.id) }));
  return <main className="min-h-screen bg-white p-7 text-stone-900 print:p-4"><section className="mx-auto max-w-4xl"><div className="mb-6 flex items-start justify-between gap-4 border-b-2 border-[#34445f] pb-5"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#a95765]">Talita Vitória</p><h1 className="mt-1 font-serif text-3xl font-bold">Romaneio de entrega</h1><p className="mt-2 text-sm"><b>Rota:</b> {route.name}<br /><b>Data:</b> {new Date(`${route.delivery_date}T12:00:00`).toLocaleDateString("pt-BR")}<br /><b>Cidades:</b> {route.region || "Não informadas"}<br /><b>Responsável:</b> {route.driver_name || "Não informado"}</p></div><PrintButton /></div><p className="mb-5 text-sm"><b>Pedidos:</b> {orderRows.length} · <b>Total previsto:</b> {money(orderRows.reduce((sum, order) => sum + Number(order.total), 0))}</p><div className="space-y-4">{orderRows.map((order, index) => <article key={order.id} className="break-inside-avoid rounded-xl border border-stone-300 p-4"><div className="flex justify-between gap-4"><div><p className="font-bold">{index + 1}. {order.customer_name}</p><p className="mt-1 text-sm">{order.address}<br />{order.city}<br />WhatsApp: {order.whatsapp}</p></div><p className="font-bold">{money(Number(order.total))}</p></div><div className="mt-3 border-t pt-2 text-sm">{order.items.map((item, itemIndex) => <p key={itemIndex}>{item.quantity}× {item.product_title}</p>)}</div><div className="mt-4 border-t border-dashed pt-3 text-xs text-stone-500">Recebido por: ____________________________________ &nbsp; Data: ____/____/______</div></article>)}</div>{route.notes && <p className="mt-6 text-sm"><b>Observações:</b> {route.notes}</p>}</section></main>;
}
