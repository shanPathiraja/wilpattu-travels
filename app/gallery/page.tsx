import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import PageHero from "@/components/PageHero";
import { galleryLodge, galleryWilpattu, heroImages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery — Wilpattu Wildlife & Lodge Photos",
  description:
    "A photo gallery of Wilpattu National Park — leopards, sloth bears, elephants and villu lakes — plus the suites, pool and tented camp of Wilpattu Wilds lodge.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery — Wilpattu Wilds",
    description:
      "Leopards, sloth bears, villu lakes and the lodge — through our guests' lenses.",
    images: [heroImages.villu],
  },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        image={heroImages.villu}
        alt="Dramatic storm light over a silhouetted villu lake"
        eyebrow="Gallery"
        title="What the forest showed us"
        intro="Every frame below was possible on an ordinary drive. The park keeps no promises — it just keeps delivering."
      />
      <section className="relative px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <GalleryGrid
            tabs={[
              { label: "Wilpattu Park", photos: galleryWilpattu },
              { label: "The Lodge", photos: galleryLodge },
            ]}
          />
        </div>
      </section>
    </>
  );
}
