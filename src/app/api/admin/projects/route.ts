import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function verifyAuth(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try { return Buffer.from(token, "base64").toString().includes(":"); } catch { return false; }
}

export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const project = await db.project.create({ data: { name: data.name, description: data.description || "", image: data.image || null, featuredImage: data.featuredImage || null, demoUrl: data.demoUrl || null, githubUrl: data.githubUrl || null, tags: data.tags || null, category: data.category || null, featured: data.featured || false, hidden: data.hidden || false, order: data.order || 0 } });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const { id, ...updateData } = data;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const project = await db.project.update({ where: { id }, data: updateData });
  return NextResponse.json(project);
}

export async function DELETE(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  await db.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
