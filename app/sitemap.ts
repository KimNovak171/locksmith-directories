import type { MetadataRoute } from "next";
import { getDirectoryIndex } from "@/lib/stateFacilities";

export const dynamic = "force-static";

const siteUrl = "https://locksmithdirectories.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const directory = await getDirectoryIndex();

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/advertise`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  for (const state of directory) {
    if (!state.stateSlug) continue;
    routes.push({
      url: `${siteUrl}/${state.stateSlug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    });

    for (const city of state.cities) {
      if (!city.citySlug) continue;
      routes.push({
        url: `${siteUrl}/${state.stateSlug}/${city.citySlug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return routes;
}
