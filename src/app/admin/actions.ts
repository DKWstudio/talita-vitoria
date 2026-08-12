"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminCookieName, getAdminSessionToken, isAdminAuthenticated, isValidAdminPassword } from "@/lib/admin/auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string, required = true) {
  const item = formData.get(key);
  if (typeof item !== "string" || (required && !item.trim())) throw new Error(`Campo obrigatório: ${key}`);
  return typeof item === "string" ? item.trim() : "";
}
async function requireAdmin() { if (!(await isAdminAuthenticated())) redirect("/admin"); }
const refresh = () => revalidatePath("/admin");

export async function loginAdmin(formData: FormData) {
  if (!isValidAdminPassword(value(formData, "password"))) redirect("/admin?error=invalid-password");
  const store = await cookies();
  store.set(adminCookieName, getAdminSessionToken(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12 });
  redirect("/admin");
}
export async function logoutAdmin() { const store = await cookies(); store.delete(adminCookieName); redirect("/admin"); }

export async function updateOrder(formData: FormData) {
  await requireAdmin();
  const status = value(formData, "status");
  if (!["novo", "em_contato", "confirmado", "separado", "saiu_para_entrega", "entregue", "cancelado"].includes(status)) throw new Error("Status inválido");
  const { error } = await createServiceSupabaseClient().from("orders").update({ status, admin_notes: value(formData, "admin_notes", false) || null, delivery_date: value(formData, "delivery_date", false) || null, updated_at: new Date().toISOString() }).eq("id", value(formData, "id"));
  if (error) throw new Error(error.message); refresh();
}

export async function reviewResellerDocument(formData: FormData) {
  await requireAdmin();
  const status = value(formData, "status");
  if (!["aprovado", "rejeitado"].includes(status)) throw new Error("Status de documento inválido");
  const { error } = await createServiceSupabaseClient().from("reseller_documents").update({ status, admin_notes: value(formData, "admin_notes", false) || null, reviewed_at: new Date().toISOString() }).eq("id", value(formData, "id"));
  if (error) throw new Error(error.message); refresh();
}

export async function updateReseller(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  const decision = value(formData, "decision");
  if (!["aprovado", "reprovado"].includes(decision)) throw new Error("Decisão inválida");
  const db = createServiceSupabaseClient();
  if (decision === "aprovado") {
    const { count, error: documentsError } = await db.from("reseller_documents").select("id", { count: "exact", head: true }).eq("user_id", id).eq("status", "aprovado");
    if (documentsError) throw new Error(documentsError.message);
    if ((count ?? 0) < 4) throw new Error("A aprovação exige os quatro documentos marcados como aprovados.");
  }
  const payload = decision === "aprovado"
    ? { perfil: "revendedor", revendedor_status: "aprovado", revendedor_aprovado_em: new Date().toISOString(), admin_notes: value(formData, "admin_notes", false) || null }
    : { revendedor_status: "reprovado", admin_notes: value(formData, "admin_notes", false) || null };
  const { error } = await db.from("users").update(payload).eq("id", id);
  if (error) throw new Error(error.message); refresh();
}

export async function createDeliveryRoute(formData: FormData) {
  await requireAdmin();
  const db = createServiceSupabaseClient();
  const { data: route, error } = await db.from("delivery_routes").insert({ name: value(formData, "name"), delivery_date: value(formData, "delivery_date"), region: value(formData, "region", false) || null, driver_name: value(formData, "driver_name", false) || null, notes: value(formData, "notes", false) || null }).select("id").single();
  if (error || !route) throw new Error(error?.message ?? "Não foi possível criar a rota.");
  const orderIds = formData.getAll("order_ids").filter((id): id is string => typeof id === "string" && Boolean(id));
  if (orderIds.length) {
    const { error: itemsError } = await db.from("delivery_route_orders").insert(orderIds.map((order_id) => ({ route_id: route.id, order_id })));
    if (itemsError) throw new Error(itemsError.message);
    await db.from("orders").update({ status: "separado", delivery_date: value(formData, "delivery_date"), updated_at: new Date().toISOString() }).in("id", orderIds);
  }
  refresh();
}

export async function updateRouteStatus(formData: FormData) {
  await requireAdmin(); const status = value(formData, "status");
  if (!["planejada", "em_rota", "concluida", "cancelada"].includes(status)) throw new Error("Status inválido");
  const db = createServiceSupabaseClient(); const id = value(formData, "id");
  const { error } = await db.from("delivery_routes").update({ status, updated_at: new Date().toISOString() }).eq("id", id); if (error) throw new Error(error.message);
  if (status === "concluida") { const { data } = await db.from("delivery_route_orders").select("order_id").eq("route_id", id); if (data?.length) await db.from("orders").update({ status: "entregue", updated_at: new Date().toISOString() }).in("id", data.map((item) => item.order_id)); }
  refresh();
}
