"use client";

import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Collection } from "@/types/collections";
import {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_UPLOAD_URL,
  collectionTag,
} from "@/config/cloudinary";
import { fetchCollectionProducts, type RemoteProduct } from "@/lib/cloudinary";
import { formatRupees } from "@/lib/format";

/**
 * One collection's product manager in the admin panel. Add a product by
 * choosing an image and entering its name + price; all three are required.
 * The upload goes straight to Cloudinary via the unsigned preset, tagged with
 * the collection's site-namespaced tag, with the name + price stored as
 * Cloudinary context metadata so the public pages can read them back.
 *
 * Note: unsigned uploads can ADD products but cannot edit or delete them
 * (that needs a signed/admin API). Editing/removing is done from the Cloudinary
 * dashboard — or ask to add a small backend for full edit/delete.
 */
export function CollectionUploader({ collection }: { collection: Collection }) {
  const [products, setProducts] = useState<RemoteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const items = await fetchCollectionProducts(collection.slug, { fresh: true });
    setProducts(items);
    setLoading(false);
  }, [collection.slug]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addProduct = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("");
    setError("");

    const trimmedName = name.trim();
    const priceNum = Number(price);
    if (!file) return setError("Please choose an image.");
    if (!trimmedName) return setError("Please enter a product name.");
    if (!Number.isFinite(priceNum) || priceNum <= 0) return setError("Please enter a valid price.");

    // Context uses "|" and "=" as separators, so strip them from the name.
    const safeName = trimmedName.replace(/[|=]/g, " ").trim();

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    form.append("tags", collectionTag(collection.slug));
    form.append("context", `name=${safeName}|price=${Math.round(priceNum)}`);

    setUploading(true);
    try {
      const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: "POST", body: form });
      if (res.ok) {
        setStatus(
          `Added "${safeName}". It can take a few minutes (up to ~1 hour) to appear on the live site.`,
        );
        setName("");
        setPrice("");
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
        setTimeout(() => void refresh(), 4000);
      } else {
        const body = (await res.json().catch(() => null)) as
          | { error?: { message?: string } }
          | null;
        const message = body?.error?.message || `Upload failed (HTTP ${res.status}).`;
        setError(`${message} Check that the Cloudinary unsigned upload preset "${CLOUDINARY_UPLOAD_PRESET}" exists.`);
      }
    } catch {
      setError("Network error while uploading.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="rounded-card border border-border p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-display-m text-ivory">{collection.name}</h2>
        <span className="font-sans text-caption uppercase tracking-[0.16em] text-muted">
          /collections/{collection.slug}
        </span>
      </div>

      <form onSubmit={addProduct} className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="flex flex-col gap-2">
          <span className="font-sans text-caption uppercase tracking-[0.16em] text-muted">Product name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kundan Necklace"
            className="min-h-[44px] rounded-pill border border-gold/40 bg-background px-4 font-sans text-body text-ivory outline-none focus:border-gold"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-sans text-caption uppercase tracking-[0.16em] text-muted">Price (₹)</span>
          <input
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 25000"
            className="min-h-[44px] rounded-pill border border-gold/40 bg-background px-4 font-sans text-body text-ivory outline-none focus:border-gold"
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="font-sans text-caption uppercase tracking-[0.16em] text-muted">Image</span>
          <div className="flex items-center gap-3">
            <label className="btn-secondary cursor-pointer whitespace-nowrap">
              {file ? "Change" : "Choose"}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
            <button type="submit" disabled={uploading} className="btn-primary whitespace-nowrap">
              {uploading ? "Adding..." : "Add product"}
            </button>
          </div>
          {file ? (
            <span className="max-w-[220px] truncate font-sans text-caption text-muted">{file.name}</span>
          ) : null}
        </div>
      </form>

      {status ? <p className="mt-4 font-sans text-body text-gold">{status}</p> : null}
      {error ? <p className="mt-4 font-sans text-body text-[#e88]">{error}</p> : null}

      <div className="mt-6 border-t border-border pt-6">
        {loading ? (
          <p className="font-sans text-body text-muted">Loading current products...</p>
        ) : products.length === 0 ? (
          <p className="font-sans text-body text-muted">
            No products yet. The live page shows placeholder items until you add some.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-gold/20">
                  <Image src={product.url} alt={product.name} fill sizes="160px" className="object-cover" />
                </div>
                <span className="mt-2 truncate font-sans text-body text-ivory">{product.name || "Untitled"}</span>
                <span className="font-sans text-caption text-gold">
                  {product.price > 0 ? formatRupees(product.price) : "No price"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
