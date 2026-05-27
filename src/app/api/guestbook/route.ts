import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const item = await db.guestbookEntry.create({ data: { name: data.name, location: data.location, email: data.email || null, phone: data.phone || null, message: data.message || null } });
  return NextResponse.json(item);
}

export async function GET() {
  const entries = await db.guestbookEntry.findMany({ where: { hidden: false }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(entries);
}
