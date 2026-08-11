import type { Metadata } from "next";
import ProductDetail from "@/components/store/ProductDetail";

export const metadata: Metadata = {
  title: "Cobre-Leito Alice | Talita Vitória",
  description: "Cobre-Leito Alice bordado em Hipercal 200 fios, disponível nos tamanhos Casal, Queen e Super King.",
};

export default function AliceProductPage() {
  return <ProductDetail />;
}
