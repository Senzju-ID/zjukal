import { prisma } from "@/lib/prisma";
import { getOrCreateAnonymousUser } from "@/lib/userToken";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  try {
    const { commentId } = await params;
    const commentIdNum = Number(commentId);

    if (!Number.isSafeInteger(commentIdNum) || commentIdNum <= 0) {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }

    const user = await getOrCreateAnonymousUser();
    const anonymousUserId = user.id;

    const existingLike = await prisma.like.findUnique({
      where: {
        commentId_anonymousUserId: { commentId: commentIdNum, anonymousUserId },
      },
    });

    if (existingLike) {
      await prisma.$transaction([
        prisma.like.delete({ where: { id: existingLike.id } }),
        prisma.comment.update({
          where: { id: commentIdNum },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);

      return Response.json(
        { liked: false, message: "Unliked comment" },
        { status: 200 },
      );
    } else {
      await prisma.$transaction([
        prisma.like.create({ data: { commentId: commentIdNum, anonymousUserId } }),
        prisma.comment.update({
          where: { id: commentIdNum },
          data: { likesCount: { increment: 1 } },
        }),
      ]);

      return Response.json(
        { liked: true, message: "Liked comment" },
        { status: 200 },
      );
    }
  } catch (err) {
    return Response.json(
      { err, error: "Failed to toggle like comment" },
      { status: 500 },
    );
  }
}
