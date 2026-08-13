import Link from "next/link";

type Section = { title: string; text: string };

export default function InstitutionalPage({ eyebrow = "Talita Vitória", title, intro, sections }: { eyebrow?: string; title: string; intro: string; sections: Section[] }) {
  return <main className="min-h-screen bg-[#fffaf5] px-5 py-12 text-stone-700"><article className="mx-auto max-w-3xl rounded-3xl bg-white p-7 shadow-sm md:p-12"><Link href="/" className="text-sm font-bold text-[#A95765]">← Voltar à vitrine</Link><p className="mt-8 text-xs font-bold uppercase tracking-[.22em] text-[#A95765]">{eyebrow}</p><h1 className="mt-2 font-serif text-4xl font-bold text-[#34445f]">{title}</h1><p className="mt-5 text-lg leading-relaxed">{intro}</p>{sections.map((section) => <section key={section.title} className="mt-8"><h2 className="font-serif text-2xl font-bold text-[#34445f]">{section.title}</h2><p className="mt-2 leading-relaxed">{section.text}</p></section>)}<p className="mt-10 border-t pt-5 text-xs text-stone-400">Última atualização: agosto de 2026.</p></article></main>;
}
