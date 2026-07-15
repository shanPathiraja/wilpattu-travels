import type { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import BookingForm from "@/components/BookingForm";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { heroImages, jeepFeatures, safariPackages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Safari Jeep Booking — Leopard Safaris in Wilpattu",
  description:
    "Book a Wilpattu safari jeep: dawn leopard patrols, golden-hour drives, full-day expeditions and overnight tented safaris. Naturalist trackers, park fees included.",
  alternates: { canonical: "/safari" },
  openGraph: {
    title: "Safari Jeep Booking — Wilpattu Wilds",
    description:
      "Dawn leopard patrols, full-day expeditions and overnight tented safaris in Wilpattu National Park.",
    images: [heroImages.safari],
  },
};

const safariJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Wilpattu Safari Packages",
  itemListElement: safariPackages.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "TouristTrip",
      name: p.name,
      description: p.description,
      offers: {
        "@type": "Offer",
        price: p.priceUSD,
        priceCurrency: "USD",
      },
    },
  })),
};

export default function SafariPage() {
  return (
    <>
      <Script
        id="ld-safari"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(safariJsonLd) }}
      />

      <PageHero
        image={heroImages.safari}
        alt="Open safari jeep silhouetted against a burning sunset sky"
        eyebrow="Safari Jeep Tours"
        title="Choose your way into the wild"
        intro="Every drive runs in a custom open-top Land Cruiser with a licensed naturalist tracker. Park tickets, permits and taxes are always included — the only surprise should be the leopard."
      />

      {/* ------------------------------------------------------- PACKAGES */}
      <section className="relative px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          {safariPackages.map((p, i) => (
            <Reveal key={p.id} variant={i % 2 ? "right" : "left"} delay={80}>
              <article className="card-lift img-zoom group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface/60 backdrop-blur-sm">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={p.photo.src}
                    alt={p.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                  {p.popular && (
                    <span className="absolute left-5 top-5 rounded-full bg-gold px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#12200f]">
                      Most Booked
                    </span>
                  )}
                  <div className="absolute bottom-5 left-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-gold-soft">
                      {p.duration}
                    </p>
                    <h2 className="font-display text-3xl">{p.name}</h2>
                  </div>
                  <p className="absolute bottom-5 right-5 font-display text-2xl text-gold">
                    ${p.priceUSD}
                    <span className="ml-1 text-xs text-muted">{p.per}</span>
                  </p>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="text-sm uppercase tracking-[0.18em] text-muted">
                    {p.time}
                  </p>
                  <p className="mt-4 leading-relaxed text-foreground/90">
                    {p.description}
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-sm text-muted">
                        <span aria-hidden className="text-gold">
                          ✦
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#book"
                    className="mt-7 inline-block w-fit rounded-full border border-gold/60 px-7 py-3 text-sm uppercase tracking-[0.14em] text-gold transition hover:bg-gold hover:text-[#12200f]"
                  >
                    Book {p.name}
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------- WHY OUR JEEPS */}
      <section className="relative px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="The Wilds Difference"
          title="Built for the long red roads"
        />
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {jeepFeatures.map((f, i) => (
            <Reveal key={f.title} variant="up" delay={i * 120}>
              <div className="card-lift h-full rounded-2xl border border-line bg-surface/60 p-7 backdrop-blur-sm">
                <p className="font-display text-4xl text-gold/70">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display mt-4 text-xl">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {f.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ BOOK */}
      <section id="book" className="relative scroll-mt-24 px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Reserve Your Jeep"
          title="Book a safari"
          intro="Tell us when — we'll match you with the right tracker and confirm within hours."
        />
        <div className="mx-auto max-w-3xl">
          <Reveal variant="up">
            <BookingForm
              kind="safari"
              optionLabel="Safari package"
              options={safariPackages.map((p) => ({
                value: p.id,
                label: `${p.name} — $${p.priceUSD} ${p.per}`,
              }))}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
