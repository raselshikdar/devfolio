import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function verifyAuth(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try { return atob(token).includes(":"); } catch { return false; }
}

// GET - list all guestbook entries (admin only)
export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const entries = await db.guestbookEntry.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(entries);
}

// POST - create a new guestbook entry (admin only)
export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const entry = await db.guestbookEntry.create({
    data: {
      name: data.name || "",
      location: data.location || "",
      email: data.email || null,
      phone: data.phone || null,
      message: data.message || null,
      hidden: data.hidden ?? false,
    },
  });
  return NextResponse.json(entry);
}

// PUT - update a guestbook entry (admin only)
export async function PUT(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const { id, ...updateData } = data;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const entry = await db.guestbookEntry.update({ where: { id }, data: updateData });
  return NextResponse.json(entry);
}

// DELETE - delete a guestbook entry (admin only)
export async function DELETE(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  await db.guestbookEntry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
