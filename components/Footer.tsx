import Link from "next/link";

const fireflySpots = [
  { left: "8%", top: "30%", delay: "0s", dur: "3.2s" },
  { left: "22%", top: "62%", delay: "1.1s", dur: "4.1s" },
  { left: "41%", top: "22%", delay: "0.4s", dur: "3.7s" },
  { left: "63%", top: "55%", delay: "2s", dur: "3s" },
  { left: "78%", top: "28%", delay: "0.8s", dur: "4.4s" },
  { left: "91%", top: "60%", delay: "1.6s", dur: "3.4s" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-[#03100933] backdrop-blur-sm overflow-hidden">
      {/* ambient fireflies */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {fireflySpots.map((f, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-gold-soft shadow-[0_0_10px_3px_rgba(236,201,135,0.5)]"
            style={{
              left: f.left,
              top: f.top,
              animation: `firefly-blink ${f.dur} ease-in-out ${f.delay} infinite`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-4 relative">
        <div className="md:col-span-2">
          <p className="font-display tracking-[0.22em] uppercase text-lg">
            Wilpattu <span className="text-gold">Wilds</span>
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Safari outfitter &amp; jungle lodge on the border of Wilpattu
            National Park — the land of lakes, leopards and old forest.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted">
            Hunuwilagama, Wilpattu, Sri Lanka
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2.5 text-sm text-foreground/85">
            <li><Link className="link-gold" href="/safari">Safari Packages</Link></li>
            <li><Link className="link-gold" href="/hotels">Rooms &amp; Suites</Link></li>
            <li><Link className="link-gold" href="/gallery">Gallery</Link></li>
            <li><Link className="link-gold" href="/dining">Food &amp; Drinks</Link></li>
            <li><Link className="link-gold" href="/location">Getting Here</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Contact</p>
          <ul className="space-y-2.5 text-sm text-foreground/85">
            <li>
              <a className="link-gold" href="tel:+94771234567">+94 77 123 4567</a>
            </li>
            <li>
              <a className="link-gold" href="mailto:hello@wilpattuwilds.lk">
                hello@wilpattuwilds.lk
              </a>
            </li>
            <li className="text-muted">Park hours: 6 AM – 6 PM daily</li>
            <li className="text-muted">Season: Feb – Oct</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-5 text-center text-xs text-muted tracking-wide">
        © {new Date().getFullYear()} Wilpattu Wilds · Photography via Unsplash ·
        Crafted in the dry zone 🐆
      </div>
    </footer>
  );
}
