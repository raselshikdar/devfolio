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
    const product = data.storeProducts?.find(
      (p: Record<string, unknown>) => p.id === id
    );
    if (!product) return {};
    return {
      title: product.name as string,
      description:
        (product.description as string) || (product.name as string),
      openGraph: {
        title: product.name as string,
        description:
          (product.description as string) || (product.name as string),
        type: "article",
        images:
          (product.featuredImage as string) || (product.image as string)
            ? [
                {
                  url: (
                    (product.featuredImage as string) || (product.image as string)
                  ) as string,
                },
              ]
            : [],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name as string,
        description:
          (product.description as string) || (product.name as string),
      },
      alternates: { canonical: `https://raselsh.pro.bd/store/${id}` },
    };
  } catch {
    return {};
  }
}

export default function StoreDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
