"use client";

import { useState } from "react";

type GalleryImage = { url: string; path: string };

export default function ProductImagesUploader({ productId, images, action }: { productId: string; images: GalleryImage[]; action: (formData: FormData) => void | Promise<void> }) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [message, setMessage] = useState("");
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!files?.length) { event.preventDefault(); setMessage("Selecione ao menos uma imagem."); return; }
    if (files.length > 3) { event.preventDefault(); setMessage("Envie no máximo três imagens por vez."); return; }
    if ([...files].some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024)) { event.preventDefault(); setMessage("Use JPG, PNG ou WebP com até 8 MB por imagem."); }
  };
  return <details className="mt-4 rounded-xl border border-[#eadadd] p-3"><summary className="cursor-pointer text-sm font-bold text-[#34445f]">Fotos do produto ({images.length}/3)</summary><div className="mt-3 flex flex-wrap gap-2">{images.map((image, index) => <img key={image.url} src={image.url} alt={`Foto ${index + 1}`} className="h-16 w-16 rounded-lg object-cover" />)}{!images.length && <p className="text-xs text-stone-500">Ainda não há fotos enviadas pelo painel.</p>}</div><form action={action} onSubmit={submit} className="mt-3 grid gap-2"><input name="id" type="hidden" value={productId} /><input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => { setFiles(event.target.files); setMessage(""); }} className="field text-xs" /><p className="text-xs text-stone-500">Até 3 fotos por envio. A primeira se torna a foto principal da vitrine.</p><button className="rounded-xl border border-[#34445f] px-3 py-2 text-xs font-bold text-[#34445f]">Enviar e substituir fotos</button>{message && <p className="text-xs text-rose-700">{message}</p>}</form></details>;
}
