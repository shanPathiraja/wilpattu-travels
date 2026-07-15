"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

const links = [
  { href: "/", label: "Home" },
  { href: "/safari", label: "Safari" },
  { href: "/hotels", label: "Stay" },
  { href: "/gallery", label: "Gallery" },
  { href: "/dining", label: "Dining" },
  { href: "/location", label: "Visit" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 40,
    () => false,
  );

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-[#04110a]/85 backdrop-blur-md border-b border-line"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between h-16 sm:h-20">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/60 text-gold font-display text-lg transition group-hover:bg-gold/10">
            W
          </span>
          <span className="font-display tracking-[0.22em] text-sm sm:text-base uppercase">
            Wilpattu <span className="text-gold">Wilds</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-7 text-[0.82rem] tracking-[0.14em] uppercase">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`link-gold pb-1 transition-colors ${
                  pathname === l.href ? "text-gold" : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/safari#book"
              className="rounded-full border border-gold/70 px-5 py-2 text-gold transition hover:bg-gold hover:text-[#0a1a10]"
            >
              Book Now
            </Link>
          </li>
        </ul>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span
            className={`block h-px w-6 bg-foreground transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-6 bg-foreground transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {open && (
        <ul className="md:hidden border-t border-line px-6 py-5 space-y-4 text-sm tracking-[0.16em] uppercase bg-[#04110a]/95 backdrop-blur-md">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={closeMenu}
                className={pathname === l.href ? "text-gold" : "text-foreground/85"}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/safari#book" onClick={closeMenu} className="text-gold">
              Book Now →
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
