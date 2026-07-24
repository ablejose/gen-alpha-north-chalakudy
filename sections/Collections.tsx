import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { CollectionPreview } from "@/components/CollectionPreview";
import { COLLECTIONS } from "@/config/collections";

/**
 * "Our Collections" — sits directly below the hero. Renders one preview row per
 * collection from config/collections.ts. Fully data-driven: add, rename or
 * reorder collections/products in config and this section updates on the next
 * deploy with no code changes.
 */
export function Collections() {
  if (COLLECTIONS.length === 0) return null;

  return (
    <section id="collections" className="py-20 md:py-28">
      <div className="container-lux">
        <Reveal>
          <SectionHeading
            eyebrow="Explore"
            title="Our Collections"
            subtitle="Handpicked pieces across every category — crafted for every celebration."
          />
        </Reveal>
      </div>

      <div className="mt-12 flex flex-col gap-14 md:mt-16 md:gap-20">
        {COLLECTIONS.map((collection) => (
          <Reveal key={collection.slug}>
            <CollectionPreview collection={collection} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
