import { CLOUDINARY_CLOUD_NAME, collectionTag } from "@/config/cloudinary";

/** A product read back from Cloudinary (uploaded via the admin panel). */
export interface RemoteProduct {
  /** Cloudinary public_id — stable id / React key. */
  id: string;
  /** Delivery URL (versioned). */
  url: string;
  /** Product name from the image's context metadata. */
  name: string;
  /** Price in INR from context metadata; 0 when not set. */
  price: number;
}

interface CloudinaryContext {
  custom?: Record<string, string>;
  [key: string]: unknown;
}

interface CloudinaryListResource {
  public_id: string;
  format: string;
  version: number;
  created_at?: string;
  context?: CloudinaryContext;
}

function readContext(ctx: CloudinaryContext | undefined): { name: string; price: number } {
  const custom = ctx?.custom ?? (ctx as Record<string, string> | undefined) ?? {};
  const name = typeof custom.name === "string" ? custom.name : "";
  const priceNum = Number(custom.price);
  return { name, price: Number.isFinite(priceNum) ? priceNum : 0 };
}

/**
 * Fetch the products an admin has uploaded for a collection, newest first.
 *
 * Reads Cloudinary's public resource-list endpoint for the collection's
 * site-namespaced tag. Each image carries its name + price in Cloudinary
 * context metadata. Returns [] on ANY problem (endpoint not enabled yet, no
 * images, offline, CORS) so callers can fall back to placeholder products and
 * the site never breaks.
 *
 * @param opts.fresh append a cache-buster to bypass the CDN cache (used by the
 *   admin panel so newly-added products show up quickly).
 */
export async function fetchCollectionProducts(
  slug: string,
  opts: { fresh?: boolean } = {},
): Promise<RemoteProduct[]> {
  const tag = collectionTag(slug);
  const base = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/list/${tag}.json`;
  const url = opts.fresh ? `${base}?_=${Date.now()}` : base;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];

    const data = (await res.json()) as { resources?: CloudinaryListResource[] };
    const resources = [...(data.resources ?? [])];
    resources.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));

    return resources.map((r) => {
      const { name, price } = readContext(r.context);
      return {
        id: r.public_id,
        url: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v${r.version}/${r.public_id}.${r.format}`,
        name,
        price,
      };
    });
  } catch {
    return [];
  }
}
