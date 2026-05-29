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
    const project = data.projects?.find(
      (p: Record<string, unknown>) => p.id === id
    );
    if (!project) return {};
    return {
      title: project.name as string,
      description: (project.description as string) || (project.name as string),
      openGraph: {
        title: project.name as string,
        description: (project.description as string) || (project.name as string),
        type: "article",
        images:
          (project.featuredImage as string) || (project.image as string)
            ? [
                {
                  url: (
                    (project.featuredImage as string) || (project.image as string)
                  ) as string,
                },
              ]
            : [],
      },
      twitter: {
        card: "summary_large_image",
        title: project.name as string,
        description:
          (project.description as string) || (project.name as string),
      },
      alternates: { canonical: `https://raselsh.pro.bd/projects/${id}` },
    };
  } catch {
    return {};
  }
}

export default function ProjectsDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
