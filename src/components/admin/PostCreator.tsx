"use client";

import { useMemo, useRef, useState } from "react";
import type { ManagedProduct } from "@/components/admin/ProductsAdmin";

type Format = "post" | "story" | "whatsapp";
const dimensions: Record<Format, [number, number]> = { post: [1080, 1350], story: [1080, 1920], whatsapp: [1080, 1920] };

function drawCover(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
  const scale = Math.max(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

export default function PostCreator({ products }: { products: ManagedProduct[] }) {
  const available = useMemo(() => products.filter((product) => product.is_active && product.image_url), [products]);
  const [productId, setProductId] = useState(available[0]?.id ?? "");
  const [format, setFormat] = useState<Format>("post");
  const [audience, setAudience] = useState<"cliente" | "revendedor">("cliente");
  const [showPrice, setShowPrice] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const product = available.find((item) => item.id === productId) ?? available[0];
  const price = product ? Number(audience === "cliente" ? product.preco_cliente_base : product.preco_revendedor_atacado) : 0;
  const money = price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const productUrl = product?.product_url ?? "";
  const priceText = audience === "cliente" ? `Valor para cliente: ${money}.` : `Condições especiais para revenda: ${money}.`;
  const caption = product ? `✨ ${product.title}\n\n${product.description || "Enxovais e detalhes escolhidos com carinho para sua casa."}${showPrice ? `\n\n${priceText}` : `\n\n📲 Digite *${product.title}* para valores!`}\n\nWhatsApp: (49) 98856-8055\n🔗 ${productUrl}\n\n#TalitaVitoria #BordadosVitoria #Enxovais #CamaMesaEBanho #Chapeco` : "";

  function createImage() {
    if (!product || !canvasRef.current) return;
    const [width, height] = dimensions[format];
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#fbf5f2";
    context.fillRect(0, 0, width, height);
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const imageHeight = format === "post" ? 890 : 1370;
      context.save(); context.beginPath(); context.rect(0, 0, width, imageHeight); context.clip();
      drawCover(context, image, width, imageHeight); context.restore();
      context.fillStyle = "#34445f"; context.fillRect(0, imageHeight - 30, width, height - imageHeight + 30);
      context.fillStyle = "#f1c1c8"; context.font = "bold 31px Arial"; context.fillText("TALITA VITÓRIA", 72, imageHeight + 76);
      context.fillStyle = "#ffffff"; context.font = "bold 56px Georgia";
      const words = product.title.split(" "); let line = ""; let y = imageHeight + 155;
      words.forEach((word) => { const next = `${line}${line ? " " : ""}${word}`; if (context.measureText(next).width > width - 144 && line) { context.fillText(line, 72, y); y += 66; line = word; } else line = next; });
      if (line) context.fillText(line, 72, y);
      const cta = showPrice ? (audience === "cliente" ? `A partir de ${money}` : "Condições para revenda") : `Digite ${product.title} para valores!`;
      context.fillStyle = "#f1c1c8"; context.font = `bold ${cta.length > 38 ? 29 : 38}px Arial`;
      context.fillText(cta, 72, height - 88);
      const download = () => { const anchor = document.createElement("a"); anchor.download = `${product.product_url.split("/").pop() || "produto"}-${format}.png`; anchor.href = canvas.toDataURL("image/png"); anchor.click(); };
      const logo = new Image(); logo.onload = () => { context.drawImage(logo, width - 150, imageHeight + 35, 80, 80); download(); }; logo.onerror = download; logo.src = "/brand/talita-vitoria-icon.png";
    };
    image.src = product.image_url!;
  }

  async function copyCaption() {
    await navigator.clipboard.writeText(caption.replace(productUrl, `${window.location.origin}${productUrl}`));
    window.alert("Legenda copiada. Agora é só colar na sua rede social.");
  }

  if (!available.length) return <section data-admin-tab="postagens" className="rounded-2xl border border-dashed p-6 text-sm text-stone-500">Sincronize e ative produtos com foto para criar postagens.</section>;

  return <section data-admin-tab="postagens" className="space-y-4"><div><h2 className="font-serif text-2xl font-bold text-[#34445f]">Criador de postagens</h2><p className="mt-1 text-sm text-stone-500">Baixe a arte pronta e copie a legenda para publicar onde desejar.</p></div><div className="grid gap-5 rounded-2xl bg-white p-5 shadow-sm lg:grid-cols-[1fr_auto]"><div className="grid gap-3"><label className="text-sm font-bold">Produto<select value={productId} onChange={(event) => setProductId(event.target.value)} className="field mt-1 w-full">{available.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold">Formato<select value={format} onChange={(event) => setFormat(event.target.value as Format)} className="field mt-1 w-full"><option value="post">Instagram Post (1080×1350)</option><option value="story">Instagram Story (1080×1920)</option><option value="whatsapp">WhatsApp Status (1080×1920)</option></select></label><label className="text-sm font-bold">Público<select value={audience} onChange={(event) => setAudience(event.target.value as "cliente" | "revendedor")} disabled={!showPrice} className="field mt-1 w-full disabled:opacity-50"><option value="cliente">Cliente</option><option value="revendedor">Revendedor</option></select></label></div><label className="flex items-center gap-2 text-sm font-bold text-stone-700"><input type="checkbox" checked={showPrice} onChange={(event) => setShowPrice(event.target.checked)} /> Exibir valor na arte e na legenda</label><p className="-mt-1 text-xs text-stone-500">Por padrão o valor fica oculto e a chamada convida a falar no WhatsApp.</p><div className="flex flex-wrap gap-2 pt-2"><button type="button" onClick={createImage} className="rounded-xl bg-[#a95765] px-4 py-3 text-sm font-bold text-white">Baixar arte em PNG</button><button type="button" onClick={copyCaption} className="rounded-xl border border-[#34445f] px-4 py-3 text-sm font-bold text-[#34445f]">Copiar legenda</button></div></div>{product?.image_url && <img src={product.image_url} alt="Prévia do produto" className="h-64 w-52 rounded-xl object-cover shadow-sm" />}</div><div className="rounded-2xl border border-[#eadadd] bg-[#fffafa] p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#a95765]">Legenda gerada</p><pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-stone-700">{caption}</pre></div><canvas ref={canvasRef} className="hidden" /></section>;
}
