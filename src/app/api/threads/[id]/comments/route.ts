import { prisma } from "@/lib/prisma";
import { getOrCreateAnonymousUser } from "@/lib/userToken";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const threadIdNum = Number(id);

    if (!Number.isSafeInteger(threadIdNum) || threadIdNum <= 0) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }

    const comments = await prisma.comment.findMany({
      where: { threadId: threadIdNum },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        threadId: true,
        context: true,
        createdAt: true,
        likesCount: true,
      },
    });

    return Response.json(
      { comments, message: "Successfully fetch comments" },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { err, error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const threadIdNum = Number(id);

    if (!Number.isSafeInteger(threadIdNum) || threadIdNum <= 0) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }

    const user = await getOrCreateAnonymousUser();
    const formData = await request.formData();
    const context = formData.get("context") as string;

    if (!context) {
      return Response.json(
        { error: "Context is required" },
        { status: 400 },
      );
    }

    const newComment = await prisma.$transaction([
      prisma.comment.create({
        data: {
          threadId: threadIdNum,
          context,
          anonymousUserId: user.id,
        },
        select: {
          id: true,
          threadId: true,
          context: true,
          createdAt: true,
          likesCount: true,
        },
      }),
      prisma.thread.update({
        where: { id : threadIdNum },
        data: {
          commentsCount: { increment: 1 },
        },
      }),
    ]);

    return Response.json(
      { comment: newComment, message: "Comment added successfully" },
      { status: 201 },
    );
  } catch (err) {
    return Response.json(
      { err, error: "Failed to add comment" },
      { status: 500 },
    );
  }
}
