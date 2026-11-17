import { prisma } from "@/lib/prisma"
import { getOrCreateAnonymousUser } from "@/lib/userToken";
import { deleteFromNeonStorage } from "@/lib/neonStorage";

const parseValidId = (idStr: string): number | null => {
  const num = Number(idStr);
  if (!Number.isSafeInteger(num) || num <= 0) return null;
  return num;
}

export async function PATCH(request: Request, { params }: {params:  Promise<{ id: string }>}) {
  try {
    const { id } = await params;
    const threadIdNum = parseValidId(id);

    if (!threadIdNum) {
      return Response.json({ error: "Thread not found"}, { status: 404 })
    }

    const user = await getOrCreateAnonymousUser();

    const thread = await prisma.thread.findFirst({
      where: { id: threadIdNum, anonymousUserId: user.id}
    })

    if (!thread) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const updateData: { title?: string; description?: string} = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const updateThread = await prisma.thread.update({
      where: { id: threadIdNum },
      data: updateData,
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
    })

    return Response.json(
      { thread: updateThread, message: "Successfully changed" },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({err, error: "Failed to update thread"}, {status: 500})
  }
}

export async function DELETE(request: Request, { params }: {params:  Promise<{ id: string }>}) {
  try {
    const { id } = await params;
    const threadIdNum = parseValidId(id);

    if (!threadIdNum) {
      return Response.json({ error: "Thread not found"}, { status: 404 })
    }

    const user = await getOrCreateAnonymousUser();

    const thread = await prisma.thread.findFirst({
      where: { id: threadIdNum, anonymousUserId: user.id},
      select: { id: true ,mediaUrl: true }
    })

    if (!thread) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }

    if (thread.mediaUrl) {
      try {
        const urlObj = new URL(thread.mediaUrl)
        const pathSegments = urlObj.pathname.split("/").filter(Boolean);
        pathSegments.shift();

        const storageKey = pathSegments.join("/");
        if ( storageKey ) {
          await deleteFromNeonStorage(storageKey);
        }
      } catch (storageErr) {
        console.error("Failed to delete object from Neon Storage:", storageErr);
      }
    }

    await prisma.thread.delete({
      where: { id: threadIdNum }
    }
  )

    return Response.json({ message: "Successfully deleted thread "}, { status: 200 })
  } catch (err) {
    return Response.json({err, error: "Failed to delete threads"}, { status: 500})
  }
}