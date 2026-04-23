import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUserWithProfile } from "@/lib/auth";
import { generateSummary } from "@/lib/ai";

const bodySchema = z.object({
  content: z.string().min(20).max(20000),
});

export async function POST(request: Request) {
  const { user, profile } = await getCurrentUserWithProfile();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!profile || (profile.role !== "author" && profile.role !== "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    const summary = await generateSummary(parsed.data.content);
    return NextResponse.json({ summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate summary";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
