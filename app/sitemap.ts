import type { MetadataRoute } from "next";

const SITE_URL = "https://wilpattuwilds.lk";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/safari", priority: 0.9 },
    { path: "/hotels", priority: 0.9 },
    { path: "/gallery", priority: 0.7 },
    { path: "/dining", priority: 0.7 },
    { path: "/location", priority: 0.6 },
  ];
  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: r.priority,
  }));
}
