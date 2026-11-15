import { prisma } from "@/lib/prisma";
import { getGuestToken } from "@/lib/userToken";

export async function POST(request: Request, {params}: {params: Promise<{id: string, commentId: string}>}) {
    try {
        const { commentId } = await params;
        const commentIdNum = Number(commentId)

        if (isNaN(commentIdNum)) {
            return Response.json({ error: "Invalid comment ID"}, {status: 400 })
        };

        const authorToken = await getGuestToken();

        if (!authorToken) {
            return Response.json({ error: "authorToken are required"}, {status: 400})
        }

        const existingLike = await prisma.like.findUnique({
            where: {
                commentId_authorToken: { commentId: commentIdNum, authorToken},
            },
        });

        if (existingLike) {
            await prisma.$transaction([
                prisma.like.delete({ where: { id: existingLike.id } }),
                prisma.comment.update({
                    where: { id: commentIdNum },
                    data: { likesCount: { decrement: 1}}
                })
            ]);
            
            return Response.json({ liked: false, message: "Unliked thread"}, { status: 200})
        } else {
            await prisma.$transaction([
                prisma.like.create({ data: { commentId: commentIdNum, authorToken}}),
                prisma.comment.update({
                    where: { id: commentIdNum },
                    data: { likesCount: { increment:1 }}
                })
            ]);
            
            return Response.json({ liked: true, message: "Liked thread"}, { status: 200})
        }
        } catch (err) {
        return Response.json({err, error: "Failed to toggle like"}, {status: 500})
    }
}