import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"


export async function DELETE(request: Request, 
    { params }: { params: Promise<{ id: string , commentId: string}>}
) {
    try {
        const { id , commentId } = await params;
        const commentIdNum = Number(commentId);

        if (isNaN(commentIdNum)) {
            return Response.json({error: "Invalid comment ID"}, {status: 400 });
        }

        await prisma.$transaction([
            prisma.comment.delete({
                where: {id: commentIdNum},
            }),
            prisma.thread.update({
                where: { id },
                data: {
                    commentsCount: { decrement: 1 }
                }
            })
        ])
        
        return Response.json({ message: "Successfully deleted comment" }, {status: 200})
    } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }
    return Response.json({err, error: "Failed to delete comment"}, { status: 500})
  }
}