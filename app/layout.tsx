import type { Metadata } from "next";
import { Manrope, Marcellus } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import JungleCanvas from "@/components/three/JungleCanvas";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { heroImages } from "@/lib/content";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
});

const SITE_URL = "https://wilpattuwilds.lk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Wilpattu Wilds — Safari Jeep Tours & Jungle Lodge, Sri Lanka",
    template: "%s | Wilpattu Wilds",
  },
  description:
    "Leopard safaris and a luxury jungle lodge on the edge of Wilpattu National Park, Sri Lanka's largest wilderness. Book jeep safaris, villas, suites and tented camps.",
  keywords: [
    "Wilpattu National Park",
    "Wilpattu safari",
    "Sri Lanka leopard safari",
    "safari jeep booking",
    "Wilpattu hotel",
    "jungle lodge Sri Lanka",
    "Wilpattu accommodation",
    "sloth bear safari",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Wilpattu Wilds",
    title: "Wilpattu Wilds — Safari Jeep Tours & Jungle Lodge",
    description:
      "Leopard safaris and a luxury jungle lodge on the edge of Wilpattu National Park, Sri Lanka.",
    images: [
      {
        url: heroImages.safari,
        width: 2000,
        height: 1333,
        alt: "Safari jeep at sunset near Wilpattu National Park",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wilpattu Wilds — Safari Jeep Tours & Jungle Lodge",
    description:
      "Leopard safaris and a luxury jungle lodge on the edge of Wilpattu National Park, Sri Lanka.",
    images: [heroImages.safari],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  name: "Wilpattu Wilds",
  description:
    "Safari outfitter and jungle lodge at Wilpattu National Park, Sri Lanka — leopard jeep safaris, luxury villas, suites and tented camps.",
  url: SITE_URL,
  telephone: "+94771234567",
  email: "hello@wilpattuwilds.lk",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hunuwilagama",
    addressRegion: "North Western Province",
    addressCountry: "LK",
  },
  geo: { "@type": "GeoCoordinates", latitude: 8.4581, longitude: 80.0503 },
  openingHours: "Mo-Su 06:00-18:00",
  touristType: ["Wildlife enthusiasts", "Photographers", "Families"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${marcellus.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grain">
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <SmoothScroll>
          {/* Persistent WebGL jungle behind every page */}
          <JungleCanvas />
          <div
            aria-hidden
            className="jungle-vignette fixed inset-0 z-[1] pointer-events-none"
          />
          <Nav />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
