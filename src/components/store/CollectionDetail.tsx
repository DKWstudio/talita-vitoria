"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Expand, LockKeyhole, ShoppingBag, X } from "lucide-react";
import { createPublicSupabaseClient } from "@/lib/supabase/client";
import type { Collection, CollectionOption } from "@/data/collections";
import type { CatalogProduct, UserProfile } from "@/types/product";

const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export default function CollectionDetail({ collection }: { collection: Collection }) {
  const supabase = useMemo(() => createPublicSupabaseClient(), []);
  const groups = Array.from(new Set(collection.options.map((option) => option.group)));
  const first = collection.options[0];
  const isCurtain = first.group === "Cortina";
  const isKitchen = first.group === "Toalha de Mesa" || first.group === "Tapete de Cozinha";
  const isPillow = first.group === "Kit de Almofadas";
  const displayName = isCurtain || isKitchen || isPillow ? collection.name : `Linha ${collection.name}`;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [group, setGroup] = useState(first.group);
  const [variant, setVariant] = useState(first.variant ?? "");
  const [packageLabel, setPackageLabel] = useState(first.packageLabel);
  const [selectedId, setSelectedId] = useState(first.id);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const variants = Array.from(new Set(collection.options.map((option) => option.variant).filter((item): item is string => Boolean(item))));
  const packages = Array.from(new Set(collection.options.filter((option) => option.group === group && (option.variant ?? "") === variant).map((option) => option.packageLabel)));
  const groupOptions = collection.options.filter((option) => option.group === group && (option.variant ?? "") === variant && option.packageLabel === packageLabel);
  const selected = collection.options.find((option) => option.id === selectedId) ?? groupOptions[0];
  const price = profile === "revendedor" ? selected.resellerPrice : selected.customerPrice;

  useEffect(() => {
    if (!supabase) return;
    const loadProfile = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { setProfile(null); return; }
      const { data: user } = await supabase.from("users").select("perfil").eq("id", data.user.id).single();
      setProfile(user?.perfil === "revendedor" ? "revendedor" : "cliente");
    };
    loadProfile();
    const { data } = supabase.auth.onAuthStateChange(loadProfile);
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  function chooseGroup(nextGroup: CollectionOption["group"]) {
    setGroup(nextGroup);
    const option = collection.options.find((item) => item.group === nextGroup && (item.variant ?? "") === variant);
    if (option) { setPackageLabel(option.packageLabel); setSelectedId(option.id); }
  }

  function choosePackage(nextPackage: string) {
    setPackageLabel(nextPackage);
    const option = collection.options.find((item) => item.group === group && (item.variant ?? "") === variant && item.packageLabel === nextPackage);
    if (option) setSelectedId(option.id);
  }

  function chooseVariant(nextVariant: string) {
    setVariant(nextVariant);
    const option = collection.options.find((item) => (item.variant ?? "") === nextVariant && item.group === group) ?? collection.options.find((item) => (item.variant ?? "") === nextVariant);
    if (option) { setGroup(option.group); setPackageLabel(option.packageLabel); setSelectedId(option.id); }
  }

  function addToCart() {
    const material = selected.group === "Cobre Leito" || selected.group === "Kit Infantil" || selected.group === "Jogo de Banheiro" || selected.group === "Cortina" || selected.group === "Toalha de Mesa" || selected.group === "Tapete de Cozinha" || selected.group === "Kit de Almofadas" ? collection.coverFabric : selected.group === "Jogo de Lençol" ? collection.sheetFabric : "100% algodão";
    const product: CatalogProduct = {
      id: `${collection.slug}-${selected.id}`,
      title: `${displayName}${selected.variant ? ` — ${selected.variant}` : ""} — ${selected.group} ${selected.packageLabel} — ${selected.size}`,
      description: `${material}, ${collection.color}`, category: selected.group === "Kit de Almofadas" ? "Almofadas" : selected.group === "Toalha de Mesa" || selected.group === "Tapete de Cozinha" ? "Cozinha" : selected.group === "Cortina" ? "Cortinas" : selected.group === "Jogo de Banheiro" ? "Banheiro" : selected.group === "Kit Infantil" ? "Infantil" : selected.group === "Jogo de Toalha" ? "Toalhas" : selected.group === "Jogo de Lençol" ? "Lençóis" : "Cobre Leito",
      price: selected.customerPrice, preco_cliente_base: selected.customerPrice, preco_revendedor_atacado: selected.resellerPrice,
      image_url: collection.image, product_url: `/produto/${collection.slug}`,
    };
    const stored = localStorage.getItem("talita-vitoria-cart");
    const cart: Array<{ product: CatalogProduct; quantity: number }> = stored ? JSON.parse(stored) : [];
    const existing = cart.find((line) => line.product.id === product.id);
    if (existing) existing.quantity += 1; else cart.push({ product, quantity: 1 });
    localStorage.setItem("talita-vitoria-cart", JSON.stringify(cart));
    setAdded(true); window.setTimeout(() => setAdded(false), 1800);
  }

  function requestQuote() {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5549999999999";
    const text = `Olá, Talita! Gostaria de consultar os valores e a disponibilidade de ${displayName}, ${selected.group} ${selected.packageLabel}, tamanho ${selected.size}.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  const fabric = selected.group === "Cobre Leito" || selected.group === "Kit Infantil" || selected.group === "Jogo de Banheiro" || selected.group === "Cortina" || selected.group === "Toalha de Mesa" || selected.group === "Tapete de Cozinha" || selected.group === "Kit de Almofadas" ? collection.coverFabric : selected.group === "Jogo de Lençol" ? collection.sheetFabric : "100% algodão";
  const highlights = ["Acabamento Bordados Vitória", `Modelo ${collection.color.toLowerCase()}`, "Pré-venda com atendimento personalizado"];

  return <main className="min-h-screen bg-[#fffaf5] text-[#3f3a39]">
    <header className="border-b border-[#ecd9d1] bg-white/90"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4"><a href="/" className="flex items-center gap-2 text-sm font-bold text-[#A95765]"><ArrowLeft size={18} /> Voltar à vitrine</a><img src="/brand/bordados-vitoria.png" alt="Bordados Vitória" className="h-10 w-auto object-contain" /></div></header>
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-14">
      <section><button onClick={() => setCatalogOpen(true)} className="group relative block aspect-[1.43] w-full overflow-hidden rounded-[2rem] bg-[#f4e8e0] text-left shadow-xl"><img src={collection.image} alt={`Produto ${collection.name}`} style={{ objectPosition: collection.imagePosition ?? "center" }} className={`h-full w-full transition duration-500 group-hover:scale-[1.02] ${collection.slug.startsWith("banheiro-") ? "object-contain" : "object-cover"}`} /><span className="absolute bottom-5 left-5 rounded-xl bg-white/95 px-5 py-3 font-serif text-2xl font-bold text-[#4B5A72] shadow-lg">{collection.name}</span><span className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-xs font-bold text-white"><Expand size={15} /> Ver página do catálogo</span></button><p className="mt-3 text-center text-xs text-stone-500">Clique na foto para consultar a página {String(collection.page).padStart(2, "0")} completa do catálogo.</p></section>
      <section><p className="text-xs font-black uppercase tracking-[.22em] text-[#A95765]">{isCurtain ? "Cortinas Bordados Vitória" : isKitchen ? "Cozinha Bordados Vitória" : isPillow ? "Almofadas Bordados Vitória" : `Coleção ${collection.name}`}</p><h1 className="mt-2 font-serif text-4xl font-bold leading-tight md:text-5xl">{displayName}</h1><p className="mt-4 leading-relaxed text-stone-600">Escolha entre os produtos e tamanhos disponíveis após o cruzamento do catálogo com as listas oficiais de preços 2026.</p><div className="mt-6 flex flex-wrap gap-2"><div className="flex items-center gap-2 rounded-xl bg-[#f8e8e4] px-3 py-2 text-xs font-semibold text-[#7f4650]"><Check size={14} /> Bordados Vitória</div><div className="flex items-center gap-2 rounded-xl bg-[#f8e8e4] px-3 py-2 text-xs font-semibold text-[#7f4650]"><Check size={14} /> Entrega combinada</div></div>
        {variants.length > 0 && <div className="mt-8"><p className="text-sm font-bold">Escolha o modelo</p><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{variants.map((item) => <button key={item} onClick={() => chooseVariant(item)} className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${variant === item ? "border-[#A95765] bg-[#A95765] text-white" : "border-[#ead8d2] bg-white text-stone-600 hover:border-[#A95765]"}`}>{item}</button>)}</div></div>}
        <div className={variants.length > 0 ? "mt-6" : "mt-8"}><p className="text-sm font-bold">Escolha o produto</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{groups.map((item) => <button key={item} onClick={() => chooseGroup(item)} className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${group === item ? "border-[#A95765] bg-[#A95765] text-white" : "border-[#ead8d2] bg-white text-stone-600 hover:border-[#A95765]"}`}>{item}</button>)}</div></div>
        {packages.length > 1 && <div className="mt-6"><p className="text-sm font-bold">Escolha a composição</p><div className="mt-3 flex gap-2">{packages.map((item) => <button key={item} onClick={() => choosePackage(item)} className={`min-w-28 rounded-xl border px-4 py-3 text-sm font-bold ${packageLabel === item ? "border-[#A95765] bg-[#f8e8e4] text-[#8d4450]" : "border-[#ead8d2] bg-white text-stone-600"}`}>{item}</button>)}</div></div>}
        <div className="mt-6"><p className="text-sm font-bold">Escolha o tamanho</p><div className="mt-3 flex flex-wrap gap-2">{groupOptions.map((option) => <button key={option.id} onClick={() => setSelectedId(option.id)} className={`min-w-28 rounded-xl border px-4 py-3 text-sm font-bold ${selected.id === option.id ? "border-[#A95765] bg-[#f8e8e4] text-[#8d4450]" : "border-[#ead8d2] bg-white text-stone-600"}`}>{option.size}</button>)}</div></div>
        <section className="mt-6 rounded-2xl border border-[#ead8d2] bg-white p-5"><h2 className="font-serif text-xl font-bold">Destaques do produto</h2><ul className="mt-3 space-y-2 text-sm text-stone-600">{highlights.map((highlight) => <li key={highlight}>• {highlight}</li>)}</ul></section>
        <section className="mt-4 rounded-2xl border border-[#ead8d2] bg-white p-5"><h2 className="font-serif text-xl font-bold">Características</h2><dl className="mt-3 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-stone-400">Tecido</dt><dd className="font-bold">{fabric}</dd></div><div><dt className="text-stone-400">Cor</dt><dd className="font-bold">{collection.color}</dd></div><div><dt className="text-stone-400">Produto</dt><dd className="font-bold">{selected.group}</dd></div><div><dt className="text-stone-400">Medida selecionada</dt><dd className="font-bold">{selected.size}</dd></div></dl></section>
        <section className="mt-4 rounded-2xl border border-[#ead8d2] bg-white p-5"><h2 className="font-serif text-xl font-bold">O que acompanha</h2><p className="mt-2 font-bold text-sm">{selected.variant && `${selected.variant} — `}{selected.group} {selected.packageLabel} — {selected.size}</p><ul className="mt-3 space-y-2 text-sm text-stone-600">{selected.details.map((detail) => <li key={detail}>• {detail}</li>)}</ul></section>
        <div className="mt-8 border-t border-[#ead8d2] pt-6">{collection.priceOnRequest ? <div className="font-bold text-[#A95765]">Preço e disponibilidade sob consulta com a representante</div> : profile ? <><p className="text-xs font-bold uppercase tracking-wider text-stone-400">Preço {profile}</p><p className="mt-1 text-3xl font-black text-[#A95765]">{money(price)}</p></> : <div className="flex items-center gap-2 font-bold text-[#A95765]"><LockKeyhole size={18} /> Preço disponível após o login</div>}<button onClick={collection.priceOnRequest ? requestQuote : addToCart} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#A95765] py-4 font-black text-white transition hover:bg-[#914653]"><ShoppingBag size={19} /> {collection.priceOnRequest ? "Consultar com a representante" : added ? "Adicionado ao carrinho!" : "Adicionar ao carrinho"}</button>{!profile && !collection.priceOnRequest && <p className="mt-3 text-center text-xs text-stone-500">Você pode montar o carrinho agora. O login será solicitado somente para visualizar preços e finalizar.</p>}</div>
      </section>
    </div>
    {catalogOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`Página ${collection.page} do catálogo ${collection.name}`}><button onClick={() => setCatalogOpen(false)} className="absolute right-4 top-4 z-10 rounded-full bg-white p-3 text-stone-800 shadow-xl" aria-label="Fechar catálogo"><X /></button><div className="max-h-full max-w-6xl overflow-auto rounded-2xl bg-white"><img src={collection.image} alt={`Página completa do catálogo da Linha ${collection.name}`} className="h-auto w-full" />{collection.extraImages?.map((image, index) => <img key={image} src={image} alt={`Continuação ${index + 1} da Linha ${collection.name} no catálogo`} className="h-auto w-full border-t border-stone-200" />)}</div></div>}
  </main>;
}
