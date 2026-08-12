"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { createPublicSupabaseClient } from "@/lib/supabase/client";

const documents = [
  ["identidade_frente", "Identidade — frente"],
  ["identidade_verso", "Identidade — verso"],
  ["cpf_cnpj", "CPF ou CNPJ"],
  ["comprovante_residencia", "Comprovante de endereço"],
] as const;

export default function ResellerDocuments({ onComplete }: { onComplete?: () => void }) {
  const supabase = useMemo(() => createPublicSupabaseClient(), []);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState("");

  async function upload(type: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !supabase) return;
    if (file.size > 10 * 1024 * 1024) { setMessage("Cada arquivo pode ter no máximo 10 MB."); return; }
    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) { setMessage("Envie JPG, PNG ou PDF."); return; }
    setSending(type); setMessage("");
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) { setMessage("Faça login novamente para enviar documentos."); setSending(""); return; }
    const extension = file.name.split(".").pop() || "file";
    const path = `${user.id}/${type}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("reseller-documents").upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError) { setMessage(uploadError.message); setSending(""); return; }
    const { error } = await supabase.from("reseller_documents").upsert({ user_id: user.id, document_type: type, file_path: path, file_name: file.name, status: "pendente", admin_notes: null }, { onConflict: "user_id,document_type" });
    if (error) { setMessage(error.message); setSending(""); return; }
    const { count } = await supabase.from("reseller_documents").select("id", { count: "exact", head: true }).eq("user_id", user.id);
    if ((count ?? 0) >= documents.length) {
      onComplete?.();
    } else {
      setMessage("Documento enviado com segurança. Envie os demais para concluir sua solicitação.");
    }
    setSending("");
  }

  return <section className="mt-5 rounded-2xl border border-[#ead8d2] bg-white p-5"><h2 className="font-serif text-xl font-bold text-[#34445f]">Documentos para análise de revendedor</h2><p className="mt-2 text-xs leading-relaxed text-stone-600">Envie JPG, PNG ou PDF de até 10 MB. Os arquivos ficam privados e disponíveis apenas para análise da Talita Vitória.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{documents.map(([type, title]) => <label key={type} className="rounded-xl border border-dashed border-[#d9bec2] p-3 text-sm font-bold text-[#34445f]">{title}<input type="file" accept="image/jpeg,image/png,application/pdf" className="mt-2 block w-full text-xs font-normal" onChange={(event) => upload(type, event)} disabled={Boolean(sending)} />{sending === type && <span className="mt-2 block text-xs text-[#A95765]">Enviando…</span>}</label>)}</div>{message && <p className="mt-3 text-xs font-bold text-[#A95765]">{message}</p>}</section>;
}
