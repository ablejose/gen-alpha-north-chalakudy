import { CLOUDINARY_CLOUD_NAME, collectionTag } from "@/config/cloudinary";

interface CloudinaryListResource {
  public_id: string;
  format: string;
  version: number;
  created_at?: string;
}

/**
 * Fetch the images an admin has uploaded for a collection.
 *
 * Reads Cloudinary's public resource-list endpoint for the collection's
 * site-namespaced tag. Returns [] on ANY problem (endpoint not enabled yet, no
 * images, offline, CORS) so callers can fall back to placeholder imagery and
 * the site never breaks.
 *
 * Newest uploads are returned first.
 */
export async function fetchCollectionImages(slug: string): Promise<string[]> {
  const tag = collectionTag(slug);
  const url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/list/${tag}.json`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];

    const data = (await res.json()) as { resources?: CloudinaryListResource[] };
    const resources = [...(data.resources ?? [])];

    // Sort newest first when timestamps are present.
    resources.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));

    return resources.map(
      (r) =>
        `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v${r.version}/${r.public_id}.${r.format}`,
    );
  } catch {
    return [];
  }
}
