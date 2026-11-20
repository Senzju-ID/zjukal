
import { prisma } from "@/lib/prisma";
import { getOrCreateAnonymousUser } from "@/lib/userToken";
import { getPublicUrl } from "@/lib/neonStorage";

export async function GET() {
  try {
    const threads = await prisma.thread.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        mediaUrl: true,
        mediaType: true,
        createdAt: true,
        commentsCount: true,
        likesCount: true,
        dislikesCount: true,
      },
    });

    return Response.json(threads, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch threads:", err);

    return Response.json(
      { error: "Failed to fetch threads" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getOrCreateAnonymousUser();
    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim() : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const mediaKey =
      typeof body.mediaKey === "string" ? body.mediaKey : null;

    const mediaType = body.mediaType;

    if (!title || !description) {
      return Response.json(
        { error: "Title and description are required" },
        { status: 400 },
      );
    }

    let mediaUrl: string | null = null;
    let validatedMediaType: string | null = null;

    if (mediaKey !== null) {
      const allowedPrefix = `uploads/${user.id}/`;

      if (!mediaKey.startsWith(allowedPrefix)) {
        return Response.json(
          { error: "Invalid media ownership" },
          { status: 403 },
        );
      }

      const extension = mediaKey.split(".").pop()?.toLowerCase();

      const isImage = ["png", "jpg", "jpeg"].includes(extension || "");
      const isVideo = ["mp4", "webm"].includes(extension || "");

      if (!isImage && !isVideo) {
        return Response.json(
          { error: "Unsupported media format" },
          { status: 400 },
        );
      }

      const expectedMediaType = isImage ? "IMAGE" : "VIDEO";

      if (mediaType !== expectedMediaType) {
        return Response.json(
          { error: "Invalid media type" },
          { status: 400 },
        );
      }

      mediaUrl = getPublicUrl(mediaKey);
      validatedMediaType = expectedMediaType;
    } else if (mediaType !== null) {
      return Response.json(
        { error: "Media key is required" },
        { status: 400 },
      );
    }

    const newThread = await prisma.thread.create({
      data: {
        title,
        description,
        anonymousUserId: user.id,
        mediaUrl,
        mediaType: validatedMediaType,
      },
      select: {
        id: true,
        title: true,
        description: true,
        mediaUrl: true,
        mediaType: true,
        createdAt: true,
        commentsCount: true,
        likesCount: true,
        dislikesCount: true,
      },
    });

    return Response.json(
      {
        ...newThread,
        message: "Thread successfully created",
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Failed to create thread:", err);

    return Response.json(
      { error: "Failed to create thread" },
      { status: 500 },
    );
  }
}
