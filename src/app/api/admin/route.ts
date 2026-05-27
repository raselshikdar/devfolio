import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Verify admin token from cookie
function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString();
    return decoded.includes(":"); // Simple validation
  } catch {
    return false;
  }
}

// GET — fetch all data for admin dashboard
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    profile,
    education,
    experience,
    skills,
    projects,
    galleryImages,
    notes,
    quotes,
    blogPosts,
    storeProducts,
    messages,
    socialLinks,
    audio,
    video,
    code,
    links,
    guestbookEntries,
  ] = await Promise.all([
    db.profile.findFirst(),
    db.education.findMany({ orderBy: { order: "asc" } }),
    db.experience.findMany({ orderBy: { order: "asc" } }),
    db.skill.findMany({ orderBy: { order: "asc" } }),
    db.project.findMany({ orderBy: { order: "asc" } }),
    db.galleryImage.findMany({ orderBy: { order: "asc" } }),
    db.note.findMany({ orderBy: { order: "asc" } }),
    db.quote.findMany({ orderBy: { order: "asc" } }),
    db.blogPost.findMany({ orderBy: { order: "asc" } }),
    db.storeProduct.findMany({ orderBy: { order: "asc" } }),
    db.message.findMany({ orderBy: { createdAt: "desc" } }),
    db.socialLink.findMany({ orderBy: { order: "asc" } }),
    db.audio.findMany({ orderBy: { order: "asc" } }),
    db.video.findMany({ orderBy: { order: "asc" } }),
    db.code.findMany({ orderBy: { order: "asc" } }),
    db.link.findMany({ orderBy: { order: "asc" } }),
    db.guestbookEntry.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return NextResponse.json({
    profile,
    education,
    experience,
    skills,
    projects,
    galleryImages,
    notes,
    quotes,
    blogPosts,
    storeProducts,
    messages,
    socialLinks,
    audio,
    video,
    code,
    links,
    guestbookEntries,
  });
}
