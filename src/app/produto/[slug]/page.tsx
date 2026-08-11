import { notFound } from "next/navigation";
import CollectionDetail from "@/components/store/CollectionDetail";
import { getCollection } from "@/data/collections";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  return <CollectionDetail collection={collection} />;
}
