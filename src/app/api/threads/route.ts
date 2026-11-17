import { prisma } from "@/lib/prisma";
import { getOrCreateAnonymousUser } from "@/lib/userToken";
import { uploadToNeonStorage } from "@/lib/neonStorage";

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
      }
    });
    return Response.json(threads, {status: 200});
  } catch (err) {
    return Response.json({err, error: "Failed to fetch threads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getOrCreateAnonymousUser();

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File | null;

    if (!title || !description) {
      return Response.json(
        { error: "Title, description, and authorToken are required " },
        { status: 400 },
      );
    }

    let mediaUrl: string | null = null;
    let mediaType: string | null = null;
    let messageFile = ""

    if (file && file.size > 0) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const mime = file.type;

      const isImage =
        ["png", "jpg", "jpeg"].includes(ext || "") && mime.startsWith("image/");
      const isVideo =
        ["mp4", "webm"].includes(ext || "") && mime.startsWith("video/");

      if (!isImage && !isVideo) {
        return Response.json(
          { error: "Only png, jpg, jpeg, mp4, webm allowed" },
          { status: 400 },
        );
      }

      mediaType = isImage ? "IMAGE" : "VIDEO";

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const storageKey = `uploads/${fileName}`;

      const uploadResult = await uploadToNeonStorage({
        key: storageKey,
        body: buffer,
        contentType: mime,
      });

      mediaUrl = uploadResult.url;
      messageFile = " and the image or video success upload";
    }

    const newThread = await prisma.thread.create({
      data: { title, description, anonymousUserId: user.id, mediaUrl, mediaType },
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
      }
    });

    return Response.json({ ...newThread, message: `Thread success create${messageFile}` }, { status: 201 });
  } catch (err) {
    return Response.json({err, error: "Failed create thread" }, { status: 500 });
  }
}

