import { notFound } from "next/navigation";
import CollectionDetail from "@/components/store/CollectionDetail";
import { getCollection } from "@/data/collections";
import { getCatalogProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const managedProduct = (await getCatalogProducts()).find((product) => product.product_url === `/produto/${slug}`);
  const image = managedProduct?.image_url || collection.image;
  const gallery = (managedProduct as (typeof managedProduct & { gallery_images?: { url: string }[] }) | undefined)?.gallery_images?.map((item) => item.url) ?? [];

  return <CollectionDetail collection={{ ...collection, image, galleryImages: gallery }} />;
}
