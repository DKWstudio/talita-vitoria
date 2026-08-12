import { talitaProducts } from "@/data/talitaProducts";
import type { CatalogProduct, Product } from "@/types/product";

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
  return talitaProducts.map(fromLocalProduct);
}
