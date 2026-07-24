"use client";

import { type ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Collection } from "@/types/collections";
import {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_UPLOAD_URL,
  collectionTag,
} from "@/config/cloudinary";
import { fetchCollectionImages } from "@/lib/cloudinary";

/**
 * One collection's image manager in the admin panel: shows the images currently
 * uploaded for the collection and lets the admin add more (multiple at once).
 * Uploads go directly to Cloudinary via the unsigned preset, tagged with the
 * collection's site-namespaced tag so the public pages can read them back.
 *
 * Note: unsigned uploads can add images but cannot delete them (deletion needs
 * a signed/admin API). Removing an image is done from the Cloudinary dashboard.
 */
export function CollectionUploader({ collection }: { collection: Collection }) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const imgs = await fetchCollectionImages(collection.slug);
    setImages(imgs);
    setLoading(false);
  }, [collection.slug]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setStatus("");
    setError("");

    let ok = 0;
    let fail = 0;
    let firstError = "";

    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      form.append("tags", collectionTag(collection.slug));
      try {
        const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: "POST", body: form });
        if (res.ok) {
          ok += 1;
        } else {
          fail += 1;
          if (!firstError) {
            const body = (await res.json().catch(() => null)) as
              | { error?: { message?: string } }
              | null;
            firstError = body?.error?.message || `Upload failed (HTTP ${res.status}).`;
          }
        }
      } catch {
        fail += 1;
        if (!firstError) firstError = "Network error while uploading.";
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";

    if (ok > 0) {
      setStatus(
        `${ok} image${ok === 1 ? "" : "s"} uploaded. New images can take up to a minute to appear on the live site.`,
      );
    }
    if (fail > 0) {
      setError(
        `${fail} failed. ${firstError} Check that the Cloudinary unsigned upload preset "${CLOUDINARY_UPLOAD_PRESET}" exists.`,
      );
    }

    // The resource-list endpoint is CDN-cached; refresh after a short delay.
    setTimeout(() => void refresh(), 4000);
  };

  return (
    <section className="rounded-card border border-border p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-display-m text-ivory">{collection.name}</h2>
          <p className="mt-1 font-sans text-caption uppercase tracking-[0.16em] text-muted">
            /collections/{collection.slug}
          </p>
        </div>

        <label className="btn-primary cursor-pointer">
          {uploading ? "Uploading..." : "Upload images"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={onFiles}
            className="hidden"
          />
        </label>
      </div>

      {status ? <p className="mt-4 font-sans text-body text-gold">{status}</p> : null}
      {error ? <p className="mt-4 font-sans text-body text-[#e88]">{error}</p> : null}

      <div className="mt-6">
        {loading ? (
          <p className="font-sans text-body text-muted">Loading current images...</p>
        ) : images.length === 0 ? (
          <p className="font-sans text-body text-muted">
            No uploaded images yet. The live page is showing placeholder imagery until you add some.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {images.map((src) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden rounded-md border border-gold/20"
              >
                <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
