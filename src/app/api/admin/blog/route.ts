import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function verifyAuth(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try { return atob(token).includes(":"); } catch { return false; }
}

export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const item = await db.blogPost.create({ data: { title: data.title, date: data.date || "", excerpt: data.excerpt || null, content: data.content || null, image: data.image || null, featuredImage: data.featuredImage || null, tags: data.tags || null, category: data.category || null, published: data.published || false, featured: data.featured || false, hidden: data.hidden || false, order: data.order || 0 } });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const { id, ...updateData } = data;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const item = await db.blogPost.update({ where: { id }, data: updateData });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  await db.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
