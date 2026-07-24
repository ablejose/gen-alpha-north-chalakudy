"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Collection, Product } from "@/types/collections";
import { ProductCard } from "@/components/ProductCard";
import { ProductsLoadingScreen } from "@/components/ProductsLoadingScreen";
import { BackButton } from "@/components/BackButton";
import { fetchCollectionProducts, type RemoteProduct } from "@/lib/cloudinary";

type SortMode = "featured" | "asc" | "desc";

function toProduct(remote: RemoteProduct, fallbackName: string): Product {
  return {
    id: remote.id,
    name: remote.name || fallbackName,
    price: remote.price,
    image: remote.url,
  };
}

/**
 * Client view for a collection page.
 *
 * Products come from the admin panel (single source of truth): if an admin has
 * added products for this collection via /admin (image + name + ₹ price stored
 * on Cloudinary), those render here. Otherwise it falls back to the sample
 * products in config/collections.ts. Either way the layout, price filter and
 * loading screen behave identically.
 *
 * A loading screen stays up until every image on the page has loaded (requested
 * eagerly while gated), so no partial imagery is shown.
 */
export function CollectionView({ collection }: { collection: Collection }) {
  // null = still fetching admin products; [] = none; [items] = use these.
  const [remote, setRemote] = useState<RemoteProduct[] | null>(null);
  const [ready, setReady] = useState(false);
  const [sort, setSort] = useState<SortMode>("featured");
  const loadedCount = useRef(0);

  useEffect(() => {
    let active = true;
    fetchCollectionProducts(collection.slug).then((items) => {
      if (active) setRemote(items);
    });
    return () => {
      active = false;
    };
  }, [collection.slug]);

  const baseProducts = useMemo<Product[]>(() => {
    if (remote === null) return [];
    if (remote.length > 0) return remote.map((r) => toProduct(r, collection.name));
    return collection.products;
  }, [remote, collection.products, collection.name]);

  const totalImages = baseProducts.length;

  // Once we know which product set renders, reset the loader gate and start it.
  useEffect(() => {
    if (remote === null) return; // still deciding — loader stays up
    loadedCount.current = 0;
    setReady(totalImages === 0);
    const timeout = setTimeout(() => setReady(true), 7000);
    return () => clearTimeout(timeout);
  }, [remote, totalImages]);

  const handleAssetSettled = () => {
    loadedCount.current += 1;
    if (loadedCount.current >= totalImages) setReady(true);
  };

  const products = useMemo(() => {
    const list = [...baseProducts];
    if (sort === "asc") list.sort((a, b) => a.price - b.price);
    if (sort === "desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [baseProducts, sort]);

  const showLoader = remote === null || !ready;
  const showSort = remote !== null && baseProducts.length > 0;

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

        {remote !== null && baseProducts.length === 0 ? (
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
