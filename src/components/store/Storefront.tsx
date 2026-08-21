"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Download, Instagram, LockKeyhole, LogIn, Minus, Plus, Search, ShoppingBag, Trash2, User, X } from "lucide-react";
import { createPublicSupabaseClient } from "@/lib/supabase/client";
import type { CatalogProduct, UserProfile } from "@/types/product";
import { hasTalitaDelivery, talitaDeliveryCities } from "@/data/deliveryCities";
import ResellerDocuments from "@/components/store/ResellerDocuments";
import AuthModalV3 from "@/components/store/AuthModalV3";
import CartDrawer from "@/components/store/CartDrawer";

type CartLine = { product: CatalogProduct; quantity: number };
type Account = { id: string; nome_completo: string; perfil: UserProfile; telefone?: string; endereco?: string; solicitouRevendedor?: boolean; revendedorStatus?: string };

const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const preferredCategories = ["Todos", "Cobre Leito", "Lençóis", "Toalhas", "Infantil", "Banheiro", "Cortinas", "Cozinha", "Almofadas"];

function priceFor(product: CatalogProduct, profile: UserProfile) {
  return profile === "revendedor"
    ? product.preco_revendedor_atacado ?? product.price
    : product.preco_cliente_base ?? product.price;
}

export default function Storefront({ products }: { products: CatalogProduct[] }) {
  const supabase = useMemo(() => createPublicSupabaseClient(), []);
  const [account, setAccount] = useState<Account | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [startRegistration, setStartRegistration] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [documentsCompleted, setDocumentsCompleted] = useState(false);
  const categories = useMemo(() => [
    ...preferredCategories.filter((item) => item === "Todos" || products.some((product) => product.category === item)),
    ...Array.from(new Set(products.map((product) => product.category))).filter((item) => !preferredCategories.includes(item)),
  ], [products]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "1") window.setTimeout(() => setAuthOpen(true), 0);
    const requestedCategory = params.get("categoria");
    if (requestedCategory && (requestedCategory === "Todos" || products.some((product) => product.category === requestedCategory))) window.setTimeout(() => setCategory(requestedCategory), 0);
    const saved = localStorage.getItem("talita-vitoria-cart");
    if (saved) try { const savedCart = JSON.parse(saved); window.setTimeout(() => setCart(savedCart), 0); } catch { localStorage.removeItem("talita-vitoria-cart"); }
    if (!supabase) return;
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      const { data: profile } = await supabase.from("users").select("id,nome_completo,perfil,telefone,logradouro,numero,bairro,cidade,cep,solicitou_revendedor,revendedor_status").eq("id", data.user.id).single();
      if (profile) setAccount({
        id: String(profile.id), nome_completo: String(profile.nome_completo),
        perfil: profile.perfil === "revendedor" ? "revendedor" : "cliente",
        solicitouRevendedor: Boolean(profile.solicitou_revendedor),
        revendedorStatus: String(profile.revendedor_status ?? ""),
        telefone: String(profile.telefone ?? ""),
        endereco: `${profile.logradouro}, ${profile.numero} · ${profile.bairro}, ${profile.cidade} · CEP ${profile.cep}`,
      });
    };
    load();
    const { data } = supabase.auth.onAuthStateChange(() => load());
    return () => data.subscription.unsubscribe();
  }, [supabase, products]);

  useEffect(() => { localStorage.setItem("talita-vitoria-cart", JSON.stringify(cart)); }, [cart]);

  const visible = products.filter((product) => {
    const text = `${product.title} ${product.description ?? ""}`.toLowerCase();
    return (category === "Todos" || product.category === category) && text.includes(query.toLowerCase());
  });
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const total = account ? cart.reduce((sum, line) => sum + priceFor(line.product, account.perfil) * line.quantity, 0) : 0;

  function add(product: CatalogProduct) {
    setCart((current) => current.some((line) => line.product.id === product.id)
      ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
      : [...current, { product, quantity: 1 }]);
    setCartOpen(true);
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#3f3a39]">
      <header className="sticky top-0 z-40 border-b border-[#ecd9d1] bg-[#fffaf5]/95 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 px-4 py-3 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/brand/bordados-vitoria.png" alt="Bordados Vitória" className="h-10 w-auto object-contain sm:h-12" />
          </div>
          <p className="order-3 col-span-2 text-center text-[10px] font-bold uppercase tracking-[.16em] text-[#A95765] md:order-none md:col-span-1 md:text-xs">
            Autorizada Bordados Vitória <span className="text-[#D3ABB1]">•</span> Chapecó e Região
          </p>
          <div className="flex items-center justify-end gap-2.5 sm:gap-4">
            <button onClick={() => account ? supabase?.auth.signOut().then(() => setAccount(null)) : (setStartRegistration(false), setAuthOpen(true))} className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-bold text-[#A95765] hover:bg-rose-50 sm:px-4 sm:text-sm">
              {account ? <User size={17} /> : <LogIn size={17} />}<span className="hidden sm:inline">{account ? account.nome_completo.split(" ")[0] : "Entrar"}</span>
            </button>
            {!account && <button onClick={() => { setStartRegistration(true); setAuthOpen(true); }} className="rounded-full border border-[#D3ABB1] px-3 py-2 text-xs font-bold text-[#A95765] hover:bg-rose-50 sm:px-4 sm:text-sm">Cadastrar</button>}
            <button onClick={() => setCartOpen(true)} aria-label={`Abrir carrinho com ${count} itens`} className="relative flex items-center gap-2 rounded-full bg-[#A95765] px-3 py-2.5 text-xs font-bold text-white sm:px-4 sm:text-sm"><ShoppingBag size={18} /><span className="hidden sm:inline">Carrinho</span>{count > 0 && <span className="rounded-full bg-white px-1.5 text-[11px] text-[#A95765]">{count}</span>}</button>
            <a href="https://www.instagram.com/bordadosvitoriavendas/" target="_blank" rel="noreferrer" aria-label="Instagram Talita Vitória" title="Instagram Talita Vitória" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e6c5ca] bg-white text-[#A95765] transition hover:bg-[#A95765] hover:text-white sm:h-10 sm:w-10"><Instagram size={19} /></a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#f4d6c7] via-[#fff8f1] to-[#efc2b1] text-[#343239]">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#d9a0aa]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-[#e99474]/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 md:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.2fr)] md:gap-14 md:py-20">
          <div className="relative flex justify-center md:justify-start"><img src="/brand/talita-vitoria-floral.jpeg" alt="Enxovais Talita Vitória" className="w-full max-w-[470px] rounded-[2rem] border border-white/70 object-cover shadow-[0_24px_70px_rgba(112,72,62,0.22)]" /></div>
          <div className="relative"><p className="mb-3 text-xs font-black uppercase tracking-[.25em] text-[#b85e68]">Chapecó e região</p><h1 className="font-serif text-4xl font-bold leading-tight text-[#343239] md:text-6xl">Delicadeza que transforma a sua casa.</h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-[#675b57] md:text-lg">Enxovais, bordados e detalhes escolhidos com carinho, atendimento próximo e entrega combinada diretamente com nossa consultora.</p><div className="mt-7 flex flex-wrap gap-3"><a href="/catalogo-bordados-vitoria-2026.pdf" download className="inline-flex items-center gap-2 rounded-xl bg-[#4B5A72] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-[#39475d]"><Download size={18} /> Baixar Catálogo 2026</a><button onClick={() => { setStartRegistration(true); setAuthOpen(true); }} className="rounded-xl border-2 border-[#A95765] bg-white/80 px-5 py-3 text-sm font-black text-[#A95765] shadow-sm transition hover:bg-[#A95765] hover:text-white">Quero Revender</button></div></div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar produtos..." className="w-full rounded-2xl border border-rose-100 bg-white py-3.5 pl-12 pr-4 outline-none focus:border-[#A95765]" /></div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold ${category === item ? "bg-[#A95765] text-white" : "border border-rose-100 bg-white text-stone-600"}`}>{item}</button>)}</div>
        </div>
        <div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#B67E89]">Nosso catálogo</p><h2 className="font-serif text-3xl font-bold">Escolha seus favoritos</h2></div><span className="text-sm text-stone-500">{visible.length} produtos</span></div>
        {visible.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-rose-200 bg-white p-12 text-center">Nenhum produto encontrado.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((product) => <CollectionCard key={product.id} product={product} />)}
          </div>
        )}
      </main>
      <section className="mx-auto mt-4 max-w-7xl px-4 pb-10"><div className="overflow-hidden rounded-[2rem] bg-[#4B5A72] px-6 py-8 text-white shadow-lg sm:px-10"><div className="grid items-center gap-6 md:grid-cols-[1fr_auto]"><div><p className="text-xs font-black uppercase tracking-[.22em] text-[#f0c1c8]">Parceria Talita Vitória</p><h2 className="mt-2 font-serif text-3xl font-bold">Quer revender Bordados Vitória?</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-100">Solicite seu cadastro de revendedor. Após análise cadastral e aprovação pela consultora, sua conta recebe acesso à tabela exclusiva de atacado.</p></div><button onClick={() => { setStartRegistration(true); setAuthOpen(true); }} className="rounded-xl bg-[#f1c1c8] px-6 py-4 text-sm font-black text-[#4B5A72] transition hover:bg-white">Quero ser revendedor</button></div></div></section>
      <footer className="mt-10 border-t-4 border-[#D3ABB1] bg-[#36445b] px-5 py-10 text-sm text-slate-200">
        <div className="mx-auto grid max-w-7xl items-center gap-9 text-center md:grid-cols-[1.1fr_0.75fr_0.85fr_0.9fr] md:text-left">
          <div className="order-1">
            <img src="/brand/talita-vitoria-floral.jpeg" alt="Enxovais Talita Vitória" className="mx-auto h-32 w-auto max-w-full rounded-xl object-cover shadow-lg" />
            <p className="mt-4 text-center text-xs leading-relaxed text-slate-300">Pré-venda sem pagamento online.<br />Valores, cobrança e entrega confirmados pela consultora.</p>
          </div>
          <div className="order-3 flex flex-col items-center justify-center md:px-6">
            <img src="/brand/bordados-vitoria.png" alt="Bordados Vitória" className="h-auto w-48 rounded-xl bg-white px-4 py-3 object-contain" />
            <p className="mt-4 text-center text-xs font-normal leading-relaxed text-slate-300">Revenda Autorizada Bordados Vitória • Chapecó e Região</p>
          </div>
          <div className="order-4 text-center">
            <p className="text-[11px] uppercase tracking-[.18em] text-slate-400">Desenvolvido por</p>
            <a href="https://dkworksstudio.base44.app/" target="_blank" rel="noopener noreferrer" aria-label="Conheça a DK Works Studio" className="mx-auto mt-3 block w-fit rounded-xl p-2 transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#D3ABB1]">
              <img src="/img/dkTransparente.png" alt="DK Works Studio" className="h-auto w-44 object-contain" />
            </a>
            <p className="mt-3 text-[10px] text-slate-500">© {new Date().getFullYear()} Talita Vitória. Todos os direitos reservados.</p>
          </div>
          <div className="order-2 text-center md:px-6 md:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-slate-400">Institucional</p>
            <nav className="mt-3 grid gap-2 text-xs text-slate-200">
              <a className="transition hover:text-[#f1c1c8]" href="/atendimento">Atendimento</a>
              <a className="transition hover:text-[#f1c1c8]" href="/quem-somos">Quem Somos</a>
              <a className="transition hover:text-[#f1c1c8]" href="/como-comprar">Como Comprar</a>
              <a className="transition hover:text-[#f1c1c8]" href="/politica-de-entrega">Política de Entrega</a>
              <a className="transition hover:text-[#f1c1c8]" href="/politica-de-trocas-e-devolucoes">Trocas e Devoluções</a>
              <a className="transition hover:text-[#f1c1c8]" href="/politica-de-privacidade">Política de Privacidade</a>
            </nav>
          </div>
        </div>
      </footer>
      {account?.solicitouRevendedor && account.revendedorStatus === "pendente" && !documentsCompleted && <div className="fixed bottom-4 left-4 z-30 w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-[#ead8d2] bg-white p-4 shadow-xl"><p className="font-serif font-bold text-[#34445f]">Solicitou cadastro de revendedor?</p><p className="mt-1 text-xs text-stone-600">Se esta solicitação foi feita no seu cadastro, envie os documentos para análise segura.</p><details className="mt-3"><summary className="cursor-pointer text-sm font-bold text-[#A95765]">Enviar documentos de revendedor</summary><ResellerDocuments onComplete={() => setDocumentsCompleted(true)} /></details></div>}{authOpen && <AuthModalV3 initialRegister={startRegistration} supabase={supabase} onClose={() => setAuthOpen(false)} />}
      {cartOpen && <CartDrawer supabase={supabase} account={account} cart={cart} total={total} onClose={() => setCartOpen(false)} setCart={setCart} onLogin={() => { setCartOpen(false); setAuthOpen(true); }} />}
    </div>
  );
}

function CollectionCard({ product }: { product: CatalogProduct }) {
  const detailsUrl = product.product_url?.startsWith("/produto/") ? product.product_url : null;
  const collectionName = product.title.startsWith("Linha ") ? product.title : product.title;
  const isBathroom = product.category === "Banheiro";
  const isCurtain = product.category === "Cortinas";
  const isKitchen = product.category === "Cozinha";

  return (
    <button
      type="button"
      onClick={() => { if (detailsUrl) window.location.href = `${detailsUrl}?categoria=${encodeURIComponent(product.category)}`; }}
      className={`group relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#eee3dc] text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${detailsUrl ? "cursor-pointer" : "cursor-default"}`}
      aria-label={detailsUrl ? `Abrir produtos da ${collectionName}` : collectionName}
    >
      {product.image_url ? (
        <img src={product.image_url} alt={collectionName} className={`absolute inset-x-0 top-0 w-full object-center transition duration-500 group-hover:scale-[1.02] ${isBathroom ? "h-[78%] object-contain p-2" : isCurtain ? "h-full object-contain" : isKitchen ? "h-full object-cover" : "h-[132%] object-cover"}`} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center"><ShoppingBag size={52} className="text-rose-200" /></div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#b96f78]/90 via-[#d99a9d]/65 to-transparent px-4 pb-5 pt-14 text-center">
        <h3 className="font-serif text-xl font-bold text-white sm:text-2xl">{collectionName}</h3>
      </div>
    </button>
  );
}

function AuthModal({ supabase, onClose }: { supabase: ReturnType<typeof createPublicSupabaseClient>; onClose: () => void }) {
  const [register, setRegister] = useState(false); const [seller, setSeller] = useState(false); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [registrationCity, setRegistrationCity] = useState(""); const [otherRegistrationCity, setOtherRegistrationCity] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!supabase) { setMessage("Configure o Supabase para habilitar o acesso."); return; }
    setBusy(true); setMessage(""); const form = new FormData(e.currentTarget); const email = String(form.get("email")); const password = String(form.get("password"));
    if (!register) { const { error } = await supabase.auth.signInWithPassword({ email, password }); setMessage(error ? "E-mail ou senha inválidos." : "Login realizado!"); if (!error) setTimeout(onClose, 500); }
    else { const metadata = Object.fromEntries(form.entries()); delete metadata.password; if (registrationCity === "Outra cidade") metadata.cidade = otherRegistrationCity.trim(); const { error } = await supabase.auth.signUp({ email, password, options: { data: { ...metadata, tipo_cadastro: seller ? "revendedor" : "cliente" } } }); setMessage(error ? error.message : "Cadastro recebido! Confira seu e-mail para confirmar o acesso."); }
    setBusy(false);
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="font-serif text-2xl font-bold text-[#A95765]">{register ? "Crie sua conta" : "Que bom ter você aqui"}</p><p className="text-sm text-stone-500">{register ? "Preencha seus dados para acessar os preços." : "Entre para ver preços e fazer sua pré-venda."}</p></div><button onClick={onClose}><X /></button></div><form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2">{register && <><input name="nome_completo" required placeholder="Nome completo" className="field sm:col-span-2" /><input name="telefone" required placeholder="Telefone / WhatsApp" className="field sm:col-span-2" /><input name="logradouro" required placeholder="Logradouro" className="field" /><input name="numero" required placeholder="Número" className="field" /><input name="bairro" required placeholder="Bairro" className="field" /><label className="text-sm font-bold sm:col-span-2">Cidade<select name="cidade" required value={registrationCity} onChange={(event) => setRegistrationCity(event.target.value)} className="field mt-1 w-full"><option value="">Selecione sua cidade</option>{talitaDeliveryCities.map((item) => <option key={item} value={item}>{item}</option>)}<option value="Outra cidade">Outra cidade</option></select></label>{registrationCity === "Outra cidade" && <><input required value={otherRegistrationCity} onChange={(event) => setOtherRegistrationCity(event.target.value)} placeholder="Digite sua cidade" className="field sm:col-span-2" /><div className="rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 sm:col-span-2"><strong>Entrega sob consulta:</strong> sua cidade não faz parte da nossa rota convencional. O frete, prazo e possibilidade de envio serão negociados e confirmados pela consultora.</div></>} {registrationCity && registrationCity !== "Outra cidade" && <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 sm:col-span-2"><strong>Entrega própria:</strong> sua cidade faz parte da rota de atendimento Talita Vitória.</div>}<input name="cep" required placeholder="CEP" className="field sm:col-span-2" /></>}<input name="email" type="email" required placeholder="E-mail" className="field sm:col-span-2" /><input name="password" type="password" minLength={6} required placeholder="Senha (mínimo 6 caracteres)" className="field sm:col-span-2" />{register && <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={seller} onChange={(e) => setSeller(e.target.checked)} /> Quero solicitar cadastro como revendedor</label>}{seller && register && <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900 sm:col-span-2">Após criar sua conta, a consultora solicitará identidade/CPF e comprovante de residência por um canal seguro. Seu perfil permanece cliente até aprovação.</div>}<button disabled={busy} className="rounded-xl bg-[#A95765] py-3 font-bold text-white sm:col-span-2">{busy ? "Aguarde..." : register ? "Criar cadastro" : "Entrar"}</button>{message && <p className="text-center text-sm text-[#A95765] sm:col-span-2">{message}</p>}</form><button onClick={() => { setRegister(!register); setMessage(""); }} className="mt-4 w-full text-sm font-bold text-[#A95765]">{register ? "Já tenho cadastro" : "Ainda não tenho cadastro"}</button></div></div>;
}

function AuthModalV2({ supabase, onClose }: { supabase: ReturnType<typeof createPublicSupabaseClient>; onClose: () => void }) {
  const [register, setRegister] = useState(false); const [purpose, setPurpose] = useState<"comprar" | "revender">("comprar"); const [city, setCity] = useState(""); const [otherCity, setOtherCity] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); if (!supabase) { setMessage("Configure o Supabase para habilitar o acesso."); return; } setBusy(true); const form = new FormData(e.currentTarget); const email = String(form.get("email")); const password = String(form.get("password")); if (!register) { const { error } = await supabase.auth.signInWithPassword({ email, password }); setMessage(error ? "E-mail ou senha inválidos." : "Login realizado!"); if (!error) setTimeout(onClose, 500); } else { const metadata = Object.fromEntries(form.entries()); delete metadata.password; metadata.cidade = city === "Outra cidade" ? otherCity.trim() : city; const { error } = await supabase.auth.signUp({ email, password, options: { data: { ...metadata, tipo_cadastro: purpose === "revender" ? "revendedor" : "cliente" } } }); setMessage(error ? error.message : "Cadastro recebido! Confira seu e-mail para confirmar o acesso."); } setBusy(false); }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="font-serif text-2xl font-bold text-[#A95765]">{register ? "Crie sua conta" : "Que bom ter você aqui"}</p><p className="text-sm text-stone-500">{register ? "Cadastre-se para comprar ou revender." : "Entre para ver preços e fazer sua pré-venda."}</p></div><button onClick={onClose}><X /></button></div><form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2">{register && <><input name="nome_completo" required placeholder="Nome completo" className="field sm:col-span-2"/><input name="telefone" required placeholder="Telefone / WhatsApp" className="field sm:col-span-2"/><input name="logradouro" required placeholder="Logradouro" className="field"/><input name="numero" required placeholder="Número" className="field"/><input name="bairro" required placeholder="Bairro" className="field"/><input name="cep" required placeholder="CEP" className="field"/><label className="text-sm font-bold sm:col-span-2">Como deseja usar a vitrine?<select name="intencao" value={purpose} onChange={(e) => setPurpose(e.target.value as "comprar" | "revender")} className="field mt-1 w-full"><option value="comprar">Quero comprar produtos</option><option value="revender">Quero revender Bordados Vitória</option></select></label><label className="text-sm font-bold sm:col-span-2">Cidade<select required value={city} onChange={(e) => setCity(e.target.value)} className="field mt-1 w-full"><option value="">Selecione sua cidade</option>{talitaDeliveryCities.map((item) => <option key={item}>{item}</option>)}<option>Outra cidade</option></select></label>{city === "Outra cidade" && <><input required value={otherCity} onChange={(e) => setOtherCity(e.target.value)} placeholder="Digite sua cidade" className="field sm:col-span-2"/><p className="rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 sm:col-span-2"><b>Entrega sob consulta:</b> esta cidade não faz parte da rota convencional. Frete, prazo e possibilidade de envio serão negociados com a consultora.</p></>}{city && city !== "Outra cidade" && <p className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 sm:col-span-2"><b>Entrega própria:</b> sua cidade faz parte da rota Talita Vitória.</p>}{purpose === "revender" && <div className="rounded-xl bg-[#fff5ec] p-4 text-xs leading-relaxed text-stone-700 sm:col-span-2"><p className="font-bold text-[#A95765]">Seja uma revendedora Bordados Vitória</p><p className="mt-2">Você recebe catálogo, lista de custo e sugestão de venda com margem de até 40%. O lucro é definido por você — não trabalhamos com comissão.</p><p className="mt-2">Pedidos a partir de R$ 1.600 têm entrega sem frete; a partir de R$ 600 há faturamento com taxa de frete. Em dinheiro, há 10% de desconto. Para pagamento a prazo, aceitamos cartão ou cheque mediante análise.</p><p className="mt-2">Após aprovação, você entra no grupo exclusivo de WhatsApp com novidades e promoções. Talita será sua representante para suporte e orientação. Para concluir o cadastro, solicitaremos identidade (frente e verso), CPF ou CNPJ e comprovante de endereço por canal seguro.</p></div>}</>}<input name="email" type="email" required placeholder="E-mail" className="field sm:col-span-2"/><input name="password" type="password" minLength={6} required placeholder="Senha (mínimo 6 caracteres)" className="field sm:col-span-2"/>{register && <p className="text-center text-[11px] leading-relaxed text-stone-500 sm:col-span-2">Ao continuar com o acesso, você concorda com a nossa <a href="/politica-de-privacidade" target="_blank" className="font-bold text-[#A95765] underline">Política de Privacidade</a>.</p>}<button disabled={busy} className="rounded-xl bg-[#A95765] py-3 font-bold text-white sm:col-span-2">{busy ? "Aguarde..." : register ? "Criar cadastro" : "Entrar"}</button>{message && <p className="text-center text-sm text-[#A95765] sm:col-span-2">{message}</p>}</form><button onClick={() => { setRegister(!register); setMessage(""); }} className="mt-4 w-full text-sm font-bold text-[#A95765]">{register ? "Já tenho cadastro" : "Ainda não tenho cadastro"}</button></div></div>;
}

function LegacyCartDrawer({ supabase, account, cart, total, onClose, setCart, onLogin }: { supabase: ReturnType<typeof createPublicSupabaseClient>; account: Account | null; cart: CartLine[]; total: number; onClose: () => void; setCart: React.Dispatch<React.SetStateAction<CartLine[]>>; onLogin: () => void }) {
  const [checkout, setCheckout] = useState(false);
  const [city, setCity] = useState("");
  const update = (id: string, delta: number) => setCart((lines) => lines.map((line) => line.product.id === id ? { ...line, quantity: line.quantity + delta } : line).filter((line) => line.quantity > 0));

  async function finish(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!account) return;
    const data = new FormData(e.currentTarget);
    const deliveryType = hasTalitaDelivery(city) ? "propria" : "sob_consulta";
    const items = cart.map((line) => `• ${line.quantity}x ${line.product.title} — ${money(priceFor(line.product, account.perfil) * line.quantity)}`).join("\n");
    if (!supabase) { window.alert("Não foi possível registrar sua pré-venda. Tente novamente."); return; }
    const { data: order, error } = await supabase.from("orders").insert({ user_id: account.id, customer_name: data.get("nome"), whatsapp: data.get("whatsapp"), address: data.get("endereco"), city, delivery_type: deliveryType, profile: account.perfil, total }).select("id").single();
    if (error || !order) { window.alert("Não foi possível registrar sua pré-venda. Tente novamente."); return; }
    const { error: itemsError } = await supabase.from("order_items").insert(cart.map((line) => ({ order_id: order.id, product_key: line.product.id, product_title: line.product.title, quantity: line.quantity, unit_price: priceFor(line.product, account.perfil) })));
    if (itemsError) { window.alert("Sua pré-venda foi criada, mas houve um erro ao salvar os itens. Avise a consultora."); }
    const deliveryMessage = deliveryType === "propria" ? "Entrega própria Talita Vitória disponível para esta cidade." : "Cidade atendida sob consulta; a consultora confirmará a entrega.";
    const text = `Olá, Talita! Quero finalizar esta pré-venda #${order.id.slice(0, 8)}.\n\nNome: ${data.get("nome")}\nWhatsApp: ${data.get("whatsapp")}\nEndereço: ${data.get("endereco")}\nCidade: ${city}\nPerfil: ${account.perfil}\n\nItens:\n${items}\n\nTotal: ${money(total)}\n\n${deliveryMessage}`;
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5549988568055";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return <div className="fixed inset-0 z-50 bg-black/40"><aside className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
    <div className="flex items-center justify-between border-b p-5"><div><h2 className="font-serif text-2xl font-bold">Sua pré-venda</h2><p className="text-xs text-stone-500">Monte seu carrinho antes de entrar.</p></div><button onClick={onClose}><X /></button></div>
    <div className="flex-1 overflow-y-auto p-5"><div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900"><strong>Importante:</strong> adicionar ao carrinho não garante reserva. A disponibilidade, os valores e a entrega serão confirmados pela consultora.</div>
      {cart.length === 0 ? <div className="mt-16 text-center text-stone-500"><ShoppingBag className="mx-auto mb-3" size={42} />Seu carrinho está vazio.</div>
      : checkout && account ? <form onSubmit={finish} className="space-y-4"><div className="rounded-2xl bg-rose-50 p-4 text-sm text-[#A95765]"><strong>Área de entrega:</strong> cidades listadas têm entrega própria Talita Vitória; demais localidades são atendidas sob consulta.</div><label className="block text-sm font-bold">Nome completo<input name="nome" required defaultValue={account.nome_completo} className="field mt-1 w-full" /></label><label className="block text-sm font-bold">WhatsApp<input name="whatsapp" required defaultValue={account.telefone} className="field mt-1 w-full" /></label><label className="block text-sm font-bold">Endereço de entrega<input name="endereco" required defaultValue={account.endereco} className="field mt-1 w-full" /></label><label className="block text-sm font-bold">Cidade<select required value={city} onChange={(event) => setCity(event.target.value)} className="field mt-1 w-full"><option value="">Selecione sua cidade</option>{talitaDeliveryCities.map((item) => <option key={item} value={item}>{item}</option>)}<option value="Outra cidade">Outra cidade (sob consulta)</option></select></label>{city && <p className={`rounded-xl p-3 text-xs font-bold ${hasTalitaDelivery(city) ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>{hasTalitaDelivery(city) ? "Entrega própria Talita Vitória disponível para esta cidade." : "Entrega para esta cidade sob consulta com a consultora."}</p>}<button className="w-full rounded-xl bg-[#287b50] py-4 font-black text-white">Finalizar Pré-Venda (Falar com Consultor)</button><button type="button" onClick={() => setCheckout(false)} className="w-full text-sm font-bold text-stone-500">Voltar aos itens</button></form>
      : <div className="space-y-4">{cart.map((line) => <div key={line.product.id} className="flex gap-3 rounded-2xl border border-rose-100 p-3"><div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-rose-50">{line.product.image_url && <img src={line.product.image_url} alt="" className="h-full w-full object-cover object-top" />}</div><div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-bold">{line.product.title}</p>{account ? <p className="mt-1 font-black text-[#A95765]">{money(priceFor(line.product, account.perfil) * line.quantity)}</p> : <p className="mt-1 flex items-center gap-1 text-xs font-bold text-[#A95765]"><LockKeyhole size={13} /> Preço após login</p>}<div className="mt-2 flex items-center gap-3"><button onClick={() => update(line.product.id, -1)}><Minus size={16} /></button><span className="text-sm font-bold">{line.quantity}</span><button onClick={() => update(line.product.id, 1)}><Plus size={16} /></button><button onClick={() => setCart((items) => items.filter((item) => item.product.id !== line.product.id))} className="ml-auto text-stone-400"><Trash2 size={16} /></button></div></div></div>)}</div>}
    </div>
    {cart.length > 0 && !checkout && <div className="border-t p-5">{account ? <><div className="mb-4 flex justify-between text-lg font-black"><span>Total</span><span className="text-[#A95765]">{money(total)}</span></div><button onClick={() => setCheckout(true)} className="w-full rounded-xl bg-[#A95765] py-4 font-black text-white">Continuar pré-venda</button></> : <><p className="mb-3 text-center text-xs text-stone-500">Entre para visualizar sua tabela de preços e finalizar.</p><button onClick={onLogin} className="w-full rounded-xl bg-[#A95765] py-4 font-black text-white">Entrar para ver preços e finalizar</button></>}</div>}
  </aside></div>;
}
