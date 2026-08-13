"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Expand, LockKeyhole, ShoppingBag, X } from "lucide-react";
import { createPublicSupabaseClient } from "@/lib/supabase/client";
import { aliceDetails, aliceGroups, aliceOptions } from "@/data/aliceProduct";
import type { CatalogProduct, UserProfile } from "@/types/product";

const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export default function ProductDetail() {
  const supabase = useMemo(() => createPublicSupabaseClient(), []);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [group, setGroup] = useState(aliceGroups[0]);
  const [packageLabel, setPackageLabel] = useState(aliceOptions[0].packageLabel);
  const [selectedId, setSelectedId] = useState(aliceOptions[0].id);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const packages = Array.from(new Set(aliceOptions.filter((option) => option.group === group).map((option) => option.packageLabel)));
  const groupOptions = aliceOptions.filter((option) => option.group === group && option.packageLabel === packageLabel);
  const selected = aliceOptions.find((option) => option.id === selectedId) ?? groupOptions[0];
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

  function chooseGroup(nextGroup: (typeof aliceGroups)[number]) {
    setGroup(nextGroup);
    const first = aliceOptions.find((option) => option.group === nextGroup);
    if (first) { setPackageLabel(first.packageLabel); setSelectedId(first.id); }
  }

  function choosePackage(nextPackage: (typeof aliceOptions)[number]["packageLabel"]) {
    setPackageLabel(nextPackage);
    const first = aliceOptions.find((option) => option.group === group && option.packageLabel === nextPackage);
    if (first) setSelectedId(first.id);
  }

  function addToCart() {
    const product: CatalogProduct = {
      id: `${aliceDetails.id}-${selected.id}`,
      title: `${aliceDetails.name} — ${selected.group} ${selected.packageLabel} — ${selected.size}`,
      description: `${aliceDetails.material}, ${aliceDetails.color}`,
      category: selected.group === "Jogo de Toalha" ? "Toalhas" : selected.group === "Jogo de Lençol" ? "Lençóis" : "Cobre Leito",
      price: selected.customerPrice,
      preco_cliente_base: selected.customerPrice,
      preco_revendedor_atacado: selected.resellerPrice,
      image_url: aliceDetails.image,
      product_url: "/produto/alice",
    };
    const stored = localStorage.getItem("talita-vitoria-cart");
    const cart: Array<{ product: CatalogProduct; quantity: number }> = stored ? JSON.parse(stored) : [];
    const existing = cart.find((line) => line.product.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ product, quantity: 1 });
    localStorage.setItem("talita-vitoria-cart", JSON.stringify(cart));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <main className="min-h-screen bg-[#fffaf5] text-[#3f3a39]">
      <header className="border-b border-[#ecd9d1] bg-white/90"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4"><Link href="/" className="flex items-center gap-2 text-sm font-bold text-[#A95765]"><ArrowLeft size={18} /> Voltar à vitrine</Link><img src="/brand/bordados-vitoria.png" alt="Bordados Vitória" className="h-10 w-auto object-contain" /></div></header>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-14">
        <section>
          <button onClick={() => setCatalogOpen(true)} className="group relative block aspect-[1.43] w-full overflow-hidden rounded-[2rem] bg-[#f4e8e0] text-left shadow-xl">
            <img src={aliceDetails.image} alt="Cama vestida com a Linha Alice" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]" />
            <span className="absolute bottom-5 left-5 rounded-xl bg-white/95 px-5 py-3 font-serif text-2xl font-bold text-[#4B5A72] shadow-lg">Alice</span>
            <span className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-xs font-bold text-white"><Expand size={15} /> Ver página do catálogo</span>
          </button>
          <p className="mt-3 text-center text-xs text-stone-500">Clique na foto para consultar a página 04 completa do catálogo.</p>
        </section>

        <section>
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#A95765]">Coleção Alice</p>
          <h1 className="mt-2 font-serif text-4xl font-bold leading-tight md:text-5xl">Linha Alice</h1>
          <p className="mt-4 leading-relaxed text-stone-600">Escolha entre os produtos e tamanhos disponíveis após o cruzamento do catálogo com as listas oficiais de preços 2026.</p>
          <div className="mt-6 flex flex-wrap gap-2">{aliceDetails.benefits.map((benefit) => <div key={benefit} className="flex items-center gap-2 rounded-xl bg-[#f8e8e4] px-3 py-2 text-xs font-semibold text-[#7f4650]"><Check size={14} /> {benefit}</div>)}</div>

          <div className="mt-8"><p className="text-sm font-bold">Escolha o produto</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{aliceGroups.map((item) => <button key={item} onClick={() => chooseGroup(item)} className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${group === item ? "border-[#A95765] bg-[#A95765] text-white" : "border-[#ead8d2] bg-white text-stone-600 hover:border-[#A95765]"}`}>{item}</button>)}</div></div>
          {packages.length > 1 && <div className="mt-6"><p className="text-sm font-bold">Escolha a composição</p><div className="mt-3 flex gap-2">{packages.map((item) => <button key={item} onClick={() => choosePackage(item)} className={`min-w-28 rounded-xl border px-4 py-3 text-sm font-bold transition ${packageLabel === item ? "border-[#A95765] bg-[#f8e8e4] text-[#8d4450]" : "border-[#ead8d2] bg-white text-stone-600"}`}>{item}</button>)}</div></div>}
          <div className="mt-6"><p className="text-sm font-bold">Escolha o tamanho</p><div className="mt-3 flex flex-wrap gap-2">{groupOptions.map((option) => <button key={option.id} onClick={() => setSelectedId(option.id)} className={`min-w-28 rounded-xl border px-4 py-3 text-sm font-bold transition ${selected.id === option.id ? "border-[#A95765] bg-[#f8e8e4] text-[#8d4450]" : "border-[#ead8d2] bg-white text-stone-600"}`}>{option.size}</button>)}</div></div>

          <section className="mt-6 rounded-2xl border border-[#ead8d2] bg-white p-5"><h2 className="font-serif text-xl font-bold">Destaques do produto</h2><ul className="mt-3 space-y-2 text-sm text-stone-600">{aliceDetails.benefits.map((benefit) => <li key={benefit}>• {benefit}</li>)}</ul></section>
          <section className="mt-4 rounded-2xl border border-[#ead8d2] bg-white p-5"><h2 className="font-serif text-xl font-bold">O que acompanha</h2><p className="mt-2 font-bold">{selected.group} {selected.packageLabel} — {selected.size}</p><ul className="mt-3 space-y-2 text-sm text-stone-600">{selected.details.map((detail) => <li key={detail}>• {detail}</li>)}</ul><p className="mt-4 border-t border-stone-100 pt-3 text-[11px] leading-relaxed text-stone-400">{selected.sourceNote}</p></section>

          {selected.group === "Cobre Leito" && <section className="mt-4 rounded-2xl border border-[#ead8d2] bg-white p-5"><h2 className="font-serif text-xl font-bold">Características</h2><dl className="mt-3 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-stone-400">Tecido</dt><dd className="font-bold">{aliceDetails.material}</dd></div><div><dt className="text-stone-400">Cor</dt><dd className="font-bold">{aliceDetails.color}</dd></div><div><dt className="text-stone-400">Composição</dt><dd className="font-bold">{aliceDetails.composition}</dd></div><div><dt className="text-stone-400">Enchimento</dt><dd className="font-bold">{aliceDetails.filling}</dd></div></dl></section>}

          <div className="mt-8 border-t border-[#ead8d2] pt-6">
            {profile ? <><p className="text-xs font-bold uppercase tracking-wider text-stone-400">Preço {profile}</p><p className="mt-1 text-3xl font-black text-[#A95765]">{money(price)}</p></> : <div className="flex items-center gap-2 font-bold text-[#A95765]"><LockKeyhole size={18} /> Preço disponível após o login</div>}
            <button onClick={addToCart} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#A95765] py-4 font-black text-white transition hover:bg-[#914653]"><ShoppingBag size={19} /> {added ? "Adicionado ao carrinho!" : "Adicionar ao carrinho"}</button>
            {!profile && <p className="mt-3 text-center text-xs text-stone-500">Você pode montar o carrinho agora. O login será solicitado somente para visualizar preços e finalizar.</p>}
          </div>
        </section>
      </div>

      {catalogOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Página 04 do catálogo Alice"><button onClick={() => setCatalogOpen(false)} className="absolute right-4 top-4 z-10 rounded-full bg-white p-3 text-stone-800 shadow-xl" aria-label="Fechar catálogo"><X /></button><div className="max-h-full max-w-6xl overflow-auto rounded-2xl bg-white"><img src={aliceDetails.image} alt="Página 04 completa do catálogo da Linha Alice" className="h-auto w-full" /></div></div>}
    </main>
  );
}
