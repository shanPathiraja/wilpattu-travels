"use client";

import { useState, type FormEvent } from "react";

interface Option {
  value: string;
  label: string;
}

/**
 * Demo booking form — validates client-side and shows a confirmation state.
 * No payment or personal data leaves the browser.
 */
export default function BookingForm({
  kind,
  options,
  optionLabel,
}: {
  kind: "safari" | "hotel";
  options: Option[];
  optionLabel: string;
}) {
  const [sent, setSent] = useState(false);
  const [summary, setSummary] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const choice = options.find((o) => o.value === data.get("option"))?.label;
    setSummary(
      `${choice} · ${data.get("date")} · ${data.get("guests")} guest(s) — for ${data.get("name")}`,
    );
    setSent(true);
  };

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-3xl border border-gold/40 bg-surface/80 p-10 text-center backdrop-blur-md"
      >
        <p className="font-display text-3xl text-gradient-gold">
          Request received
        </p>
        <p className="mt-4 text-muted">{summary}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Our team will confirm availability by email within a few hours.
          (Demo site — no real booking was made.)
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-8 rounded-full border border-gold/60 px-7 py-3 text-sm uppercase tracking-[0.14em] text-gold transition hover:bg-gold hover:text-[#12200f]"
        >
          Make Another Request
        </button>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-line bg-[#07160e]/80 px-4 py-3.5 text-sm text-foreground placeholder:text-muted/60 outline-none transition focus:border-gold/60 focus:ring-1 focus:ring-gold/40";
  const label = "mb-2 block text-xs uppercase tracking-[0.2em] text-muted";

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-5 rounded-3xl border border-line bg-surface/70 p-7 backdrop-blur-md sm:grid-cols-2 sm:p-10"
    >
      <div className="sm:col-span-2">
        <label className={label} htmlFor={`${kind}-option`}>
          {optionLabel}
        </label>
        <select id={`${kind}-option`} name="option" required className={field}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={label} htmlFor={`${kind}-date`}>
          {kind === "hotel" ? "Check-in date" : "Safari date"}
        </label>
        <input
          id={`${kind}-date`}
          name="date"
          type="date"
          required
          className={field}
        />
      </div>

      <div>
        <label className={label} htmlFor={`${kind}-guests`}>
          Guests
        </label>
        <select id={`${kind}-guests`} name="guests" required className={field}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </div>

      {kind === "hotel" && (
        <div>
          <label className={label} htmlFor="hotel-nights">
            Nights
          </label>
          <select id="hotel-nights" name="nights" className={field}>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "night" : "nights"}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={kind === "hotel" ? "" : "sm:col-span-1"}>
        <label className={label} htmlFor={`${kind}-name`}>
          Full name
        </label>
        <input
          id={`${kind}-name`}
          name="name"
          type="text"
          required
          minLength={2}
          placeholder="Your name"
          className={field}
        />
      </div>

      <div className={kind === "hotel" ? "sm:col-span-2" : ""}>
        <label className={label} htmlFor={`${kind}-email`}>
          Email
        </label>
        <input
          id={`${kind}-email`}
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className={field}
        />
      </div>

      <div className="sm:col-span-2">
        <label className={label} htmlFor={`${kind}-notes`}>
          Notes <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          id={`${kind}-notes`}
          name="notes"
          rows={3}
          placeholder={
            kind === "safari"
              ? "Photography focus? Kids on board? Tell our trackers."
              : "Dietary needs, celebration, early check-in…"
          }
          className={field}
        />
      </div>

      <button
        type="submit"
        className="sm:col-span-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#12200f] transition hover:bg-gold-soft"
      >
        {kind === "safari" ? "Request Safari Booking" : "Request Room Booking"}
      </button>
      <p className="sm:col-span-2 text-center text-xs text-muted">
        No payment taken now — we confirm availability first, then send a
        secure payment link.
      </p>
    </form>
  );
}
