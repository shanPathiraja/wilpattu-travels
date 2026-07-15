"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Translates its child vertically based on its position in the viewport.
 * speed 0.2 → moves 20% of the scroll delta (positive = slower than page).
 */
export default function Parallax({
  children,
  speed = 0.18,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = outer.current;
      const target = inner.current;
      if (!el || !target) return;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      target.style.transform = `translate3d(0, ${center * speed}px, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} className="relative h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
