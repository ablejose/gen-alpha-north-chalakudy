/**
 * Cloudinary config for the admin image uploader and the dynamic collection
 * galleries. There are NO secrets here — uploads use an UNSIGNED preset and the
 * site reads images back through Cloudinary's public "resource list" endpoint.
 *
 * ── ONE-TIME SETUP (Cloudinary dashboard for cloud "cfg3wh0j") ────────────────
 *   1. Settings → Upload → Upload presets → "Add upload preset".
 *        • Signing Mode: Unsigned
 *        • Name it, and put that name in NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
 *          (or rename it to the default below).
 *   2. Settings → Security → "Restricted media types": make sure
 *        "Resource list" is NOT restricted, so the public
 *        /image/list/<tag>.json endpoint works (that's what the site reads).
 *
 * Until that setup exists, uploads simply error in the admin panel and the
 * public pages fall back to the placeholder images in config/collections.ts —
 * nothing breaks.
 *
 * NOTE: the "cfg3wh0j" Cloudinary account is shared across many sites, so every
 * upload is tagged with a SITE-SPECIFIC prefix (see collectionTag) to keep this
 * site's images from mixing with any other site's.
 */
export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "cfg3wh0j";

export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "gen_alpha_unsigned";

/** Site key that namespaces this site's images within the shared account. */
export const SITE_KEY =
  process.env.NEXT_PUBLIC_SITE_KEY || "gen-alpha-north-chalakudy";

/** Cloudinary tag applied to every image uploaded for a given collection. */
export function collectionTag(slug: string): string {
  return `${SITE_KEY}__${slug}`;
}

/** Unsigned upload endpoint for the configured cloud. */
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
