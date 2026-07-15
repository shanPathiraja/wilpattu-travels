import Reveal from "@/components/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignCls} mb-12 sm:mb-16`}>
      <Reveal variant="fade">
        <p className="eyebrow mb-4">{eyebrow}</p>
      </Reveal>
      <Reveal variant="up" delay={100}>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal variant="up" delay={220}>
          <p className="mt-5 text-muted leading-relaxed">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
