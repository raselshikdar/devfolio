import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function verifyAuth(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try { return Buffer.from(token, "base64").toString().includes(":"); } catch { return false; }
}

// GET - return the active (enabled) popup for public, or all popups for admin
export async function GET(req: NextRequest) {
  const isAdmin = verifyAuth(req);
  if (isAdmin) {
    const popups = await db.welcomePopup.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(popups);
  }
  // Public: return only the first enabled popup
  const popup = await db.welcomePopup.findFirst({ where: { enabled: true } });
  return NextResponse.json(popup);
}

// POST - create a new popup (admin only)
export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const popup = await db.welcomePopup.create({
    data: {
      title: data.title || "Welcome!",
      message: data.message || "",
      imageUrl: data.imageUrl || null,
      buttonText: data.buttonText || null,
      buttonUrl: data.buttonUrl || null,
      enabled: data.enabled ?? true,
      showOnce: data.showOnce ?? true,
    },
  });
  return NextResponse.json(popup);
}

// PUT - update a popup (admin only)
export async function PUT(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const { id, ...updateData } = data;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const popup = await db.welcomePopup.update({ where: { id }, data: updateData });
  return NextResponse.json(popup);
}

// DELETE - delete a popup (admin only)
export async function DELETE(req: NextRequest) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  await db.welcomePopup.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
