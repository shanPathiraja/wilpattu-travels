import type { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import BookingForm from "@/components/BookingForm";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { heroImages, lodgeAmenities, rooms } from "@/lib/content";

export const metadata: Metadata = {
  title: "Hotel Booking — Jungle Lodge Rooms, Villas & Tents",
  description:
    "Stay on the edge of Wilpattu National Park: villu-view suites, jungle villas, luxury safari tents and family bungalows with a waterhole-edge infinity pool.",
  alternates: { canonical: "/hotels" },
  openGraph: {
    title: "Stay at Wilpattu Wilds — Jungle Lodge & Tented Camp",
    description:
      "Villu-view suites, jungle villas, luxury safari tents and family bungalows beside Wilpattu National Park.",
    images: [heroImages.lodge],
  },
};

const hotelJsonLd = {
  "@context": "https://schema.org",
  "@type": "Resort",
  name: "Wilpattu Wilds Lodge",
  description:
    "Jungle lodge and tented camp on a private waterhole beside Wilpattu National Park, Sri Lanka.",
  url: "https://wilpattuwilds.lk/hotels",
  telephone: "+94771234567",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hunuwilagama",
    addressRegion: "North Western Province",
    addressCountry: "LK",
  },
  geo: { "@type": "GeoCoordinates", latitude: 8.4581, longitude: 80.0503 },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Infinity pool" },
    { "@type": "LocationFeatureSpecification", name: "Open-air restaurant" },
    { "@type": "LocationFeatureSpecification", name: "Spa" },
    { "@type": "LocationFeatureSpecification", name: "Safari desk" },
  ],
  containsPlace: rooms.map((r) => ({
    "@type": "HotelRoom",
    name: r.name,
    occupancy: { "@type": "QuantitativeValue", description: r.occupancy },
    offers: { "@type": "Offer", price: r.priceUSD, priceCurrency: "USD" },
  })),
};

export default function HotelsPage() {
  return (
    <>
      <Script
        id="ld-hotel"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd) }}
      />

      <PageHero
        image={heroImages.lodge}
        alt="Timber lodge building surrounded by coconut palms"
        eyebrow="The Lodge"
        title="A waterhole of your own"
        intro="Fourteen keys hidden in old cashew forest on a private villu, two minutes from the Hunuwilagama gate. Deer graze the lawn; the pool ends where the wild begins."
      />

      {/* ----------------------------------------------------------- ROOMS */}
      <section className="relative px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Rooms & Rates"
          title="Four ways to sleep in the forest"
        />
        <div className="mx-auto max-w-6xl space-y-16">
          {rooms.map((room, i) => (
            <Reveal key={room.id} variant="up">
              <article
                className={`grid items-center gap-8 lg:grid-cols-2 ${
                  i % 2 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="img-zoom relative aspect-[4/3] overflow-hidden rounded-3xl border border-line">
                  <Image
                    src={room.photo.src}
                    alt={room.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 48vw, 92vw"
                    className="object-cover"
                  />
                  <span className="absolute left-5 top-5 rounded-full bg-[#04110a]/80 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold backdrop-blur-sm">
                    {room.size} · {room.occupancy}
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-3xl sm:text-4xl">
                    {room.name}
                  </h2>
                  <p className="mt-2 font-display text-xl text-gold">
                    from ${room.priceUSD}
                    <span className="ml-1 text-sm text-muted">
                      / night incl. breakfast
                    </span>
                  </p>
                  <p className="mt-5 leading-relaxed text-muted">
                    {room.description}
                  </p>
                  <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5">
                    {room.amenities.map((a) => (
                      <li key={a} className="flex gap-2.5 text-sm text-foreground/85">
                        <span aria-hidden className="text-gold">
                          ✦
                        </span>
                        {a}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#book"
                    className="mt-8 inline-block rounded-full border border-gold/60 px-7 py-3 text-sm uppercase tracking-[0.14em] text-gold transition hover:bg-gold hover:text-[#12200f]"
                  >
                    Book {room.name}
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- AMENITIES */}
      <section className="relative px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Around the Lodge"
          title="Days between the drives"
        />
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {lodgeAmenities.map((a, i) => (
            <Reveal key={a.title} variant="up" delay={i * 120}>
              <figure className="card-lift img-zoom group overflow-hidden rounded-3xl border border-line bg-surface/50">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={a.src}
                    alt={a.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="p-6">
                  <h3 className="font-display text-xl">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {a.text}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ BOOK */}
      <section id="book" className="relative scroll-mt-24 px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Reserve Your Stay"
          title="Book a room"
          intro="Direct bookings always get the best rate — and a free sunset drink at the villu deck."
        />
        <div className="mx-auto max-w-3xl">
          <Reveal variant="up">
            <BookingForm
              kind="hotel"
              optionLabel="Room type"
              options={rooms.map((r) => ({
                value: r.id,
                label: `${r.name} — from $${r.priceUSD}/night`,
              }))}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
