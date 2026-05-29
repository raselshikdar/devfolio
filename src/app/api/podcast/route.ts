import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public endpoint - returns current podcast status for frontend polling
// Only returns isActive, title, streamUrl, status, description
export async function GET() {
  try {
    const podcast = await db.livePodcast.findFirst();

    if (!podcast || !podcast.isActive) {
      return NextResponse.json({
        isLive: false,
        title: null,
        streamUrl: null,
        status: "offline",
        description: null,
      });
    }

    return NextResponse.json({
      isLive: true,
      title: podcast.title,
      streamUrl: podcast.streamUrl,
      status: podcast.status,
      description: podcast.description,
    });
  } catch (error) {
    console.error("[/api/podcast] Error:", error);
    return NextResponse.json(
      { isLive: false, title: null, streamUrl: null, status: "offline", description: null },
      { status: 500 }
    );
  }
}
