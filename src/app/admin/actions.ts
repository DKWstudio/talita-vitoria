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


export async function syncCatalogProducts() {
  await requireAdmin();
  const { talitaProducts } = await import("@/data/talitaProducts");
  const db = createServiceSupabaseClient();
  const rows = talitaProducts.map((product) => ({ id: product.id, title: product.name, description: product.description ?? null, category: product.category, image_url: product.image, product_url: product.url, preco_cliente_base: product.price, preco_revendedor_atacado: product.wholesalePrice ?? Number((product.price * 0.75).toFixed(2)) }));
  const { error } = await db.from("catalog_products").upsert(rows, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw new Error(error.message);
  refresh();
  redirect("/admin?aba=produtos");
}

export async function uploadProductImages(formData: FormData) {
  await requireAdmin();
  const db = createServiceSupabaseClient();
  const id = value(formData, "id");
  const files = formData.getAll("images").filter((item): item is File => item instanceof File && item.size > 0);
  if (!files.length || files.length > 3) throw new Error("Envie de uma a três imagens.");
  const uploaded: { url: string; path: string }[] = [];
  for (const file of files) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024) throw new Error("Use JPG, PNG ou WebP com até 8 MB.");
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = id + "/" + Date.now() + "-" + crypto.randomUUID() + "." + ext;
    const { error } = await db.storage.from("product-images").upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw new Error(error.message);
    const { data } = db.storage.from("product-images").getPublicUrl(path);
    uploaded.push({ path, url: data.publicUrl });
  }
  const { error } = await db.from("catalog_products").update({ image_url: uploaded[0].url, gallery_images: uploaded, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
  redirect("/admin?aba=produtos");
}

export async function updateCatalogProduct(formData: FormData) {
  await requireAdmin();
  const db = createServiceSupabaseClient();
  const id = value(formData, "id");
  const customer = Number(value(formData, "preco_cliente_base"));
  const reseller = Number(value(formData, "preco_revendedor_atacado"));
  if (!Number.isFinite(customer) || !Number.isFinite(reseller) || customer < 0 || reseller < 0) throw new Error("Pre?os inv?lidos.");
  const { data: previous, error: previousError } = await db.from("catalog_products").select("preco_cliente_base,preco_revendedor_atacado").eq("id", id).single();
  if (previousError || !previous) throw new Error(previousError?.message ?? "Produto n?o encontrado.");
  const payload = { title: value(formData, "title"), description: value(formData, "description", false) || null, category: value(formData, "category"), image_url: value(formData, "image_url", false) || null, preco_cliente_base: customer, preco_revendedor_atacado: reseller, is_active: formData.get("is_active") === "on", updated_at: new Date().toISOString() };
  const { error } = await db.from("catalog_products").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  if (Number(previous.preco_cliente_base) !== customer || Number(previous.preco_revendedor_atacado) !== reseller) await db.from("product_price_history").insert({ product_id: id, preco_cliente_anterior: previous.preco_cliente_base, preco_cliente_novo: customer, preco_revendedor_anterior: previous.preco_revendedor_atacado, preco_revendedor_novo: reseller });
  refresh();
  redirect("/admin?aba=produtos");
}

export async function updateOrder(formData: FormData) {
  await requireAdmin();
  const status = value(formData, "status");
  if (!["novo", "em_contato", "confirmado", "separado", "saiu_para_entrega", "entregue", "cancelado"].includes(status)) throw new Error("Status inválido");
  const db = createServiceSupabaseClient();
  const orderId = value(formData, "id");
  const adminNotes = value(formData, "admin_notes", false) || null;
  const deliveryDate = value(formData, "delivery_date", false) || null;
  const { error } = await db.from("orders").update({ status, admin_notes: adminNotes, delivery_date: deliveryDate, updated_at: new Date().toISOString() }).eq("id", orderId);
  if (error) throw new Error(error.message); refresh();
  const { error: historyError } = await db.from("order_history").insert({ order_id: orderId, status, admin_notes: adminNotes, delivery_date: deliveryDate });
  if (historyError) throw new Error(historyError.message);
  redirect("/admin?aba=pedidos");
}

export async function deleteOrder(formData: FormData) {
  await requireAdmin();
  const { error } = await createServiceSupabaseClient().from("orders").delete().eq("id", value(formData, "id"));
  if (error) throw new Error(error.message);
  refresh();
  redirect("/admin?aba=pedidos");
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
  const routeError = (message: string) => redirect(`/admin?aba=rotas&rota_erro=${encodeURIComponent(message)}`);
  const orderIds = Array.from(new Set(formData.getAll("order_ids").filter((id): id is string => typeof id === "string" && Boolean(id))));
  if (!orderIds.length) routeError("Selecione ao menos um pedido para criar a rota.");

  const { data: linkedOrders, error: linkedOrdersError } = await db.from("delivery_route_orders").select("order_id").in("order_id", orderIds);
  if (linkedOrdersError) routeError(`Não foi possível validar os pedidos: ${linkedOrdersError.message}`);
  if (linkedOrders?.length) routeError("Um ou mais pedidos selecionados já pertencem a outra rota. Atualize a página e escolha somente pedidos disponíveis.");

  const deliveryDate = value(formData, "delivery_date");
  const { data: route, error } = await db.from("delivery_routes").insert({ name: value(formData, "name"), delivery_date: deliveryDate, region: value(formData, "region", false) || null, driver_name: value(formData, "driver_name", false) || null, notes: value(formData, "notes", false) || null }).select("id").single();
  if (error || !route) routeError(error?.message ?? "Não foi possível criar a rota.");

  const routeId = route!.id;

  const { error: itemsError } = await db.from("delivery_route_orders").insert(orderIds.map((order_id) => ({ route_id: routeId, order_id })));
  if (itemsError) {
    await db.from("delivery_routes").delete().eq("id", routeId);
    routeError(`A rota não foi criada: ${itemsError.message}`);
  }

  const { error: ordersError } = await db.from("orders").update({ status: "separado", delivery_date: deliveryDate, updated_at: new Date().toISOString() }).in("id", orderIds);
  if (ordersError) {
    await db.from("delivery_routes").delete().eq("id", routeId);
    routeError(`A rota não foi criada: ${ordersError.message}`);
  }
  refresh();
  redirect("/admin?aba=rotas&rota_criada=1");
}

export async function deleteDeliveryRoute(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  const db = createServiceSupabaseClient();
  const { data: links, error: linksError } = await db.from("delivery_route_orders").select("order_id").eq("route_id", id);
  if (linksError) throw new Error(linksError.message);
  const orderIds = (links ?? []).map((item) => item.order_id);
  const { error } = await db.from("delivery_routes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (orderIds.length) {
    const { error: ordersError } = await db.from("orders").update({ status: "confirmado", delivery_date: null, updated_at: new Date().toISOString() }).in("id", orderIds);
    if (ordersError) throw new Error(ordersError.message);
  }
  refresh();
  redirect("/admin?aba=rotas");
}

export async function updateRouteStatus(formData: FormData) {
  await requireAdmin(); const status = value(formData, "status");
  if (!["planejada", "em_rota", "concluida", "cancelada"].includes(status)) throw new Error("Status inválido");
  const db = createServiceSupabaseClient(); const id = value(formData, "id");
  const { error } = await db.from("delivery_routes").update({ status, updated_at: new Date().toISOString() }).eq("id", id); if (error) throw new Error(error.message);
  if (status === "concluida") { const { data } = await db.from("delivery_route_orders").select("order_id").eq("route_id", id); if (data?.length) await db.from("orders").update({ status: "entregue", updated_at: new Date().toISOString() }).in("id", data.map((item) => item.order_id)); }
  refresh();
}
