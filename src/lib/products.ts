import { talitaProducts } from "@/data/talitaProducts";
import type { CatalogProduct, Product } from "@/types/product";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

function fromLocalProduct(product: Product): CatalogProduct {
  return {
    id: product.id,
    title: product.name,
    description: product.description ?? null,
    category: product.category,
    price: product.price,
    image_url: product.image,
    product_url: product.url,
    preco_cliente_base: product.price,
    preco_revendedor_atacado: product.wholesalePrice ?? Number((product.price * 0.75).toFixed(2)),
  };
}

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  try {
    const db = createServiceSupabaseClient();
    const { data, error } = await db.from("catalog_products").select("id,title,description,category,image_url,product_url,preco_cliente_base,preco_revendedor_atacado,is_active").eq("is_active", true).order("category").order("title");
    if (!error && data?.length) return data.map((item) => ({ ...item, price: Number(item.preco_cliente_base) })) as CatalogProduct[];
  } catch { /* The local catalog remains available until the migration is configured. */ }
  return talitaProducts.map(fromLocalProduct);
}
