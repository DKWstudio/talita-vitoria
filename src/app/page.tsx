import Storefront from "@/components/store/Storefront";
import { getCatalogProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  return <Storefront products={await getCatalogProducts()} />;
}
