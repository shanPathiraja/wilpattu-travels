import Image from "next/image";
import Reveal from "@/components/Reveal";

export default function PageHero({
  image,
  alt,
  eyebrow,
  title,
  intro,
}: {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="relative flex min-h-[68vh] items-end overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover kenburns opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-background/60" />
      </div>
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 pb-16 pt-40">
        <Reveal variant="fade">
          <p className="eyebrow mb-4">{eyebrow}</p>
        </Reveal>
        <Reveal variant="up" delay={120}>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl max-w-3xl leading-[1.05]">
            {title}
          </h1>
        </Reveal>
        <Reveal variant="up" delay={260}>
          <p className="mt-6 max-w-xl text-muted leading-relaxed">{intro}</p>
        </Reveal>
      </div>
    </section>
  );
}
