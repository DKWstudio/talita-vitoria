"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminCookieName, getAdminSessionToken, isAdminAuthenticated, isValidAdminPassword } from "@/lib/admin/auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") throw new Error(`Campo obrigatório: ${key}`);
  return value.trim();
}

export async function loginAdmin(formData: FormData) {
  if (!isValidAdminPassword(requiredString(formData, "password"))) redirect("/admin?error=invalid-password");
  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, getAdminSessionToken(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12 });
  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(adminCookieName);
  redirect("/admin");
}

export async function updateOrderStatus(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const id = requiredString(formData, "id");
  const status = requiredString(formData, "status");
  if (!["novo", "em_contato", "confirmado", "entregue", "cancelado"].includes(status)) throw new Error("Status inválido");
  const { error } = await createServiceSupabaseClient().from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
