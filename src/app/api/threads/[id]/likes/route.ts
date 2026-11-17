import { prisma } from "@/lib/prisma";
import { getOrCreateAnonymousUser } from "@/lib/userToken";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const threadId = Number(id);

    if (!Number.isSafeInteger(threadId) || threadId <= 0) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }

    const user = await getOrCreateAnonymousUser();
    const anonymousUserId = user.id;

    const [existingLike, existingDislike] = await Promise.all([
      prisma.like.findUnique({
        where: { threadId_anonymousUserId: { threadId, anonymousUserId } },
      }),
      prisma.dislike.findUnique({
        where: { threadId_anonymousUserId: { threadId, anonymousUserId } },
      }),
    ]);

    if (existingLike) {
      await prisma.$transaction([
        prisma.like.delete({ where: { id: existingLike.id } }),
        prisma.thread.update({
          where: { id: threadId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);

      return Response.json(
        { liked: false, disliked: false, message: "Unliked thread" },
        { status: 200 },
      );
    }

    if (existingDislike) {
      await prisma.$transaction([
        prisma.like.create({ data: { threadId, anonymousUserId } }),
        prisma.dislike.delete({ where: { id: existingDislike.id } }),
        prisma.thread.update({
          where: { id: threadId },
          data: {
            likesCount: { increment: 1 },
            dislikesCount: { decrement: 1 },
          },
        }),
      ]);

      return Response.json(
        {
          liked: true,
          disliked: false,
          message: "Liked thread and Undislike thread",
        },
        { status: 200 },
      );
    } else {
      await prisma.$transaction([
        prisma.like.create({ data: { threadId, anonymousUserId } }),
        prisma.thread.update({
          where: { id: threadId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);

      return Response.json(
        { liked: true, disliked: false, message: "Liked thread" },
        { status: 200 },
      );
    }
  } catch (err) {
    return Response.json(
      { err, error: "Failed to toggle like" },
      { status: 500 },
    );
  }
}
