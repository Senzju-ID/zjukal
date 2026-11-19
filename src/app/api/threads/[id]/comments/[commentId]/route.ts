import { prisma } from "@/lib/prisma";
import { getOrCreateAnonymousUser } from "@/lib/userToken";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  try {
    const { id, commentId } = await params;
    const threadIdNum = Number(id);
    const commentIdNum = Number(commentId);

    if (
      !Number.isSafeInteger(threadIdNum) ||
      threadIdNum <= 0 ||
      !Number.isSafeInteger(commentIdNum) ||
      commentIdNum <= 0
    ) {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }

    const user = await getOrCreateAnonymousUser();

    const comment = await prisma.comment.findFirst({
        where: {
            id: commentIdNum,
            threadId: threadIdNum,
            anonymousUserId: user.id,
        }
    })

    if (!comment) {
        return Response.json({error: "Comment not found"}, {status: 404});
    }

    await prisma.$transaction([
      prisma.comment.delete({
        where: { id: commentIdNum },
      }),
      prisma.thread.update({
        where: { id: threadIdNum },
        data: {
          commentsCount: { decrement: 1 },
        },
      }),
    ]);

    return Response.json(
      { message: "Successfully deleted comment" },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { err, error: "Failed to delete comment" },
      { status: 500 },
    );
  }
}
