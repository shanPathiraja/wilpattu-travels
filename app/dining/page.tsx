import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import {
  diningExperiences,
  drinkImages,
  heroImages,
  menu,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Food & Drinks — Fire-Cooked Sri Lankan Dining",
  description:
    "Rice & curry on lotus leaves, boma fire BBQ nights, jungle breakfasts, king coconut and arrack cocktails — dining at Wilpattu Wilds jungle lodge.",
  alternates: { canonical: "/dining" },
  openGraph: {
    title: "Food & Drinks — Wilpattu Wilds",
    description:
      "Fire-cooked Sri Lankan food and dry-zone drinks at the edge of Wilpattu National Park.",
    images: [heroImages.dining],
  },
};

export default function DiningPage() {
  return (
    <>
      <PageHero
        image={heroImages.dining}
        alt="Traditional Sri Lankan rice and curry served on a lotus leaf"
        eyebrow="Food & Drinks"
        title="Cooked on fire, served under trees"
        intro="Our kitchen is a wood-fired courtyard run by cooks from the villages around the park. Ingredients travel minutes, not miles — lagoon crab from Puttalam, jackfruit from our own trees, spices ground each morning."
      />

      {/* ------------------------------------------------------ EXPERIENCES */}
      <section className="relative px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Signature Tables"
          title="Four meals worth travelling for"
        />
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {diningExperiences.map((d, i) => (
            <Reveal key={d.title} variant="up" delay={(i % 2) * 140}>
              <figure className="card-lift img-zoom group overflow-hidden rounded-3xl border border-line bg-surface/60 backdrop-blur-sm">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={d.src}
                    alt={d.alt}
                    fill
                    sizes="(min-width: 768px) 45vw, 92vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                </div>
                <figcaption className="p-7">
                  <p className="text-xs uppercase tracking-[0.22em] text-gold">
                    {d.subtitle}
                  </p>
                  <h2 className="font-display mt-2 text-2xl">{d.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {d.text}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ MENU */}
      <section className="relative px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="The Menu"
          title="From clay pot & open fire"
          intro="A living menu that follows the seasons of the dry zone — this is tonight's."
        />
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
          {menu.map((section, i) => (
            <Reveal key={section.section} variant="up" delay={i * 140}>
              <div className="h-full rounded-3xl border border-line bg-surface/60 p-8 backdrop-blur-sm">
                <h3 className="font-display text-2xl text-gradient-gold">
                  {section.section}
                </h3>
                <ul className="mt-6 space-y-6">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="font-semibold">{item.name}</p>
                        <span
                          aria-hidden
                          className="flex-1 border-b border-dotted border-line"
                        />
                        <p className="font-display text-gold">{item.price}</p>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">
                        {item.desc}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- DRINKS */}
      <section className="relative px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Dry-Zone Drinks"
          title="Thambili, arrack & highland tea"
          intro="King coconuts opened with a machete, coconut-arrack cocktails at the fire pit, and Ceylon tea on the observation deck."
        />
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 lg:grid-cols-4">
          {drinkImages.map((d, i) => (
            <Reveal key={d.src} variant="scale" delay={i * 110}>
              <div className="img-zoom card-lift relative aspect-[3/4] overflow-hidden rounded-2xl border border-line">
                <Image
                  src={d.src}
                  alt={d.alt}
                  fill
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
