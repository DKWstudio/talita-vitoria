"use client";

type Order = { id: string; customer_name: string; whatsapp: string; city: string; delivery_type: string; profile: string; status: string; total: number; delivery_date: string | null; created_at: string };
type User = { nome_completo: string; email: string; telefone: string; cidade: string; perfil: string; solicitou_revendedor: boolean; revendedor_status: string };
type Route = { name: string; delivery_date: string; region: string | null; driver_name: string | null; status: string; delivery_route_orders: { order_id: string }[] };

const csv = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const download = (fileName: string, headers: string[], rows: unknown[][]) => {
  const content = "\uFEFF" + [headers, ...rows].map((row) => row.map(csv).join(";")).join("\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

export default function AdminExportButtons({ orders, users, routes }: { orders: Order[]; users: User[]; routes: Route[] }) {
  return <div className="flex flex-wrap gap-2 rounded-2xl border border-[#eadadd] bg-white p-4 shadow-sm"><div className="mr-auto"><p className="text-sm font-bold text-[#34445f]">{"Relat\u00f3rios e exporta\u00e7\u00e3o"}</p><p className="text-xs text-stone-500">{"Baixe arquivos CSV compat\u00edveis com Excel e Google Planilhas."}</p></div><button onClick={() => download("pedidos-talita-vitoria.csv", ["Pedido", "Cliente", "WhatsApp", "Cidade", "Entrega", "Perfil", "Status", "Total", "Data do pedido", "Previs\u00e3o de entrega"], orders.map((item) => [item.id, item.customer_name, item.whatsapp, item.city, item.delivery_type, item.profile, item.status, Number(item.total).toFixed(2).replace(".", ","), new Date(item.created_at).toLocaleDateString("pt-BR"), item.delivery_date ? new Date(`${item.delivery_date}T12:00:00`).toLocaleDateString("pt-BR") : ""]))} className="rounded-xl bg-[#34445f] px-3 py-2 text-xs font-bold text-white">Exportar pedidos</button><button onClick={() => download("cadastros-talita-vitoria.csv", ["Nome", "E-mail", "Telefone", "Cidade", "Perfil", "Solicitou revenda", "Status da revenda"], users.map((item) => [item.nome_completo, item.email, item.telefone, item.cidade, item.perfil, item.solicitou_revendedor ? "Sim" : "N\u00e3o", item.revendedor_status]))} className="rounded-xl border border-[#34445f] px-3 py-2 text-xs font-bold text-[#34445f]">Exportar cadastros</button><button onClick={() => download("rotas-talita-vitoria.csv", ["Rota", "Data", "Cidades", "Respons\u00e1vel", "Status", "Pedidos vinculados"], routes.map((item) => [item.name, new Date(`${item.delivery_date}T12:00:00`).toLocaleDateString("pt-BR"), item.region, item.driver_name, item.status, item.delivery_route_orders.length]))} className="rounded-xl border border-[#a95765] px-3 py-2 text-xs font-bold text-[#a95765]">Exportar rotas</button></div>;
}
