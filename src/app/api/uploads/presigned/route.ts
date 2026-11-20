import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getOrCreateAnonymousUser } from "@/lib/userToken";
import { createPresignedUploadUrl } from "@/lib/neonStorage";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string[]> = {
  "image/png": ["png"],
  "image/jpeg": ["jpg", "jpeg"],
  "video/mp4": ["mp4"],
  "video/webm": ["webm"],
};

export async function POST(request: Request) {
  try {
    const user = await getOrCreateAnonymousUser();

    const body = await request.json();
    const fileName =
      typeof body.fileName === "string" ? body.fileName : "";
    const contentType =
      typeof body.contentType === "string"
        ? body.contentType.toLowerCase()
        : "";
    const size = body.size;

    if (
      !fileName ||
      typeof size !== "number" ||
      !Number.isSafeInteger(size) ||
      size <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid file information" },
        { status: 400 },
      );
    }

    const extension = fileName.split(".").pop()?.toLowerCase();
    const allowedExtensions = ALLOWED_TYPES[contentType];

    if (!allowedExtensions || !allowedExtensions.includes(extension || "")) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 },
      );
    }

    if (size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Maximum file size is 50 MB" },
        { status: 400 },
      );
    }

    const mediaType = contentType.startsWith("image/")
      ? "IMAGE"
      : "VIDEO";

    const timestamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "");

    const storageKey = `uploads/${user.id}/${timestamp}.${extension}`;

    const upload = await createPresignedUploadUrl({
      key: storageKey,
      contentType,
    });

    return NextResponse.json(
      {
        key: upload.key,
        uploadUrl: upload.uploadUrl,
        publicUrl: upload.publicUrl,
        headers: upload.headers,
        mediaType,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Presigned upload error:", error);

    return NextResponse.json(
      { error: "Failed to create upload URL" },
      { status: 500 },
    );
  }
}