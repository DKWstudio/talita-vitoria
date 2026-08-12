import { isAdminAuthenticated } from "@/lib/admin/auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  createDeliveryRoute,
  loginAdmin,
  logoutAdmin,
  updateOrder,
  updateReseller,
  updateRouteStatus,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type Item = { product_title: string; quantity: number };
type Order = { id: string; customer_name: string; whatsapp: string; address: string; city: string; delivery_type: string; profile: string; status: string; total: number; admin_notes: string | null; delivery_date: string | null; order_items: Item[] };
type User = { id: string; nome_completo: string; email: string; telefone: string; cidade: string; perfil: string; solicitou_revendedor: boolean; revendedor_status: string; admin_notes: string | null };
type Route = { id: string; name: string; delivery_date: string; region: string | null; driver_name: string | null; status: string; delivery_route_orders: { order_id: string; orders: { customer_name: string; city: string }[] }[] };

const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const statuses = ["novo", "em_contato", "confirmado", "separado", "saiu_para_entrega", "entregue", "cancelado"];
const label = (value: string) => ({ novo: "Novo", em_contato: "Em contato", confirmado: "Confirmado", separado: "Separado", saiu_para_entrega: "Saiu para entrega", entregue: "Entregue", cancelado: "Cancelado", planejada: "Planejada", em_rota: "Em rota", concluida: "Concluída", cancelada: "Cancelada", sob_consulta: "Sob consulta", propria: "Entrega própria" }[value] ?? value);
const profileStatus = (user: User) => user.solicitou_revendedor && user.revendedor_status === "pendente" ? "Aguardando análise" : user.perfil === "revendedor" && user.revendedor_status === "aprovado" ? "Aprovado" : user.solicitou_revendedor && user.revendedor_status === "reprovado" ? "Não aprovado" : "Ativo";

async function getData() {
  const db = createServiceSupabaseClient();
  const [orders, users, routes] = await Promise.all([
    db.from("orders").select("id,customer_name,whatsapp,address,city,delivery_type,profile,status,total,admin_notes,delivery_date,order_items(product_title,quantity)").order("created_at", { ascending: false }).limit(150),
    db.from("users").select("id,nome_completo,email,telefone,cidade,perfil,solicitou_revendedor,revendedor_status,admin_notes").order("created_at", { ascending: false }).limit(300),
    db.from("delivery_routes").select("id,name,delivery_date,region,driver_name,status,delivery_route_orders(order_id,orders(customer_name,city))").order("delivery_date", { ascending: true }),
  ]);
  if (orders.error) throw new Error(orders.error.message);
  if (users.error) throw new Error(users.error.message);
  if (routes.error) throw new Error(routes.error.message);
  return { orders: (orders.data ?? []) as unknown as Order[], users: (users.data ?? []) as unknown as User[], routes: (routes.data ?? []) as unknown as Route[] };
}

function AdminLogin() {
  return <main className="min-h-screen bg-[#34445f] px-4 py-16 text-white"><section className="mx-auto max-w-md rounded-3xl bg-white/10 p-7"><p className="text-xs font-bold uppercase tracking-[.24em] text-[#edb5bf]">Talita Vitória</p><h1 className="mt-2 font-serif text-3xl font-bold">Painel administrativo</h1><form action={loginAdmin} className="mt-6 space-y-4"><input name="password" type="password" required placeholder="Senha" className="w-full rounded-xl bg-white px-4 py-3 text-stone-900" /><button className="w-full rounded-xl bg-[#d98493] py-3 font-bold">Entrar</button></form></section></main>;
}

export default async function Admin() {
  if (!(await isAdminAuthenticated())) return <AdminLogin />;
  let data = { orders: [] as Order[], users: [] as User[], routes: [] as Route[] };
  let error = "";
  try { data = await getData(); } catch (exception) { error = exception instanceof Error ? exception.message : "Erro ao carregar dados"; }
  const activeOrders = data.orders.filter((order) => !["entregue", "cancelado"].includes(order.status));
  const pendingResellers = data.users.filter((user) => user.solicitou_revendedor && user.revendedor_status === "pendente");

  return <main className="min-h-screen bg-[#fffafa] px-4 py-7 text-stone-800"><section className="mx-auto max-w-7xl space-y-8">
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[#34445f] p-7 text-white"><div><p className="text-xs font-bold uppercase tracking-[.24em] text-[#edb5bf]">Talita Vitória</p><h1 className="mt-2 font-serif text-3xl font-bold">Central de vendas</h1><p className="mt-1 text-sm text-white/75">Pedidos, cadastros e planejamento de entregas.</p></div><form action={logoutAdmin}><button className="rounded-xl border border-white/30 px-4 py-2 text-sm font-bold">Sair</button></form></header>
    {error && <div className="rounded-2xl bg-amber-50 p-5 text-amber-900"><b>Banco precisa de atenção.</b><p className="mt-1">{error}</p><p className="mt-2 text-xs">Execute a migration <code>004_operations_dashboard.sql</code> no Supabase SQL Editor.</p></div>}
    <div className="grid gap-4 sm:grid-cols-4"><Metric title="Pedidos ativos" value={activeOrders.length} /><Metric title="Aguardando contato" value={data.orders.filter((order) => ["novo", "em_contato"].includes(order.status)).length} /><Metric title="Revendedores pendentes" value={pendingResellers.length} /><Metric title="Rotas planejadas" value={data.routes.filter((route) => ["planejada", "em_rota"].includes(route.status)).length} /></div>

    <section className="space-y-4"><Title title="Pedidos e atendimento" subtitle="Atualize status, data de entrega e observações em um único lugar." /><div className="overflow-x-auto rounded-2xl border border-[#eadadd] bg-white"><table className="min-w-[1100px] w-full text-left text-sm"><thead className="bg-[#fbf5f4] text-xs uppercase text-stone-500"><tr><th className="p-3">Cliente</th><th className="p-3">Itens</th><th className="p-3">Entrega</th><th className="p-3">Total</th><th className="p-3">Gestão</th></tr></thead><tbody className="divide-y">{data.orders.map((order) => <tr key={order.id} className="align-top"><td className="p-3"><b>{order.customer_name}</b><p className="text-xs text-stone-500">{order.city} · {order.profile}</p><a target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-700" href={`https://wa.me/${order.whatsapp.replace(/\D/g, "")}`}>WhatsApp</a></td><td className="p-3 text-xs">{order.order_items.map((item, index) => <p key={index}>{item.quantity}× {item.product_title}</p>)}</td><td className="p-3 text-xs">{label(order.delivery_type)}<br />{order.address}</td><td className="p-3 font-bold">{money(Number(order.total))}</td><td className="p-3"><form action={updateOrder} className="grid gap-2"><input name="id" type="hidden" value={order.id} /><select name="status" defaultValue={order.status} className="rounded border p-2 text-xs">{statuses.map((status) => <option key={status} value={status}>{label(status)}</option>)}</select><input name="delivery_date" type="date" defaultValue={order.delivery_date ?? ""} className="rounded border p-2 text-xs" /><input name="admin_notes" defaultValue={order.admin_notes ?? ""} placeholder="Observação interna" className="rounded border p-2 text-xs" /><button className="rounded bg-[#34445f] px-3 py-2 text-xs font-bold text-white">Salvar</button></form></td></tr>)}</tbody></table></div></section>

    <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]"><div><Title title="Criar rota de entrega" subtitle="Selecione pedidos próprios confirmados ou separados." /><form action={createDeliveryRoute} className="mt-4 space-y-3 rounded-2xl bg-white p-5 shadow-sm"><input name="name" required placeholder="Nome da rota (ex.: Oeste - quinta)" className="field" /><input name="delivery_date" type="date" required className="field" /><input name="region" placeholder="Região / cidades" className="field" /><input name="driver_name" placeholder="Responsável pela rota" className="field" /><textarea name="notes" placeholder="Observações" className="field min-h-20" /><div className="max-h-52 space-y-2 overflow-auto rounded-xl bg-stone-50 p-3">{data.orders.filter((order) => order.delivery_type === "propria" && ["confirmado", "separado"].includes(order.status)).map((order) => <label key={order.id} className="flex gap-2 text-xs"><input type="checkbox" name="order_ids" value={order.id} /><span><b>{order.customer_name}</b> — {order.city} ({money(Number(order.total))})</span></label>)}</div><button className="w-full rounded-xl bg-[#a95765] py-3 font-bold text-white">Criar rota</button></form></div><div><Title title="Rotas de entrega" subtitle="Planeje, inicie e conclua a rota. Ao concluir, os pedidos vinculados ficam como entregues." /><div className="mt-4 space-y-3">{data.routes.map((route) => <div key={route.id} className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex flex-wrap justify-between gap-3"><div><b>{route.name}</b><p className="text-xs text-stone-500">{new Date(`${route.delivery_date}T12:00:00`).toLocaleDateString("pt-BR")} · {route.region || "Região não informada"} · {route.driver_name || "Responsável não informado"}</p><p className="mt-2 text-xs">{route.delivery_route_orders.map((item) => `${item.orders[0]?.customer_name ?? "Pedido"} (${item.orders[0]?.city ?? ""})`).join(" · ") || "Sem pedidos vinculados"}</p></div><form action={updateRouteStatus} className="flex h-fit gap-2"><input name="id" type="hidden" value={route.id} /><select name="status" defaultValue={route.status} className="rounded border p-2 text-xs">{["planejada", "em_rota", "concluida", "cancelada"].map((status) => <option key={status} value={status}>{label(status)}</option>)}</select><button className="rounded bg-[#34445f] px-3 text-xs font-bold text-white">Salvar</button></form></div></div>)}{!data.routes.length && <p className="rounded-2xl border border-dashed p-6 text-sm text-stone-500">Nenhuma rota criada.</p>}</div></div></section>

    <section><Title title="Clientes e revendedores" subtitle="Cadastros da vitrine e solicitações de revenda." /><div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm"><table className="min-w-[1000px] w-full text-left text-sm"><thead className="bg-[#fbf5f4] text-xs uppercase text-stone-500"><tr><th className="p-3">Cadastro</th><th className="p-3">Contato</th><th className="p-3">Perfil</th><th className="p-3">Status do perfil</th><th className="p-3">Ação revendedor</th></tr></thead><tbody className="divide-y">{data.users.map((user) => { const status = profileStatus(user); return <tr key={user.id}><td className="p-3"><b>{user.nome_completo}</b><p className="text-xs text-stone-500">{user.cidade}</p></td><td className="p-3 text-xs">{user.email}<br />{user.telefone}</td><td className="p-3 text-xs font-bold">{user.perfil === "revendedor" ? "Revendedor" : "Cliente"}</td><td className="p-3 text-xs"><span className={`inline-flex rounded-full px-2.5 py-1 font-bold ${status === "Ativo" || status === "Aprovado" ? "bg-emerald-100 text-emerald-800" : status === "Aguardando análise" ? "bg-amber-100 text-amber-900" : "bg-stone-100 text-stone-700"}`}>{status}</span></td><td className="p-3">{user.revendedor_status === "pendente" ? <form action={updateReseller} className="flex gap-2"><input name="id" type="hidden" value={user.id} /><input name="admin_notes" placeholder="Observação" className="rounded border px-2 text-xs" /><button name="decision" value="aprovado" className="rounded bg-emerald-600 px-3 py-2 text-xs font-bold text-white">Aprovar</button><button name="decision" value="reprovado" className="rounded bg-stone-500 px-3 py-2 text-xs font-bold text-white">Recusar</button></form> : <span className="text-xs text-stone-400">Sem ação pendente</span>}</td></tr>; })}</tbody></table></div></section>
  </section></main>;
}

function Metric({ title, value }: { title: string; value: number }) { return <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-xs uppercase tracking-wider text-stone-500">{title}</p><p className="mt-2 text-3xl font-bold text-[#34445f]">{value}</p></div>; }
function Title({ title, subtitle }: { title: string; subtitle: string }) { return <div><h2 className="font-serif text-2xl font-bold text-[#34445f]">{title}</h2><p className="mt-1 text-sm text-stone-500">{subtitle}</p></div>; }
