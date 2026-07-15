import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";
import SectionHeading from "@/components/SectionHeading";
import {
  heroImages,
  parkFacts,
  rooms,
  safariPackages,
  testimonials,
  wildlife,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Wilpattu Wilds — Safari Jeep Tours & Jungle Lodge, Sri Lanka",
  description:
    "Walk into the wild heart of Sri Lanka. Leopard jeep safaris, a villu-edge jungle lodge, fire-cooked Sri Lankan food and the silence of Wilpattu National Park.",
  alternates: { canonical: "/" },
};

const heroWords = "Into the Wild Heart of Sri Lanka".split(" ");

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------ HERO (WebGL behind) */}
      <section className="relative flex min-h-svh flex-col items-center justify-center px-5 text-center">
        <p
          className="eyebrow mb-6 opacity-0"
          style={{ animation: "word-rise 1s 0.2s both" }}
        >
          Wilpattu National Park · Sri Lanka
        </p>
        <h1 className="font-display max-w-5xl text-5xl leading-[1.06] sm:text-7xl lg:text-8xl">
          {heroWords.map((w, i) => (
            <span key={i} className="word-mask mr-[0.28em] last:mr-0">
              <span
                className="word-rise"
                style={{ animationDelay: `${0.35 + i * 0.12}s` }}
              >
                {w === "Wild" ? (
                  <em className="not-italic text-gradient-gold">{w}</em>
                ) : (
                  w
                )}
              </span>
            </span>
          ))}
        </h1>
        <p
          className="mt-8 max-w-xl text-base text-muted sm:text-lg opacity-0"
          style={{ animation: "word-rise 1s 1.3s both" }}
        >
          Leopards on red-dust roads. Sixty lakes hidden in old forest. A lodge
          lit by fireflies. This is the island&apos;s largest wilderness — and
          it is waiting.
        </p>
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-4 opacity-0"
          style={{ animation: "word-rise 1s 1.55s both" }}
        >
          <Link
            href="/safari"
            className="rounded-full bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-[#12200f] transition hover:bg-gold-soft"
          >
            Book a Safari
          </Link>
          <Link
            href="/hotels"
            className="rounded-full border border-foreground/30 px-8 py-3.5 text-sm uppercase tracking-[0.14em] transition hover:border-gold hover:text-gold"
          >
            Stay at the Lodge
          </Link>
        </div>

        <div className="absolute bottom-8 flex flex-col items-center gap-2 text-muted">
          <span className="text-[0.65rem] uppercase tracking-[0.3em]">
            Walk into the forest
          </span>
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-foreground/25 p-1.5">
            <span className="scroll-cue-dot block h-1.5 w-1 rounded-full bg-gold" />
          </span>
        </div>
      </section>

      {/* --------------------------------------------------------- PARK FACTS */}
      <section className="relative px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {parkFacts.map((f, i) => (
            <Reveal key={f.label} variant="up" delay={i * 120}>
              <div className="card-lift rounded-2xl border border-line bg-surface/60 p-8 backdrop-blur-sm">
                <p className="font-display text-4xl sm:text-5xl">
                  <span className="text-gradient-gold">{f.value}</span>
                  <span className="ml-2 text-lg text-muted">{f.unit}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {f.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- INTRO */}
      <section className="relative px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div>
            <Reveal variant="fade">
              <p className="eyebrow mb-4">The Land of Lakes</p>
            </Reveal>
            <Reveal variant="up" delay={100}>
              <h2 className="font-display text-3xl leading-tight sm:text-5xl">
                Wilpattu means{" "}
                <em className="not-italic text-gradient-gold">
                  “land of villus”
                </em>{" "}
                — and the lakes make the wild.
              </h2>
            </Reveal>
            <Reveal variant="up" delay={220}>
              <p className="mt-6 leading-relaxed text-muted">
                Nearly sixty rain-fed lakes — the villus — are scattered
                through 1,317 km² of dense dry-zone forest. Declared a
                national park in 1938, Wilpattu is Sri Lanka&apos;s largest and
                one of its oldest protected areas, yet it stays blissfully
                uncrowded: long red-earth roads, deep shade, and animals that
                appear like apparitions between the trees.
              </p>
            </Reveal>
            <Reveal variant="up" delay={340}>
              <p className="mt-4 leading-relaxed text-muted">
                Leopard, sloth bear, elephant, mugger crocodile and nearly two
                hundred bird species live around the water. We&apos;ve spent a
                decade learning their routines — so your jeep is where the
                forest happens.
              </p>
            </Reveal>
            <Reveal variant="up" delay={440}>
              <Link
                href="/location"
                className="link-gold mt-8 inline-block text-sm uppercase tracking-[0.16em] text-gold"
              >
                Plan your visit →
              </Link>
            </Reveal>
          </div>

          <div className="relative">
            <Reveal variant="scale">
              <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-3xl border border-line">
                <Image
                  src={heroImages.villu}
                  alt="Storm light over a villu lake in Wilpattu National Park"
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal variant="left" delay={250}>
              <figure className="absolute -bottom-8 -left-4 max-w-[240px] rounded-2xl border border-line bg-surface/90 p-5 backdrop-blur-md sm:-left-10">
                <blockquote className="font-display text-sm leading-relaxed">
                  “The villu at dusk is the closest thing I know to a held
                  breath.”
                </blockquote>
                <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">
                  — Ranga, head tracker
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- WILDLIFE */}
      <section className="relative px-5 py-24 sm:px-8">
        <SectionHeading
          eyebrow="Who You'll Meet"
          title="The residents of Wilpattu"
          intro="Six flagship species — tracked daily by our naturalists so every drive starts with yesterday's news from the forest."
        />
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wildlife.map((animal, i) => (
            <Reveal key={animal.name} variant="up" delay={(i % 3) * 130}>
              <article className="card-lift img-zoom group relative overflow-hidden rounded-3xl border border-line bg-surface/50">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={animal.src}
                    alt={animal.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.25em] text-gold">
                    {animal.tag}
                  </p>
                  <h3 className="font-display mt-2 text-2xl">{animal.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {animal.blurb}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------- SAFARI TEASER */}
      <section className="relative overflow-hidden py-28">
        <Parallax speed={-0.12} className="absolute inset-0">
          <Image
            src={heroImages.safari}
            alt="Safari jeep silhouetted against an orange Wilpattu sunset"
            fill
            sizes="100vw"
            className="scale-110 object-cover opacity-45"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-xl">
            <Reveal variant="fade">
              <p className="eyebrow mb-4">Safari Jeep Tours</p>
            </Reveal>
            <Reveal variant="up" delay={100}>
              <h2 className="font-display text-4xl leading-tight sm:text-5xl">
                Four ways into the forest
              </h2>
            </Reveal>
            <Reveal variant="up" delay={220}>
              <p className="mt-5 leading-relaxed text-muted">
                Dawn patrols, golden-hour drives, full-day expeditions and
                overnight fly-camps — every safari in a custom open-top Land
                Cruiser with a naturalist tracker and park fees included.
              </p>
            </Reveal>
            <div className="mt-8 space-y-3">
              {safariPackages.slice(0, 3).map((p, i) => (
                <Reveal key={p.id} variant="left" delay={300 + i * 120}>
                  <Link
                    href="/safari"
                    className="group flex items-center justify-between rounded-2xl border border-line bg-surface/70 px-6 py-4 backdrop-blur-sm transition hover:border-gold/50"
                  >
                    <div>
                      <p className="font-display text-lg">{p.name}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        {p.duration}
                      </p>
                    </div>
                    <p className="font-display text-gold">
                      ${p.priceUSD}
                      <span className="ml-1 text-xs text-muted">pp</span>
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal variant="up" delay={700}>
              <Link
                href="/safari"
                className="mt-8 inline-block rounded-full bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-[#12200f] transition hover:bg-gold-soft"
              >
                View All Safaris
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- STAY TEASER */}
      <section className="relative px-5 py-24 sm:px-8">
        <SectionHeading
          eyebrow="Stay With Us"
          title="Sleep where the forest sleeps"
          intro="Suites, villas, tents and bungalows on a private waterhole two minutes from the park gate."
        />
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room, i) => (
            <Reveal key={room.id} variant="up" delay={i * 120}>
              <Link
                href="/hotels"
                className="card-lift img-zoom group block overflow-hidden rounded-3xl border border-line bg-surface/50"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={room.photo.src}
                    alt={room.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 90vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04110a] via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-xl">{room.name}</h3>
                    <p className="mt-1 text-sm text-gold">
                      from ${room.priceUSD}
                      <span className="text-muted"> / night</span>
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ TESTIMONIALS */}
      <section className="relative px-5 py-24 sm:px-8">
        <SectionHeading eyebrow="Field Notes" title="Stories from the jeep" />
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} variant="blur" delay={i * 150}>
              <figure className="card-lift flex h-full flex-col rounded-3xl border border-line bg-surface/60 p-8 backdrop-blur-sm">
                <div aria-hidden className="font-display text-5xl text-gold/60">
                  “
                </div>
                <blockquote className="flex-1 leading-relaxed text-foreground/90">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-semibold">{t.name}</span>
                  <span className="ml-2 text-muted">{t.origin}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- CTA BANNER */}
      <section className="relative overflow-hidden px-5 py-32 text-center sm:px-8">
        <div className="absolute inset-0 -z-10">
          <Image
            src={heroImages.jungle}
            alt="Twilight over dense green forest canopy"
            fill
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
        </div>
        <Reveal variant="scale">
          <h2 className="font-display mx-auto max-w-3xl text-4xl leading-tight sm:text-6xl">
            The forest keeps no schedule.{" "}
            <span className="text-gradient-gold">Come anyway.</span>
          </h2>
        </Reveal>
        <Reveal variant="up" delay={200}>
          <p className="mx-auto mt-6 max-w-xl text-muted">
            Season runs February to October. Leopards run year-round.
          </p>
        </Reveal>
        <Reveal variant="up" delay={340}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/safari#book"
              className="rounded-full bg-gold px-9 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#12200f] transition hover:bg-gold-soft"
            >
              Book Your Safari
            </Link>
            <Link
              href="/gallery"
              className="rounded-full border border-foreground/30 px-9 py-4 text-sm uppercase tracking-[0.14em] transition hover:border-gold hover:text-gold"
            >
              See the Gallery
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
