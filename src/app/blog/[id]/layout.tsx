import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://raselsh.pro.bd";
    const res = await fetch(`${baseUrl}/api/data`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {};
    const data = await res.json();
    const post = data.blogPosts?.find((p: Record<string, unknown>) => p.id === id);
    if (!post) return {};
    return {
      title: post.title as string,
      description: (post.excerpt as string) || (post.title as string),
      openGraph: {
        title: post.title as string,
        description: (post.excerpt as string) || (post.title as string),
        type: "article",
        publishedTime: post.date as string | undefined,
        images:
          (post.featuredImage as string) || (post.image as string)
            ? [
                {
                  url: ((post.featuredImage as string) || (post.image as string)) as string,
                },
              ]
            : [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title as string,
        description: (post.excerpt as string) || (post.title as string),
      },
      alternates: { canonical: `https://raselsh.pro.bd/blog/${id}` },
    };
  } catch {
    return {};
  }
}

export default function BlogDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
