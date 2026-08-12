"use client";

export default function PrintButton() {
  return <button onClick={() => window.print()} className="rounded-xl bg-[#34445f] px-4 py-3 text-sm font-bold text-white print:hidden">Imprimir</button>;
}
