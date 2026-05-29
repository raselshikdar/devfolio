import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function verifyAuth(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try { return atob(token).includes(":"); } catch { return false; }
}

// GET - list comments (optionally filter by blogPostId)
export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const blogPostId = searchParams.get("blogPostId");
  const where = blogPostId ? { blogPostId } : {};
  const comments = await db.blogComment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { blogPost: { select: { title: true } } },
  });
  return NextResponse.json(comments);
}

// PUT - update comment (e.g., hide/unhide)
export async function PUT(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const { id, ...updateData } = data;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const item = await db.blogComment.update({ where: { id }, data: updateData });
  return NextResponse.json(item);
}

// DELETE - delete comment
export async function DELETE(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  await db.blogComment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
