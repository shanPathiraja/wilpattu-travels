"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import type { Photo } from "@/lib/content";

export default function GalleryGrid({
  tabs,
}: {
  tabs: { label: string; photos: Photo[] }[];
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const photos = tabs[active].photos;

  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((cur) =>
        cur === null ? cur : (cur + dir + photos.length) % photos.length,
      );
    },
    [photos.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, step]);

  return (
    <div>
      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Gallery collections"
        className="mb-10 flex justify-center gap-3"
      >
        {tabs.map((t, i) => (
          <button
            key={t.label}
            role="tab"
            aria-selected={active === i}
            onClick={() => {
              setActive(i);
              setLightbox(null);
            }}
            className={`rounded-full border px-6 py-2.5 text-sm uppercase tracking-[0.16em] transition ${
              active === i
                ? "border-gold bg-gold text-[#12200f] font-semibold"
                : "border-line text-muted hover:border-gold/50 hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Masonry columns */}
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {photos.map((p, i) => (
          <Reveal key={p.src} variant="up" delay={(i % 3) * 100} as="figure">
            <button
              onClick={() => setLightbox(i)}
              className="img-zoom group relative block w-full overflow-hidden rounded-2xl border border-line text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              aria-label={`Open image: ${p.alt}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={900}
                height={i % 3 === 1 ? 1200 : 640}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                className="h-auto w-full object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-[#04110a]/85 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {p.tag && (
                <span className="absolute bottom-4 left-4 translate-y-2 text-xs uppercase tracking-[0.22em] text-gold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {p.tag}
                </span>
              )}
            </button>
          </Reveal>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photos[lightbox].alt}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#020806]/95 p-4 backdrop-blur-md"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[lightbox].src}
              alt={photos[lightbox].alt}
              width={1600}
              height={1067}
              sizes="90vw"
              className="mx-auto max-h-[80vh] w-auto rounded-xl object-contain"
              priority
            />
            <p className="mt-4 text-center text-sm text-muted">
              {photos[lightbox].alt}
              <span className="ml-3 text-gold">
                {lightbox + 1} / {photos.length}
              </span>
            </p>
          </div>

          <button
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/70 text-xl transition hover:border-gold hover:text-gold"
          >
            ←
          </button>
          <button
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/70 text-xl transition hover:border-gold hover:text-gold"
          >
            →
          </button>
          <button
            aria-label="Close gallery"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-line bg-surface/70 transition hover:border-gold hover:text-gold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
