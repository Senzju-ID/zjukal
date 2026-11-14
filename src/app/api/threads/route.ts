import { prisma } from "@/lib/prisma";
import fs from "node:fs/promises";
import path from "node:path";

export async function GET() {
  try {
    const threads = await prisma.thread.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { 
          select: { comments: true, likes: true } 
        },
      },
    });
    return Response.json(threads);
  } catch (err) {
    return Response.json({err, error: "Failed to fetch threads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const authorToken = formData.get("authorToken") as string;
    const file = formData.get("file") as File | null;

    if (!title || !description || !authorToken) {
      return Response.json(
        { error: "Title, description, and authorToken are required " },
        { status: 400 },
      );
    }

    let mediaUrl: string | null = null;
    let mediaType: string | null = null;
    let message: string | null = null;
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
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, fileName), buffer);

      mediaUrl = `/uploads/${fileName}`;
      messageFile = " and the image or video success upload";
    }

    const newThread = await prisma.thread.create({
      data: { title, description, authorToken, mediaUrl, mediaType },
    });

    message = `Thread success create${messageFile}`

    return Response.json({ ...newThread, message: message }, { status: 201 });
  } catch (err) {
    return Response.json({err, error: "Failed create thread" }, { status: 500 });
  }
}

