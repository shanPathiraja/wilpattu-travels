import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { heroImages, visitInfo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Location & Map — Getting to Wilpattu National Park",
  description:
    "How to reach Wilpattu National Park: map, driving directions from Colombo and Anuradhapura, park opening hours, best season and what to bring on safari.",
  alternates: { canonical: "/location" },
  openGraph: {
    title: "Getting to Wilpattu — Map & Directions",
    description:
      "Map, directions, park hours and the best season for Wilpattu National Park.",
    images: [heroImages.jungle],
  },
};

const infoCards = [
  {
    title: "Park Hours",
    text: visitInfo.hours,
    icon: "🕕",
  },
  {
    title: "Best Season",
    text: visitInfo.bestTime,
    icon: "🌤",
  },
  {
    title: "Main Entrance",
    text: visitInfo.entrance,
    icon: "🚪",
  },
  {
    title: "From Colombo",
    text: visitInfo.fromColombo,
    icon: "🛻",
  },
];

const packing = [
  "Neutral-coloured clothing (the forest notices bright colours before you do)",
  "Binoculars — we keep spares in every jeep",
  "Sun cream, hat and a light rain layer",
  "Camera with a long lens; bean-bags provided on board",
  "Passport / ID for park tickets",
  "A quiet voice — the villus reward patience",
];

export default function LocationPage() {
  return (
    <>
      <PageHero
        image={heroImages.jungle}
        alt="Twilight over the dense forest canopy near Wilpattu"
        eyebrow="Visit"
        title="Finding the land of lakes"
        intro="Wilpattu sits on Sri Lanka's northwest coast between Puttalam and Anuradhapura — three and a half hours from Colombo, a world away from everything."
      />

      {/* -------------------------------------------------------------- MAP */}
      <section className="relative px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="The Map"
          title="Where the wild is"
          intro="Our lodge and safari office sit at Hunuwilagama, beside the main park entrance."
        />
        <Reveal variant="scale">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-line">
            <iframe
              title="Map of Wilpattu National Park, Sri Lanka"
              src={`https://www.google.com/maps?q=Wilpattu%20National%20Park%2C%20Sri%20Lanka&ll=${visitInfo.coords.lat},${visitInfo.coords.lng}&z=10&output=embed`}
              width="100%"
              height="480"
              style={{ border: 0, filter: "grayscale(0.2) contrast(1.05)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
        <p className="mx-auto mt-4 max-w-6xl text-right text-xs text-muted">
          GPS: {visitInfo.coords.lat}° N, {visitInfo.coords.lng}° E
        </p>
      </section>

      {/* ------------------------------------------------------- INFO CARDS */}
      <section className="relative px-5 py-12 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {infoCards.map((c, i) => (
            <Reveal key={c.title} variant="up" delay={i * 120}>
              <div className="card-lift h-full rounded-2xl border border-line bg-surface/60 p-7 backdrop-blur-sm">
                <p aria-hidden className="text-3xl">
                  {c.icon}
                </p>
                <h2 className="font-display mt-4 text-xl">{c.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {c.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- DIRECTIONS */}
      <section className="relative px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <Reveal variant="fade">
              <p className="eyebrow mb-4">Getting Here</p>
            </Reveal>
            <Reveal variant="up" delay={100}>
              <h2 className="font-display text-3xl sm:text-4xl">
                Three roads to the gate
              </h2>
            </Reveal>
            <div className="mt-8 space-y-6">
              {[
                {
                  from: "From Colombo (≈ 3.5 h)",
                  route:
                    "Take the A3 north through Negombo and Puttalam, then follow the A12 towards Anuradhapura; the signed park turn-off at Thimbiriwewa leads 8 km to the Hunuwilagama gate.",
                },
                {
                  from: "From Anuradhapura (≈ 1 h)",
                  route:
                    "Head west on the A12 for about 36 km and turn right at the Wilpattu junction — handy if you're combining safari with the ancient cities.",
                },
                {
                  from: "From the airport (CMB)",
                  route:
                    "We arrange private transfers from Bandaranaike International — about 3 hours door-to-door, with a lagoon-crab lunch stop in Puttalam if you time it right.",
                },
              ].map((d, i) => (
                <Reveal key={d.from} variant="left" delay={200 + i * 130}>
                  <div className="rounded-2xl border border-line bg-surface/60 p-6 backdrop-blur-sm">
                    <h3 className="font-display text-lg text-gold">{d.from}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {d.route}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <Reveal variant="fade">
              <p className="eyebrow mb-4">Pack Light, Pack Right</p>
            </Reveal>
            <Reveal variant="up" delay={100}>
              <h2 className="font-display text-3xl sm:text-4xl">
                What to bring
              </h2>
            </Reveal>
            <Reveal variant="up" delay={220}>
              <ul className="mt-8 space-y-4">
                {packing.map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 rounded-xl border border-line bg-surface/50 px-5 py-4 text-sm leading-relaxed text-foreground/90"
                  >
                    <span aria-hidden className="text-gold">
                      ✦
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal variant="up" delay={340}>
              <p className="mt-8 rounded-2xl border border-gold/30 bg-gold/5 p-6 text-sm leading-relaxed text-muted">
                <strong className="text-gold">Good to know:</strong> the park
                closes entry at 4:30 PM and jeeps must exit by 6 PM. During
                heavy North-East monsoon rains (roughly November–January) some
                internal roads close — we&apos;ll always tell you honestly before
                you book.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
