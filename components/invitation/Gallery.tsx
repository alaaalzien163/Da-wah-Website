import Image from "next/image";

import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { DemoIdentity, GalleryImage } from "@/lib/invitation";

export interface GalleryProps {
  images: GalleryImage[];
  demo: DemoIdentity;
}

/**
 * Uniform 4:5 editorial grid. Images are local original demo artwork, loaded
 * lazily with explicit dimensions so the layout never shifts.
 */
export function Gallery({ images, demo }: GalleryProps) {
  if (images.length === 0) return null;

  return (
    <Section
      id="gallery"
      tone="light"
      aria-labelledby="gallery-title"
      className="border-y border-gold-700/10"
    >
      <Reveal>
        <div className="mx-auto max-w-prose text-center">
          <Eyebrow tone="onLight">المعرض</Eyebrow>

          <h2
            id="gallery-title"
            className="mt-4 font-display text-title text-ink-900"
          >
            لمحات من الفرح
          </h2>

          <Divider className="mx-auto mt-5 max-w-28 text-gold-700" />
        </div>
      </Reveal>

      <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
        {images.map((image, index) => (
          <li
            key={image.src}
            className="group overflow-hidden bg-emerald-900 shadow-[0_18px_44px_-36px_rgb(6_42_33/0.55)] ring-1 ring-inset ring-gold-500/10 transition-[box-shadow] duration-500 hover:ring-gold-500/30"
          >
            <Reveal delay={Math.min(index * 0.06, 0.24)} y={14}>
              <figure className="aspect-[4/5] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 640px) 30vw, 46vw"
                  loading="lazy"
                  decoding="async"
                  unoptimized
                  className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.025]"
                />
                {image.caption ? (
                  <figcaption className="sr-only">{image.caption}</figcaption>
                ) : null}
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>

      <p className="mx-auto mt-9 max-w-prose text-pretty text-center text-[0.8125rem] leading-relaxed text-ink-600/90">
        {demo.label} · رسومات توضيحية أُنشئت لهذا النموذج، وتُستبدل بصور
        العميل.
      </p>
    </Section>
  );
}
