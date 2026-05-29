import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public endpoint — returns only non-hidden items for the frontend site
export async function GET() {
  try {
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
      socialLinks,
      audio,
      video,
      code,
      links,
      guestbookEntries,
      welcomePopup,
    ] = await Promise.all([
      db.profile.findFirst({ where: { hidden: false } }),
      db.education.findMany({ where: { hidden: false }, orderBy: { order: "asc" } }),
      db.experience.findMany({ where: { hidden: false }, orderBy: { order: "asc" } }),
      db.skill.findMany({ where: { hidden: false }, orderBy: { order: "asc" } }),
      db.project.findMany({ where: { hidden: false }, orderBy: { order: "asc" } }),
      db.galleryImage.findMany({ where: { hidden: false }, orderBy: { order: "asc" } }),
      db.note.findMany({ where: { hidden: false }, orderBy: { order: "asc" } }),
      db.quote.findMany({ where: { hidden: false }, orderBy: { order: "asc" } }),
      db.blogPost.findMany({ where: { hidden: false, published: true }, orderBy: { order: "asc" } }),
      db.storeProduct.findMany({ where: { hidden: false }, orderBy: { order: "asc" } }),
      db.socialLink.findMany({ where: { hidden: false }, orderBy: { order: "asc" } }),
      db.audio.findMany({ where: { hidden: false }, orderBy: { order: "asc" } }),
      db.video.findMany({ where: { hidden: false }, orderBy: { order: "asc" } }),
      db.code.findMany({ where: { hidden: false }, orderBy: { order: "asc" } }),
      db.link.findMany({ where: { hidden: false }, orderBy: { order: "asc" } }),
      db.guestbookEntry.findMany({ where: { hidden: false }, orderBy: { createdAt: "desc" } }),
      db.welcomePopup.findFirst({ where: { enabled: true } }),
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
      socialLinks,
      audio,
      video,
      code,
      links,
      guestbookEntries,
      welcomePopup,
    });
  } catch (error) {
    console.error("[/api/data] Database query failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch data", profile: null, education: [], experience: [], skills: [], projects: [], galleryImages: [], notes: [], quotes: [], blogPosts: [], storeProducts: [], socialLinks: [], audio: [], video: [], code: [], links: [], guestbookEntries: [], welcomePopup: null },
      { status: 500 }
    );
  }
}
