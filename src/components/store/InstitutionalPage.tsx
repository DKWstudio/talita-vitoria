import Link from "next/link";

type Section = { title: string; text: string };

const navigation = [
  ["/atendimento", "Atendimento"], ["/quem-somos", "Quem Somos"], ["/como-comprar", "Como Comprar"],
  ["/politica-de-entrega", "Política de Entrega"], ["/politica-de-trocas-e-devolucoes", "Trocas e Devoluções"], ["/politica-de-privacidade", "Política de Privacidade"],
] as const;

export default function InstitutionalPage({ eyebrow = "Talita Vitória", title, intro, sections }: { eyebrow?: string; title: string; intro: string; sections: Section[] }) {
  const current = navigation.find(([, label]) => label === title)?.[0];
  return <main className="min-h-screen bg-[#fffaf5] px-5 py-8 text-stone-700 md:py-12"><div className="mx-auto max-w-6xl"><Link href="/" className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#A95765] shadow-sm transition hover:bg-rose-50">← Voltar à vitrine</Link><div className="mt-5 grid gap-6 md:grid-cols-[15rem_minmax(0,1fr)]"><aside className="h-fit rounded-3xl bg-[#36445b] p-6 text-white shadow-sm"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#f1c1c8]">Institucional</p><p className="mt-2 text-sm text-slate-300">Navegue pelas páginas</p><nav className="mt-5 grid gap-1">{navigation.map(([href, label]) => <Link key={href} href={href} className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${href === current ? "bg-[#f1c1c8] text-[#36445b]" : "text-white hover:bg-white/10"}`}>{label}</Link>)}</nav></aside><article className="rounded-3xl bg-white p-7 shadow-sm md:p-12"><p className="text-xs font-bold uppercase tracking-[.22em] text-[#A95765]">{eyebrow}</p><h1 className="mt-2 font-serif text-4xl font-bold text-[#34445f]">{title}</h1><p className="mt-5 text-lg leading-relaxed">{intro}</p>{sections.map((section) => <section key={section.title} className="mt-8"><h2 className="font-serif text-2xl font-bold text-[#34445f]">{section.title}</h2><p className="mt-2 leading-relaxed">{section.text}</p></section>)}<p className="mt-10 border-t pt-5 text-xs text-stone-400">Última atualização: agosto de 2026.</p></article></div></div></main>;
}
