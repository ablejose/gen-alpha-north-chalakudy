"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Collection } from "@/types/collections";
import { ProductCard } from "@/components/ProductCard";
import { ProductsLoadingScreen } from "@/components/ProductsLoadingScreen";
import { BackButton } from "@/components/BackButton";
import { fetchCollectionImages } from "@/lib/cloudinary";

type SortMode = "featured" | "asc" | "desc";

/**
 * Client view for a collection page.
 *
 * Image source (single source of truth = the admin panel):
 *   • If an admin has uploaded images for this collection (via /admin), the
 *     page shows those in a gallery.
 *   • Otherwise it falls back to the sample products in config/collections.ts
 *     (which also carry a name + ₹ price, so the price filter is shown).
 *
 * A loading screen stays up until the destination page's images have all
 * loaded (requested eagerly while gated), so no partial imagery is shown.
 */
export function CollectionView({ collection }: { collection: Collection }) {
  // null = still fetching; [] = none uploaded; [urls] = gallery mode.
  const [adminImages, setAdminImages] = useState<string[] | null>(null);
  const [ready, setReady] = useState(false);
  const [sort, setSort] = useState<SortMode>("featured");
  const loadedCount = useRef(0);

  useEffect(() => {
    let active = true;
    fetchCollectionImages(collection.slug).then((imgs) => {
      if (active) setAdminImages(imgs);
    });
    return () => {
      active = false;
    };
  }, [collection.slug]);

  const galleryMode = (adminImages?.length ?? 0) > 0;
  const totalImages = galleryMode ? adminImages!.length : collection.products.length;

  // Once we know which image set renders, reset the gate and start it.
  useEffect(() => {
    if (adminImages === null) return; // still deciding — loader stays up
    loadedCount.current = 0;
    setReady(totalImages === 0);
    const timeout = setTimeout(() => setReady(true), 7000);
    return () => clearTimeout(timeout);
  }, [adminImages, totalImages]);

  const handleAssetSettled = () => {
    loadedCount.current += 1;
    if (loadedCount.current >= totalImages) setReady(true);
  };

  const products = useMemo(() => {
    const list = [...collection.products];
    if (sort === "asc") list.sort((a, b) => a.price - b.price);
    if (sort === "desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [collection.products, sort]);

  const showLoader = adminImages === null || !ready;
  const showSort = adminImages !== null && !galleryMode && collection.products.length > 0;

  return (
    <>
      {showLoader ? <ProductsLoadingScreen name={collection.name} /> : null}

      <section className="container-lux pb-24 md:pb-32">
        <div className="mb-8">
          <BackButton />
        </div>

        <header className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-eyebrow">Collection</span>
            <h1 className="mt-3 font-display text-display-l text-ivory">{collection.name}</h1>
            {collection.description ? (
              <p className="mt-3 max-w-xl font-sans text-body text-muted">
                {collection.description}
              </p>
            ) : null}
          </div>

          {showSort ? (
            <label className="flex items-center gap-3 md:shrink-0">
              <span className="font-sans text-caption uppercase tracking-[0.16em] text-muted">
                Sort by
              </span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortMode)}
                className="min-h-[44px] rounded-pill border border-gold/40 bg-background px-5 font-sans text-sm text-ivory outline-none transition-colors hover:border-gold focus:border-gold"
                aria-label="Sort products by price"
              >
                <option value="featured">Featured</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </label>
          ) : null}
        </header>

        {galleryMode ? (
          <div className="mt-12 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {adminImages!.map((src) => (
              <div
                key={src}
                className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-gold/20 shadow-xl shadow-black/40 ring-1 ring-white/5"
              >
                <Image
                  src={src}
                  alt={`${collection.name} piece`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-lux group-hover:scale-105"
                  loading="eager"
                  onLoad={handleAssetSettled}
                  onError={handleAssetSettled}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        ) : collection.products.length === 0 ? (
          <p className="mt-16 text-center font-sans text-body text-muted">
            Pieces from this collection are coming soon.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                eager={!ready}
                onSettled={handleAssetSettled}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
