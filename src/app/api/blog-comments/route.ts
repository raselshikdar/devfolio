import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/* GET /api/blog-comments?blogPostId=xxx */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogPostId = searchParams.get("blogPostId");

    if (!blogPostId) {
      return NextResponse.json(
        { error: "blogPostId query parameter is required" },
        { status: 400 }
      );
    }

    const comments = await db.blogComment.findMany({
      where: { blogPostId, hidden: false },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("[/api/blog-comments GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

/* POST /api/blog-comments */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { blogPostId, name, content } = body;

    if (!blogPostId || typeof blogPostId !== "string") {
      return NextResponse.json(
        { error: "blogPostId is required" },
        { status: 400 }
      );
    }
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Verify the blog post exists
    const post = await db.blogPost.findUnique({ where: { id: blogPostId } });
    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const comment = await db.blogComment.create({
      data: {
        blogPostId,
        name: name.trim(),
        content: content.trim(),
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("[/api/blog-comments POST]", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
