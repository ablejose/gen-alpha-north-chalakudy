import Link from "next/link";
import Image from "next/image";
import type { Collection } from "@/types/collections";
import { collectionHref } from "@/lib/format";

interface CollectionPreviewProps {
  collection: Collection;
}

/**
 * One homepage row per collection:
 *
 *   [ Collection Name .......................... View All → ]
 *   [ continuous right-to-left scrolling preview of products ]
 *
 * The preview uses the first three products (in config order) and reuses the
 * site's `.marquee-rtl` (smooth, infinite, pauses on hover on desktop).
 * Clicking "View All" or any preview image opens /collections/{slug}.
 * Everything updates automatically from config/collections.ts.
 */
export function CollectionPreview({ collection }: CollectionPreviewProps) {
  const href = collectionHref(collection.slug);
  const preview = collection.products.slice(0, 3);
  if (preview.length === 0) return null;

  // Repeat the first three enough to fill wide viewports, then duplicate the
  // whole track so the `-50%` marquee keyframe loops with no visible jump.
  const half = [...preview, ...preview, ...preview];
  const track = [...half, ...half];

  return (
    <div className="border-t border-border pt-8">
      <div className="container-lux flex items-baseline justify-between gap-4">
        <h3 className="font-display text-display-m text-ivory">{collection.name}</h3>
        <Link
          href={href}
          className="label-eyebrow shrink-0 whitespace-nowrap transition-colors hover:text-ivory"
        >
          View All →
        </Link>
      </div>

      <div className="mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="marquee-rtl flex w-max gap-6">
          {track.map((product, index) => (
            <Link
              key={`${product.id}-${index}`}
              href={href}
              aria-label={`View the ${collection.name} collection`}
              className="group relative block w-56 shrink-0 overflow-hidden rounded-3xl border border-gold/20 shadow-xl shadow-black/40 ring-1 ring-white/5 sm:w-64 md:w-72"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 60vw, 20vw"
                  className="object-cover transition-transform duration-700 ease-lux group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
