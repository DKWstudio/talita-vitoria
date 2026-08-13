import type { MetadataRoute } from "next";
import { getCatalogProducts } from "@/lib/products";

const siteUrl = "https://talita-vitoria.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalogProducts();

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/atendimento`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/quem-somos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/como-comprar`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/politica-de-entrega`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/politica-de-trocas-e-devolucoes`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/politica-de-privacidade`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    ...products.filter((product) => product.product_url).map((product) => ({
      url: `${siteUrl}${product.product_url}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
