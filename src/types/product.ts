export type TalitaCategory =
  | "Cobre Leito"
  | "Lençóis"
  | "Toalhas"
  | "Infantil"
  | "Banheiro"
  | "Cortinas"
  | "Cozinha"
  | "Almofadas";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  url: string;
  category: TalitaCategory;
  rating: number;
  description?: string;
  wholesalePrice?: number;
  benefits?: string[];
  isDailyTip?: boolean;
}

export interface CatalogProduct {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price: number;
  image_url: string | null;
  product_url: string;
  preco_cliente_base?: number;
  preco_revendedor_atacado?: number;
}

export type UserProfile = "cliente" | "revendedor";
