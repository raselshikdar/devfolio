import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function verifyAuth(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    return Buffer.from(token, "base64").toString().includes(":");
  } catch {
    return false;
  }
}

// GET - return podcast settings (admin only)
export async function GET(req: NextRequest) {
  if (!verifyAuth(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const podcast = await db.livePodcast.findFirst();
  return NextResponse.json(podcast);
}

// POST - create podcast settings (admin only, if none exist)
export async function POST(req: NextRequest) {
  if (!verifyAuth(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const existing = await db.livePodcast.findFirst();

  if (existing) {
    return NextResponse.json({ error: "Podcast config already exists. Use PUT to update." }, { status: 400 });
  }

  const podcast = await db.livePodcast.create({
    data: {
      title: data.title || "Live Podcast",
      streamUrl: data.streamUrl || null,
      sourceType: data.sourceType || "custom",
      isActive: data.isActive ?? false,
      status: data.status || "offline",
      description: data.description || null,
    },
  });
  return NextResponse.json(podcast);
}

// PUT - update podcast settings (admin only)
export async function PUT(req: NextRequest) {
  if (!verifyAuth(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const { id, ...updateData } = data;

  if (!id) {
    // If no id provided, find and update the first (and only) record
    const existing = await db.livePodcast.findFirst();
    if (!existing) {
      return NextResponse.json({ error: "No podcast config found. Use POST to create." }, { status: 404 });
    }
    const podcast = await db.livePodcast.update({
      where: { id: existing.id },
      data: updateData,
    });
    return NextResponse.json(podcast);
  }

  const podcast = await db.livePodcast.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json(podcast);
}

// DELETE - delete podcast settings (admin only)
export async function DELETE(req: NextRequest) {
  if (!verifyAuth(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.livePodcast.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
