import type { MetadataRoute } from "next"
import { getGalleries } from "../lib/reader"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""
  const galleries = await getGalleries()

  return [
    { url: `${siteUrl}/`, priority: 1, changeFrequency: "weekly" },
    { url: `${siteUrl}/galleries`, priority: 0.9, changeFrequency: "weekly" },
    ...galleries.map((g) => ({
      url: `${siteUrl}/galleries/${g.slug}`,
      lastModified: g.entry.shootDate ? new Date(g.entry.shootDate) : new Date(),
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
  ]
}
