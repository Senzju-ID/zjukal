import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const threads = await prisma.thread.findMany({
      where: { anonymousUserId: userId },
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
    return Response.json({ error: "Failed to fetch user threads" }, { status: 500 });
  }
}