import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";
import { FloatingWhatsApp } from "@/sections/FloatingWhatsApp";
import { CollectionView } from "@/components/CollectionView";
import { COLLECTIONS, getCollection } from "@/config/collections";
import { BRAND } from "@/config/brand";

interface PageProps {
  params: { slug: string };
}

// Statically generate a page for every collection in config; unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return COLLECTIONS.map((collection) => ({ slug: collection.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const collection = getCollection(params.slug);
  if (!collection) return { title: "Collection not found" };

  const title = `${collection.name} | ${BRAND.businessName}`;
  const description =
    collection.description ??
    `Explore the ${collection.name} collection at ${BRAND.businessName}, ${BRAND.city}.`;

  return {
    title: collection.name,
    description,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: { title, description, url: `/collections/${collection.slug}` },
  };
}

export default function CollectionPage({ params }: PageProps) {
  const collection = getCollection(params.slug);
  if (!collection) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-28 md:pt-32">
        <CollectionView collection={collection} />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
