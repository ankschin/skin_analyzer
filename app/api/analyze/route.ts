import { NextRequest, NextResponse } from "next/server";
import { analyzeImage } from "@/lib/analyzeImage";

export async function POST(request: NextRequest) {
  let imageBase64: string;

  try {
    const body = await request.json();
    imageBase64 = body.imageBase64;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!imageBase64 || typeof imageBase64 !== "string") {
    return NextResponse.json({ error: "imageBase64 is required." }, { status: 400 });
  }

  try {
    const result = await analyzeImage(imageBase64);
    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Could not analyze the image. Please ensure your face is clearly visible.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
