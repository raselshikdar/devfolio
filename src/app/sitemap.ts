import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://raselsh.pro.bd";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const res = await fetch(`${baseUrl}/api/data`);
    if (!res.ok) return staticPages;
    const data = await res.json();

    const blogPages: MetadataRoute.Sitemap = (data.blogPosts || []).map(
      (post: Record<string, unknown>) => ({
        url: `${baseUrl}/blog/${post.id}`,
        lastModified: new Date(
          (post.updatedAt as string) ||
            (post.createdAt as string) ||
            Date.now()
        ),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })
    );

    const projectPages: MetadataRoute.Sitemap = (data.projects || []).map(
      (project: Record<string, unknown>) => ({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: new Date(
          (project.updatedAt as string) ||
            (project.createdAt as string) ||
            Date.now()
        ),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })
    );

    const storePages: MetadataRoute.Sitemap = (data.storeProducts || []).map(
      (product: Record<string, unknown>) => ({
        url: `${baseUrl}/store/${product.id}`,
        lastModified: new Date(
          (product.updatedAt as string) ||
            (product.createdAt as string) ||
            Date.now()
        ),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })
    );

    return [...staticPages, ...blogPages, ...projectPages, ...storePages];
  } catch {
    return staticPages;
  }
}
